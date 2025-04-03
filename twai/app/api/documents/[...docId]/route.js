import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    // For testing purposes - log the secret key header
    const secretKey = request.headers.get('x-api-key');
    console.log('Received API key:', secretKey);

    // Handle the document ID which could be in the format:
    // ['docId'] or ['docId.pdf']
    let docId = params.docId[0];
    
    // Check if the docId ends with .pdf and remove it
    if (docId.endsWith('.pdf')) {
      docId = docId.replace('.pdf', '');
    } else if (params.docId.length > 1 && params.docId[1] === 'view') {
      // Handle the old format /docId/view for backward compatibility
      docId = docId;
    }
    
    if (!docId) {
      return new Response('Document ID is required', { status: 400 });
    }
    
    console.log('Accessing document:', docId);

    const document = await prisma.document.findUnique({
      where: {
        id: docId,
      },
    });

    if (!document || !document.fileUrl || !document.awsFileUrl) {
      return new Response('Document not found', { status: 404 });
    }
    
    // Fetch the document from S3 URL with additional options
    const response = await fetch(document.awsFileUrl, {
      headers: {
        'Accept': 'application/pdf',
      },
      redirect: 'follow',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch document: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch document from storage: ${response.status} ${response.statusText}`);
    }
    
    // Validate content type
    const contentType = response.headers.get('content-type');
    console.log(`Received content type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/pdf')) {
      console.error(`Invalid content type received: ${contentType}`);
      return new Response('Invalid content type received from storage', { status: 500 });
    }
    
    // Get the file content
    const fileContent = await response.arrayBuffer();
    
    if (fileContent.byteLength < 5) {
      console.error('Received too small file, likely not a valid PDF');
      return new Response('Invalid PDF file received from storage', { status: 500 });
    }
    
    // Return the file with appropriate headers
    return new Response(fileContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${document.name || 'document.pdf'}"`,
        'Content-Length': fileContent.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error proxying document:', error);
    return new Response(`Error fetching document: ${error.message}`, { status: 500 });
  }
}
