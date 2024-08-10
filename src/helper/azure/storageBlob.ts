import { BlobServiceClient } from "@azure/storage-blob";

// Set up Azure Blob Service Client
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING as string
);
const containerClient = blobServiceClient.getContainerClient(
  containerName as string
);

export default containerClient;

export async function uploadBlob(blobName: string, buffer: Buffer) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length);
  return blockBlobClient.url;
}

export async function deleteBlob(blobName: string) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.delete();
}

export function extractBlobName(blobLink: string) {
  const blobNameArray = blobLink.split("/");
  return blobNameArray[blobNameArray.length - 1];
}
