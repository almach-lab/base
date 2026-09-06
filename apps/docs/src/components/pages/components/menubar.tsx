import { Menubar } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function MenubarPage() {
  return (
    <ComponentDoc
      name="Menubar"
      description="Application-style menu row. Each menu reuses DropdownMenu internally, so item styling and submenus behave exactly the same."
      examples={[
        {
          title: "Default",
          description:
            "Left and right arrows move between top-level menus; Enter or Space opens one.",
          preview: (
            <Menubar>
              <Menubar.Menu label="File">
                <Menubar.Item>
                  New file
                  <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item>
                  Open…
                  <Menubar.Shortcut>⌘O</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item>
                  Save
                  <Menubar.Shortcut>⌘S</Menubar.Shortcut>
                </Menubar.Item>
              </Menubar.Menu>

              <Menubar.Menu label="Edit">
                <Menubar.Item>
                  Undo
                  <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item>
                  Redo
                  <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Label>Clipboard</Menubar.Label>
                <Menubar.Item>Cut</Menubar.Item>
                <Menubar.Item>Copy</Menubar.Item>
                <Menubar.Item>Paste</Menubar.Item>
              </Menubar.Menu>

              <Menubar.Menu label="View">
                <Menubar.CheckboxItem defaultSelected>
                  Show sidebar
                </Menubar.CheckboxItem>
                <Menubar.CheckboxItem>Show minimap</Menubar.CheckboxItem>
                <Menubar.Separator />
                <Menubar.Item>Zoom in</Menubar.Item>
                <Menubar.Item>Zoom out</Menubar.Item>
              </Menubar.Menu>
            </Menubar>
          ),
          code: `<Menubar>
  <Menubar.Menu label="File">
    <Menubar.Item>
      New file
      <Menubar.Shortcut>⌘N</Menubar.Shortcut>
    </Menubar.Item>
    <Menubar.Separator />
    <Menubar.Item>Save</Menubar.Item>
  </Menubar.Menu>

  <Menubar.Menu label="View">
    <Menubar.CheckboxItem defaultSelected>Show sidebar</Menubar.CheckboxItem>
  </Menubar.Menu>
</Menubar>`,
        },
        {
          title: "Plain",
          description: "Without the container border, for use inside a header.",
          preview: (
            <Menubar variant="plain">
              <Menubar.Menu label="Project">
                <Menubar.Item>Settings</Menubar.Item>
                <Menubar.Item>Members</Menubar.Item>
              </Menubar.Menu>
              <Menubar.Menu label="Help">
                <Menubar.Item>Documentation</Menubar.Item>
                <Menubar.Item>Keyboard shortcuts</Menubar.Item>
              </Menubar.Menu>
            </Menubar>
          ),
          code: `<Menubar variant="plain">…</Menubar>`,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"plain" | "bordered"',
          default: '"bordered"',
          description: "Container chrome.",
        },
        {
          name: "Menubar.Menu label",
          type: "React.ReactNode",
          required: true,
          description: "Top-level trigger label.",
        },
        {
          name: "Menubar.Menu disabled",
          type: "boolean",
          default: "false",
          description: "Disable a single menu.",
        },
        {
          name: "Menubar.Item / CheckboxItem / RadioItem",
          type: "React.ReactNode",
          description: "Re-exported DropdownMenu items, unchanged.",
        },
        {
          name: "Menubar.Label / Separator / Shortcut",
          type: "React.ReactNode",
          description: "Section label, divider and shortcut hint.",
        },
        {
          name: "Menubar.Sub / SubTrigger / SubContent",
          type: "React.ReactNode",
          description: "Nested submenus.",
        },
      ]}
    />
  );
}
