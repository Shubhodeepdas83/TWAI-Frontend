"use server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
const prisma = new PrismaClient()

const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
})

export async function getUserDetails() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { failure: "not authenticated" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      sessions: {
        select: {
          id: true,
          name: true,
          description: true,
          conversation: true,
          createdAt: true,
          summary: true,
        },
      },
      documents: {
        select: {
          id: true,
          fileUrl: true,
          uploadedAt: true,
          title: true,
          description: true,
        },
      },
      meetingTemplates: {
        select: {
          id: true,
          purpose: true,
          goal: true,
          additionalInfo: true,
          duration: true,
          createdAt: true,
        },
      },
    },
  })

  if (!user) {
    return { failure: "User not found" }
  }

  return { user }
}

export async function createSession(formData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { failure: "not authenticated" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return { failure: "User not found" }
  }

  const name = formData.get("name") || "Untitled Session"
  const description = formData.get("description") || ""

  const newSession = await prisma.session.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  })

  return { sessionId: newSession.id }
}

export async function removeDocument(documentId) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { failure: "not authenticated" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return { failure: "User not found" }
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { userId: true, fileUrl: true, isEmbedded: true },
  })

  if (!document) {
    return { failure: "Document not found" }
  }

  if (document.userId !== user.id) {
    return { failure: "Unauthorized" }
  }

  try {
    // Extract filename from the full URL
    const fileKey = document.fileUrl.substring(document.fileUrl.lastIndexOf("/") + 1)

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
      }),
    )

    if (document.isEmbedded) {
      const res = await fetch(`${process.env.BACKEND_URL}/delete_embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdf_url: document.fileUrl, userId: user.id }),
      })

      if (!res.ok) {
        console.log("Failed to delete embeddings")
        const d = await res.json()
        console.log(d)
        return { error: "Failed to delete embeddings" }
      }
    }

    await prisma.document.delete({
      where: { id: documentId },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting file from S3:", error)
    return { error: error.message }
  }
}

export async function getSummary(sessionId) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { failure: "not authenticated" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return { failure: "User not found" }
  }

  const s = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
  })

  if (!s) {
    return { failure: "Summary not found or user not linked to the summary" }
  }
  console.log(s)

  if (!s.summary) {
    const response = await fetch(`${process.env.BACKEND_URL}/process-ai-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw_conversation: s.conversation }),
    })

    if (!response.ok) {
      const data = await response.json()
      console.log(data)
      return {
        failure: "Sorry, I couldn't process the summary of this meeting at this time.",
      }
    } else {
      const data = await response.json()

      const _ = await prisma.session.update({
        where: { id: sessionId },
        data: { summary: data.result },
      })

      return {
        summary: data.result,
        createdAt: s.createdAt,
      }
    }
  } else {
    return {
      summary: s.summary,
      createdAt: s.createdAt,
    }
  }
}

export async function createMeetingTemplate(formData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { failure: "not authenticated" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return { failure: "User not found" }
  }

  const purpose = formData.get("purpose")
  const goal = formData.get("goal")
  const additionalInfo = formData.get("additionalInfo")
  const duration = formData.get("duration")

  if (!purpose || !goal) {
    return { failure: "Purpose and goal are required" }
  }

  const newTemplate = await prisma.meetingTemplate.create({
    data: {
      userId: user.id,
      purpose,
      goal,
      additionalInfo: additionalInfo || "",
      duration: duration || "30 mins",
    },
  })

  return { success: true, templateId: newTemplate.id }
}

export async function deleteMeetingTemplate(templateId) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { failure: "not authenticated" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return { failure: "User not found" }
  }

  const template = await prisma.meetingTemplate.findUnique({
    where: { id: templateId },
    select: { userId: true },
  })

  if (!template) {
    return { failure: "Template not found" }
  }

  if (template.userId !== user.id) {
    return { failure: "Unauthorized" }
  }

  await prisma.meetingTemplate.delete({
    where: { id: templateId },
  })

  return { success: true }
}

