import { Badge, FileUpload } from "@almach/ui";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { ComponentDoc } from "../../component-doc";

function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <FileUpload
        allowsMultiple
        onFilesChange={setFiles}
        description="PNG, JPG or PDF up to 10MB"
      />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file) => (
            <li
              key={file.name}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <Badge variant="secondary">
                {Math.max(Math.round(file.size / 1024), 1)} KB
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FileUploadPage() {
  return (
    <ComponentDoc
      name="File Upload"
      description="Drop zone with a keyboard-accessible file picker, built on React Aria DropZone and FileTrigger. Reports the accepted files from either route."
      examples={[
        {
          title: "Default",
          description:
            "Drag files in, or use the browse button. Selected files are listed below.",
          preview: <FileUploadDemo />,
          code: `const [files, setFiles] = useState<File[]>([]);

<FileUpload
  allowsMultiple
  onFilesChange={setFiles}
  description="PNG, JPG or PDF up to 10MB"
/>`,
          centered: false,
        },
        {
          title: "Restricted and compact",
          description: "Limit the accepted types and swap the copy and glyph.",
          preview: (
            <FileUpload
              className="max-w-md"
              size="sm"
              icon={<ImagePlus />}
              label="Drop an image"
              buttonLabel="Choose image"
              acceptedFileTypes={["image/png", "image/jpeg"]}
            />
          ),
          code: `<FileUpload
  size="sm"
  icon={<ImagePlus />}
  label="Drop an image"
  buttonLabel="Choose image"
  acceptedFileTypes={["image/png", "image/jpeg"]}
/>`,
        },
      ]}
      props={[
        {
          name: "onFilesChange",
          type: "(files: File[]) => void",
          description:
            "Fired with the accepted files, from a drop or the picker.",
        },
        {
          name: "allowsMultiple",
          type: "boolean",
          default: "false",
          description:
            "Accept more than one file. When false, only the first is reported.",
        },
        {
          name: "acceptedFileTypes",
          type: "string[]",
          description: 'MIME types or extensions, e.g. ["image/png", ".pdf"].',
        },
        {
          name: "label",
          type: "React.ReactNode",
          default: '"Drop files here"',
          description: "Primary line of copy.",
        },
        {
          name: "description",
          type: "React.ReactNode",
          description: "Secondary line — size or format limits.",
        },
        {
          name: "icon",
          type: "React.ReactNode",
          description: "Replace the default upload glyph.",
        },
        {
          name: "buttonLabel",
          type: "string",
          default: '"Browse files"',
          description: "Label for the inline picker button.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Drop zone padding and text scale.",
        },
      ]}
    />
  );
}
