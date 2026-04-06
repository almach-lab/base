import { Label, TagInput } from "@almach/ui";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

export function TagInputPage() {
  return (
    <ComponentDoc
      name="TagInput"
      description="Multi-value text input that converts entries into pill tags. Press Enter or comma to add, Backspace to remove the last tag."
      pkg="@almach/ui"
      examples={[
        {
          title: "Uncontrolled",
          description: "Type a tag and press Enter or comma to add it.",
          preview: <TagInput placeholder="Add technologies…" />,
          code: `<TagInput placeholder="Add technologies…" />`,
        },
        {
          title: "With initial tags",
          description: "Pre-populate with a controlled value array.",
          preview: <ControlledTags />,
          code: `const [tags, setTags] = React.useState(["React", "TypeScript"]);

<TagInput value={tags} onChange={setTags} />
<p className="text-sm text-muted-foreground">Tags: {tags.join(", ")}</p>`,
        },
        {
          title: "With max limit",
          description:
            "max={3} prevents adding more than 3 tags. Input hides at limit.",
          preview: (
            <TagInput
              placeholder="Add up to 3 skills…"
              max={3}
              value={["React", "TypeScript"]}
            />
          ),
          code: `<TagInput max={3} placeholder="Add up to 3 skills…" />`,
        },
        {
          title: "Transform (uppercase)",
          description:
            "Use transform to validate or normalise tags before adding them.",
          preview: (
            <TagInput
              placeholder="Add tags (auto-uppercased)…"
              transform={(t) => t.toUpperCase()}
            />
          ),
          code: `<TagInput
  transform={(tag) => tag.toUpperCase()}
  placeholder="Add tags…"
/>`,
        },
        {
          title: "With label",
          description: "Compose with Label for accessible form fields.",
          preview: (
            <div className="flex w-full flex-col gap-1.5">
              <Label htmlFor="tags">Skills</Label>
              <TagInput id="tags" placeholder="Add a skill and press Enter…" />
            </div>
          ),
          code: `<div className="flex flex-col gap-1.5">
  <Label htmlFor="tags">Skills</Label>
  <TagInput id="tags" placeholder="Add a skill and press Enter…" />
</div>`,
        },
        {
          title: "Error state",
          description: "error prop applies a destructive border.",
          preview: (
            <div className="flex w-full flex-col gap-1.5">
              <TagInput placeholder="Add tags…" error />
              <p className="text-xs text-destructive">
                At least one tag is required.
              </p>
            </div>
          ),
          code: `<TagInput error />`,
        },
      ]}
      props={[
        {
          name: "value",
          type: "string[]",
          description: "Controlled list of tags.",
        },
        {
          name: "onChange",
          type: "(tags: string[]) => void",
          description: "Called whenever the tag list changes.",
        },
        {
          name: "placeholder",
          type: "string",
          description: "Placeholder shown when no tags are present.",
        },
        {
          name: "max",
          type: "number",
          description:
            "Maximum number of tags. Input hides when limit is reached.",
        },
        {
          name: "transform",
          type: "(tag: string) => string | null",
          description:
            "Called before adding a tag. Return the (modified) string to add, or null to reject.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables editing.",
        },
        {
          name: "error",
          type: "boolean",
          description: "Applies destructive border and focus ring.",
        },
      ]}
    />
  );
}

function ControlledTags() {
  const [tags, setTags] = React.useState(["React", "TypeScript"]);
  return (
    <div className="flex w-full flex-col gap-2">
      <TagInput value={tags} onChange={setTags} placeholder="Add technology…" />
      <p className="text-xs text-muted-foreground">
        Tags:{" "}
        <span className="font-medium text-foreground">
          {tags.join(", ") || "none"}
        </span>
      </p>
    </div>
  );
}
