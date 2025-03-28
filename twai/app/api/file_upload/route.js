import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
})

const prisma = new PrismaClient()

// Replace deprecated config export with runtime for edge function
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Step 1: Validate User Authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Step 2: Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = user.id // Extract user ID

    const formData = await req.formData()
    const file = formData.get("file")
    const add_embedding = formData.get("add_embedding")
    const title = formData.get("title") || ""
    const description = formData.get("description") || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 20MB" }, { status: 400 });
    }

    // Check if the file is a PDF based on the MIME type
    const fileType = file.type
    if (fileType !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file: Only PDF files allowed" }, { status: 400 })
    }

    // Step 4: Generate Unique File Name
    const fileName = `${randomUUID()}.pdf`

    const buffer = await file.arrayBuffer() // Convert the file to a buffer
    const bufferStream = Buffer.from(buffer) // Convert to Buffer object for S3 upload

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: bufferStream, // Upload buffer instead of stream
        ContentType: "application/pdf",
      }),
    )

    // Step 6: Generate File URL
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${fileName}`

    // Step 7: Store in Database
    await prisma.document.create({
      data: {
        userId,
        fileUrl,
        isEmbedded: add_embedding === "true",
        title,
        description,
      },
    })

    if (add_embedding === "true") {
      console.log("Uploading to pinecone")
      const res = await fetch(`${process.env.BACKEND_URL}/add_embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ s3_url: fileUrl, userId: user.id }),
      })

      if (!res.ok) {
        console.log("Failed to add embeddings")
        const d = await res.json()
        console.log(d)
        return NextResponse.json({ error: "Failed to add embeddings" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }
}
