'use client'

import React, { useRef } from 'react'
import { uploadFilesToBlob } from '@/utils/image'

const SiteSettings: React.FC<{}> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadFiles = () => {
    if (!fileInputRef.current?.files) return
    uploadFilesToBlob(fileInputRef.current.files).then((fileNames) => {
      console.log(fileNames)
    })
  }

  return (
    <div>
      <div>This is SiteSettings</div>
      <div>
        <input ref={fileInputRef} type="file" id="file-input" multiple />
        <button onClick={handleUploadFiles}>Upload Files</button>
      </div>
    </div>
  )
}

export default SiteSettings
