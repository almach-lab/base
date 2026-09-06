import { Accordion } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

const ITEMS = [
  {
    id: "shipping",
    title: "How long does shipping take?",
    body: "Standard delivery lands in 3–5 business days. Express orders placed before 2pm ship the same day.",
  },
  {
    id: "returns",
    title: "What is the return policy?",
    body: "Unused items can be returned within 30 days. We cover return postage for anything that arrived damaged.",
  },
  {
    id: "support",
    title: "How do I reach support?",
    body: "Email support@example.com or open a ticket from the dashboard. We reply within one business day.",
  },
];

export function AccordionPage() {
  return (
    <ComponentDoc
      name="Accordion"
      description="Stacked disclosure panels built on React Aria's DisclosureGroup. One panel opens at a time unless you allow multiple."
      examples={[
        {
          title: "Default",
          description: "A single expandable panel at a time.",
          preview: (
            <Accordion
              className="w-full max-w-md"
              defaultExpandedKeys={["shipping"]}
            >
              {ITEMS.map((item) => (
                <Accordion.Item key={item.id} id={item.id}>
                  <Accordion.Trigger>{item.title}</Accordion.Trigger>
                  <Accordion.Content>{item.body}</Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          ),
          code: `<Accordion defaultExpandedKeys={["shipping"]}>
  <Accordion.Item id="shipping">
    <Accordion.Trigger>How long does shipping take?</Accordion.Trigger>
    <Accordion.Content>Standard delivery lands in 3–5 business days.</Accordion.Content>
  </Accordion.Item>
</Accordion>`,
        },
        {
          title: "Multiple expanded",
          description: "Allow several panels open at once.",
          preview: (
            <Accordion
              className="w-full max-w-md"
              variant="separated"
              allowsMultipleExpanded
            >
              {ITEMS.slice(0, 2).map((item) => (
                <Accordion.Item key={item.id} id={item.id}>
                  <Accordion.Trigger>{item.title}</Accordion.Trigger>
                  <Accordion.Content>{item.body}</Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          ),
          code: `<Accordion variant="separated" allowsMultipleExpanded>
  {/* ... */}
</Accordion>`,
        },
        {
          title: "Ghost",
          description: "Divider-only styling for dense settings lists.",
          preview: (
            <Accordion className="w-full max-w-md" variant="ghost">
              {ITEMS.map((item) => (
                <Accordion.Item key={item.id} id={item.id}>
                  <Accordion.Trigger className="px-0">
                    {item.title}
                  </Accordion.Trigger>
                  <Accordion.Content className="px-0">
                    {item.body}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          ),
          code: `<Accordion variant="ghost">{/* ... */}</Accordion>`,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"bordered" | "separated" | "ghost"',
          default: '"bordered"',
          description: "Container and item chrome.",
        },
        {
          name: "allowsMultipleExpanded",
          type: "boolean",
          default: "false",
          description: "Keep more than one panel open at a time.",
        },
        {
          name: "expandedKeys",
          type: "Iterable<Key>",
          description: "Controlled set of expanded item ids.",
        },
        {
          name: "defaultExpandedKeys",
          type: "Iterable<Key>",
          description: "Item ids expanded on first render.",
        },
        {
          name: "onExpandedChange",
          type: "(keys: Set<Key>) => void",
          description: "Fired when the expanded set changes.",
        },
      ]}
    />
  );
}
