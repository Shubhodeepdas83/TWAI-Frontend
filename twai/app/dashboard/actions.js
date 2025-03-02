"use server"
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"; 
const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

export async function getUserDetails() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { failure: "not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      sessions: {
        select: {
          id: true,
          conversation: true,
          createdAt: true,
          summary: true,
        },
      },
      documents:{
        select:{
          id: true,
          fileUrl: true,
          uploadedAt: true,
        }
      }
    },
  });

  if (!user) {
    return { failure: "User not found" };
  }

  return { user };
}


export async function createSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { failure: "not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return { failure: "User not found" };
  }

  const newSession = await prisma.session.create({
    data: { userId: user.id },
  });

  return { sessionId: newSession.id };
}


export async function removeDocument(documentId) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { failure: "not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return { failure: "User not found" };
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { userId: true, fileUrl: true, isEmbedded: true },
  });

  if (!document) {
    return { failure: "Document not found" };
  }

  if (document.userId !== user.id) {
    return { failure: "Unauthorized" };
  }

  try {
    // Extract filename from the full URL
    const fileKey = document.fileUrl.substring(document.fileUrl.lastIndexOf('/') + 1);
    
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
      })
    );

    if(document.isEmbedded){
      const res = await fetch(`${process.env.BACKEND_URL}/delete_embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdf_url: document.fileUrl,userId:user.id }),
      });
      
      if (!res.ok) {
        console.log("Failed to delete embeddings");
        const d = await res.json();
        console.log(d);
        return { error: "Failed to delete embeddings" };
      }
    }

    await prisma.document.delete({
      where: { id: documentId },
    });
    
    return { success: true };
      
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return { error: error.message };
  }
}

