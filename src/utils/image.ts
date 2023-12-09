import { BlobServiceClient } from '@azure/storage-blob'

/**
 * Upload files to Azure blob storage
 * @returns The promise of file names
 */
export const uploadFilesToBlob: (files: FileList) => Promise<string[]> = async (files) => {
  const fileNames: string[] = []

  if (!process.env['NEXT_PUBLIC_BLOB_SERVICE_SAS_URL']) return fileNames
  if (files.length === 0) return fileNames

  // Ref: https://learn.microsoft.com/en-us/azure/storage/blobs/quickstart-blobs-javascript-browser
  // Create client objects
  const blobServiceClient = new BlobServiceClient(process.env['NEXT_PUBLIC_BLOB_SERVICE_SAS_URL'])
  const containerName = 'kids-apparel'
  const containerClient = blobServiceClient.getContainerClient(containerName)

  // Upload blobs to a container
  try {
    const promises = []
    for (const file of files) {
      const blockBlobClient = containerClient.getBlockBlobClient(file.name)
      promises.push(blockBlobClient.uploadData(file))
      fileNames.push(file.name)
    }
    await Promise.all(promises)
    return fileNames
  } catch (error) {
    console.error(error)
    throw error
  }
}
