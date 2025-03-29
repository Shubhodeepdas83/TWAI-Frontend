import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { filename, contentType } = await request.json();
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    // Generate a unique key for the file
    const fileId = uuidv4();
    const fileExtension = filename.split('.').pop();
    const key = `uploads/${user.id}/${fileId}.${fileExtension}`;

    // Create the command for putting the object in S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // Generate the signed URL (valid for 15 minutes)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    
    // Create the complete URL for accessing the file after upload
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      signedUrl,
      fileUrl,
      key
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
