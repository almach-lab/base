import { Breadcrumb } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function BreadcrumbPage() {
  return (
    <ComponentDoc
      name="Breadcrumb"
      description="Hierarchy trail built on React Aria Breadcrumbs. The last crumb is marked as the current page and drops its separator automatically."
      examples={[
        {
          title: "Default",
          description: "Links for ancestors, plain text for the current page.",
          preview: (
            <Breadcrumb>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb>
          ),
          code: `<Breadcrumb>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb>`,
        },
        {
          title: "Collapsed",
          description:
            "Use the ellipsis for deep trails. Pair it with a DropdownMenu to reveal the hidden levels.",
          preview: (
            <Breadcrumb>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Ellipsis />
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Page>Billing</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb>
          ),
          code: `<Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
</Breadcrumb.Item>`,
        },
      ]}
      props={[
        {
          name: "Breadcrumb.Item",
          type: "React.ReactNode",
          description:
            "One crumb. Renders a trailing chevron unless it is the current page.",
        },
        {
          name: "Breadcrumb.Link",
          type: "href, target, rel …",
          description: "Interactive ancestor crumb.",
        },
        {
          name: "Breadcrumb.Page",
          type: "React.ReactNode",
          description: 'Final, non-interactive crumb with aria-current="page".',
        },
        {
          name: "Breadcrumb.Ellipsis",
          type: "React.ReactNode",
          description: "Collapsed-levels affordance.",
        },
      ]}
    />
  );
}
