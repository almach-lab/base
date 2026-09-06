import { Button, Empty } from "@almach/ui";
import { Inbox, Plus, SearchX } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function EmptyPage() {
  return (
    <ComponentDoc
      name="Empty"
      description="Placeholder for a list, table or panel with nothing in it. Composed of an icon well, a title, a description and an action row."
      examples={[
        {
          title: "Default",
          description: "Nothing yet, with a way forward.",
          preview: (
            <Empty variant="dashed" className="max-w-md">
              <Empty.Icon>
                <Inbox />
              </Empty.Icon>
              <Empty.Title>No messages</Empty.Title>
              <Empty.Description>
                When someone writes to your inbox, their message will show up
                here.
              </Empty.Description>
              <Empty.Actions>
                <Button size="sm" leftIcon={<Plus />}>
                  New message
                </Button>
                <Button size="sm" variant="outline">
                  Import
                </Button>
              </Empty.Actions>
            </Empty>
          ),
          code: `<Empty variant="dashed">
  <Empty.Icon><Inbox /></Empty.Icon>
  <Empty.Title>No messages</Empty.Title>
  <Empty.Description>
    When someone writes to your inbox, their message will show up here.
  </Empty.Description>
  <Empty.Actions>
    <Button size="sm" leftIcon={<Plus />}>New message</Button>
  </Empty.Actions>
</Empty>`,
        },
        {
          title: "No results",
          description: "A compact, borderless variant for filtered views.",
          preview: (
            <Empty size="sm" className="max-w-md">
              <Empty.Icon>
                <SearchX />
              </Empty.Icon>
              <Empty.Title>No matches</Empty.Title>
              <Empty.Description>
                Try a shorter query or clear your filters.
              </Empty.Description>
            </Empty>
          ),
          code: `<Empty size="sm">
  <Empty.Icon><SearchX /></Empty.Icon>
  <Empty.Title>No matches</Empty.Title>
  <Empty.Description>Try a shorter query or clear your filters.</Empty.Description>
</Empty>`,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"plain" | "bordered" | "dashed"',
          default: '"plain"',
          description: "Container chrome.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Padding and inner spacing.",
        },
        {
          name: "Empty.Icon",
          type: "React.ReactNode",
          description: "Circular icon well. Pass a single icon as its child.",
        },
        {
          name: "Empty.Title",
          type: "React.ReactNode",
          description: "Short headline.",
        },
        {
          name: "Empty.Description",
          type: "React.ReactNode",
          description: "One or two lines of supporting copy.",
        },
        {
          name: "Empty.Actions",
          type: "React.ReactNode",
          description: "Centred row of buttons.",
        },
      ]}
    />
  );
}
