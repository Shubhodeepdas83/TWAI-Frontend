import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export const maxDuration = 60; // 5 minutes

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle both JSON data (from direct S3 upload) and FormData (from traditional upload)
    let fileUrl, add_embedding, title, description, fileName;

    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      // Direct S3 upload method with JSON payload
      const body = await request.json();
      fileUrl = body.fileUrl;
      add_embedding = body.add_embedding;
      title = body.title || "Untitled Document";
      description = body.description || "";
      fileName = body.fileName;
    } else {
      // Traditional FormData upload method (keeping for backward compatibility)
      const formData = await request.formData();
      const file = formData.get("file");
      
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      
      // Process and upload file as before
      // ... existing code for FormData uploads ...
      // This code path will be removed once all clients use the signed URL approach
      
      return NextResponse.json({ error: "FormData upload no longer supported" }, { status: 400 });
    }

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        userId: user.id,
        awsFileUrl: fileUrl,
        fileUrl: fileUrl, // Temporary value, will be updated below
        description,
        title: title || fileName,
        isEmbedded: add_embedding,
      },
    });

    // Update the document with the correct fileUrl that includes the document ID
    const updatedDoc = await prisma.document.update({
      where: { id: document.id },
      data: {
        
        fileUrl: `${process.env.BASE_PATH}/api/documents/${document.id}.pdf`,
        awsFileUrl:document.fileUrl
      },
    });

    // If embeddings are requested, send to backend service
    if (add_embedding) {
      const embedResponse = await fetch(`${process.env.BACKEND_URL}/add_embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ s3_url: updatedDoc.fileUrl, userId: user.id }),
      });

      if (!embedResponse.ok) {
        console.error("Error adding embeddings");
        const errorData = await embedResponse.json();
        console.error(errorData);
      }
    }

    return NextResponse.json({ 
      success: true, 
      documentId: document.id 
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Error processing document" },
      { status: 500 }
    );
  }
}
