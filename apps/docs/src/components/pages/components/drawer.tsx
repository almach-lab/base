import { Button, Drawer, Input, Label, Textarea } from "@almach/ui";
import { Copy, Share2, Star, Trash2 } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function DrawerPage() {
  return (
    <ComponentDoc
      name="Drawer"
      description="Bottom sheet with drag-to-dismiss, snap points, and scrollable content. Ideal for mobile action sheets."
      examples={[
        {
          title: "Action sheet",
          description:
            "A list of actions — the most common bottom-sheet pattern.",
          preview: (
            <Drawer>
              <Drawer.Trigger asChild>
                <Button variant="outline">Open actions</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Actions</Drawer.Title>
                  <Drawer.Description>
                    Choose an action to perform on this item.
                  </Drawer.Description>
                </Drawer.Header>
                <div className="space-y-1 px-4 py-2">
                  {[
                    { icon: Star, label: "Add to favourites" },
                    { icon: Share2, label: "Share" },
                    { icon: Copy, label: "Copy link" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      {label}
                    </button>
                  ))}
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors text-left">
                    <Trash2 className="h-4 w-4 shrink-0" />
                    Delete
                  </button>
                </div>
                <Drawer.Footer>
                  <Drawer.Close asChild>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Drawer.Close>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          ),
          code: `<Drawer>
  <Drawer.Trigger asChild>
    <Button variant="outline">Open actions</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Actions</Drawer.Title>
      <Drawer.Description>Choose an action to perform.</Drawer.Description>
    </Drawer.Header>
    <div className="space-y-1 px-4 py-2">
      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent">
        <Star className="h-4 w-4 text-muted-foreground" />
        Add to favourites
      </button>
      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-destructive/5">
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
    <Drawer.Footer>
      <Drawer.Close asChild>
        <Button variant="outline" className="w-full">Cancel</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer>`,
        },
        {
          title: "Form drawer",
          description:
            "Inline editing or quick-add forms work well in drawers.",
          preview: (
            <Drawer>
              <Drawer.Trigger asChild>
                <Button>Quick add</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Add item</Drawer.Title>
                  <Drawer.Description>
                    Fill in the details and save.
                  </Drawer.Description>
                </Drawer.Header>
                <div className="space-y-3 px-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="drw-name">Name</Label>
                    <Input id="drw-name" placeholder="Item name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="drw-desc">Description</Label>
                    <Textarea
                      id="drw-desc"
                      placeholder="Optional description…"
                      rows={3}
                    />
                  </div>
                </div>
                <Drawer.Footer>
                  <Button className="w-full">Add item</Button>
                  <Drawer.Close asChild>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Drawer.Close>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          ),
          code: `<Drawer>
  <Drawer.Trigger asChild>
    <Button>Quick add</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Add item</Drawer.Title>
      <Drawer.Description>Fill in the details and save.</Drawer.Description>
    </Drawer.Header>
    <div className="space-y-3 px-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Item name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" placeholder="Optional description…" rows={3} />
      </div>
    </div>
    <Drawer.Footer>
      <Button className="w-full">Add item</Button>
      <Drawer.Close asChild>
        <Button variant="outline" className="w-full">Cancel</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer>`,
        },
      ]}
      props={[
        {
          name: "open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Callback when the drawer opens or closes.",
        },
        {
          name: "Drawer.Trigger",
          type: "Vaul DrawerTriggerProps",
          description: "The element that opens the drawer.",
        },
        {
          name: "Drawer.Content",
          type: "Vaul DrawerContentProps",
          description:
            "The sheet panel. Includes a drag handle at the top automatically.",
        },
        {
          name: "Drawer.Header",
          type: "React.HTMLAttributes<HTMLDivElement>",
          description: "Contains Drawer.Title and Drawer.Description.",
        },
        {
          name: "Drawer.Footer",
          type: "React.HTMLAttributes<HTMLDivElement>",
          description: "Stacked action area at the bottom of the sheet.",
        },
        {
          name: "Drawer.Close",
          type: "Vaul DrawerCloseProps",
          description:
            "Closes the drawer on click. Use asChild to wrap a Button.",
        },
      ]}
    />
  );
}
