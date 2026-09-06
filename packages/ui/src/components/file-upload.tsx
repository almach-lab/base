import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { UploadCloud } from "lucide-react";
import * as React from "react";
import {
  Button,
  DropZone,
  FileTrigger,
  Text,
  isFileDropItem,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";

const fileUploadVariants = cva(
  [
    "flex w-full cursor-pointer flex-col items-center justify-center gap-2 text-center",
    "rounded-lg border border-dashed border-input bg-background",
    MOTION_INTERACTIVE,
    FOCUS_RING,
    DISABLED_DATA,
    "data-[hovered]:border-primary/50 data-[hovered]:bg-accent/30",
    "data-[drop-target]:border-primary data-[drop-target]:bg-primary/5",
  ],
  {
    variants: {
      size: {
        sm: "gap-1.5 px-4 py-5 text-xs",
        default: "gap-2 px-6 py-8 text-sm",
        lg: "gap-3 px-8 py-12 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export interface FileUploadProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof DropZone>,
      "className" | "children" | "onDrop"
    >,
    VariantProps<typeof fileUploadVariants> {
  className?: string;
  /** Called with the accepted files, from either drop or the file picker. */
  onFilesChange?: (files: File[]) => void;
  /** Mirrors the native `accept` attribute, e.g. `["image/png", ".pdf"]`. */
  acceptedFileTypes?: string[];
  allowsMultiple?: boolean;
  /** Primary line of copy. */
  label?: React.ReactNode;
  /** Secondary line of copy — a good place for size or format limits. */
  description?: React.ReactNode;
  /** Replace the default upload glyph. */
  icon?: React.ReactNode;
  /** Label for the inline browse button. */
  buttonLabel?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      size,
      onFilesChange,
      acceptedFileTypes,
      allowsMultiple = false,
      label = "Drop files here",
      description,
      icon,
      buttonLabel = "Browse files",
      ...props
    },
    ref,
  ) => {
    const emit = React.useCallback(
      (files: File[]) => {
        if (files.length > 0) onFilesChange?.(files);
      },
      [onFilesChange],
    );

    return (
      <DropZone
        ref={ref}
        className={cn(fileUploadVariants({ size }), className)}
        {...(acceptedFileTypes
          ? { getDropOperation: () => "copy" as const }
          : {})}
        onDrop={async (event) => {
          const items = event.items.filter(isFileDropItem);
          const files = await Promise.all(items.map((item) => item.getFile()));
          emit(allowsMultiple ? files : files.slice(0, 1));
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground [&_svg]:size-5"
        >
          {icon ?? <UploadCloud />}
        </span>

        <Text slot="label" className="font-medium text-foreground">
          {label}
        </Text>

        {description && (
          <span className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}

        <FileTrigger
          allowsMultiple={allowsMultiple}
          {...(acceptedFileTypes ? { acceptedFileTypes } : {})}
          onSelect={(list) => emit(list ? Array.from(list) : [])}
        >
          <Button
            className={cn(
              "mt-1 inline-flex h-8 cursor-pointer items-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground shadow-xs",
              MOTION_INTERACTIVE,
              FOCUS_RING,
              "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
            )}
          >
            {buttonLabel}
          </Button>
        </FileTrigger>
      </DropZone>
    );
  },
);
FileUpload.displayName = "FileUpload";

export { FileUpload, fileUploadVariants };
