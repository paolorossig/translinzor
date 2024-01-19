'use client'

import DropzoneComponent, { type DropzoneOptions } from 'react-dropzone'

import { cn } from '@/lib/utils'

const defaultMaxFileSize = 1048576 // 1MB

interface DropzoneProps extends DropzoneOptions {
  maxFileSize?: number
}

export function Dropzone({
  maxFileSize = defaultMaxFileSize,
  ...props
}: DropzoneProps) {
  return (
    <DropzoneComponent maxSize={maxFileSize} {...props}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge = fileRejections.some(
          (file) => file.file.size > maxFileSize,
        )

        return (
          <div
            {...getRootProps()}
            className={cn(
              'm-4 rounded-lg border-[1.5px] border-dashed px-4 py-16 text-center',
              isDragActive && 'animate-pulse border-green-400',
            )}
          >
            <input {...getInputProps()} />
            <div>
              {!isDragActive && (
                <p>
                  Arrastra y suelta el archivo aquí, o haz click para
                  seleccionar uno.
                </p>
              )}
              {isDragActive && !isDragReject && (
                <p>Suelta el archivo aquí...</p>
              )}
              {isDragReject && (
                <p className="text-destructive">
                  El archivo no es válido, por favor intenta con otro.
                </p>
              )}
              {isFileTooLarge && (
                <p className="text-destructive">
                  El archivo es demasiado grande.
                </p>
              )}
            </div>
          </div>
        )
      }}
    </DropzoneComponent>
  )
}
