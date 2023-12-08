'use client'

import React, { useRef } from 'react'
import { BlobServiceClient } from '@azure/storage-blob'

const SiteSettings: React.FC<{}> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadImage = async () => {
    // Ref: https://learn.microsoft.com/en-us/azure/storage/blobs/quickstart-blobs-javascript-browser
    // Create client objects
    if (!process.env['NEXT_PUBLIC_BLOB_SERVICE_SAS_URL']) return
    if (!fileInputRef.current?.files) return
    const blobServiceClient = new BlobServiceClient(process.env['NEXT_PUBLIC_BLOB_SERVICE_SAS_URL'])
    const containerName = 'kids-apparel'
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Upload blobs to a container
    try {
      const promises = []
      for (let i = 0; i < fileInputRef.current.files.length; i++) {
        const file = fileInputRef.current.files[i]
        const blockBlobClient = containerClient.getBlockBlobClient(file.name)
        promises.push(blockBlobClient.uploadData(file))
      }
      await Promise.all(promises)
      console.log('Uploaded!')
    } catch (error) {
      console.log('Upload Failed!')
    }
  }

  return (
    <div>
      <div>This is SiteSettings</div>
      <div>
        <input ref={fileInputRef} type="file" id="file-input" multiple />
        <button onClick={handleUploadImage}>Upload Files</button>
      </div>
    </div>
  )
}

export default SiteSettings
