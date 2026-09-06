import { NavigationMenu } from "@almach/ui";
import { BookOpen, Boxes, LayoutTemplate, Palette } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function NavigationMenuPage() {
  return (
    <ComponentDoc
      name="Navigation Menu"
      description="Site navigation with dropdown panels. Panels open on pointer hover and on keyboard focus; plain links sit alongside them."
      examples={[
        {
          title: "Default",
          description:
            "One entry with a two-column panel, plus ordinary links.",
          preview: (
            <NavigationMenu>
              <NavigationMenu.Item label="Product">
                <NavigationMenu.List>
                  <NavigationMenu.Entry
                    href="#"
                    icon={<Boxes />}
                    title="Components"
                    description="Fifty-plus accessible building blocks."
                  />
                  <NavigationMenu.Entry
                    href="#"
                    icon={<LayoutTemplate />}
                    title="Blocks"
                    description="Composed sections you can paste in."
                  />
                  <NavigationMenu.Entry
                    href="#"
                    icon={<Palette />}
                    title="Theming"
                    description="Token-driven light and dark themes."
                  />
                  <NavigationMenu.Entry
                    href="#"
                    icon={<BookOpen />}
                    title="Docs"
                    description="Guides, recipes and the full API."
                  />
                </NavigationMenu.List>
              </NavigationMenu.Item>

              <NavigationMenu.Item label="Resources" panelClassName="w-72">
                <NavigationMenu.List columns={1}>
                  <NavigationMenu.Entry
                    href="#"
                    title="Changelog"
                    description="What shipped recently."
                  />
                  <NavigationMenu.Entry
                    href="#"
                    title="GitHub"
                    description="Source, issues and discussions."
                  />
                </NavigationMenu.List>
              </NavigationMenu.Item>

              <NavigationMenu.Link href="#">Pricing</NavigationMenu.Link>
              <NavigationMenu.Link href="#" active>
                Blog
              </NavigationMenu.Link>
            </NavigationMenu>
          ),
          code: `<NavigationMenu>
  <NavigationMenu.Item label="Product">
    <NavigationMenu.List>
      <NavigationMenu.Entry
        href="/components"
        icon={<Boxes />}
        title="Components"
        description="Fifty-plus accessible building blocks."
      />
    </NavigationMenu.List>
  </NavigationMenu.Item>

  <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
  <NavigationMenu.Link href="/blog" active>Blog</NavigationMenu.Link>
</NavigationMenu>`,
        },
      ]}
      props={[
        {
          name: "label",
          type: "string",
          default: '"Main"',
          description: "Accessible label for the surrounding nav element.",
        },
        {
          name: "NavigationMenu.Item label",
          type: "React.ReactNode",
          required: true,
          description: "Trigger label for a panel entry.",
        },
        {
          name: "NavigationMenu.Item panelClassName",
          type: "string",
          description: "Override the panel width or padding.",
        },
        {
          name: "NavigationMenu.Item openDelay",
          type: "number",
          default: "120",
          description: "Milliseconds before the panel opens on hover.",
        },
        {
          name: "NavigationMenu.List columns",
          type: "1 | 2",
          default: "2",
          description: "Panel grid columns.",
        },
        {
          name: "NavigationMenu.Entry",
          type: "title, description, icon, href",
          description: "One link inside a panel.",
        },
        {
          name: "NavigationMenu.Link active",
          type: "boolean",
          default: "false",
          description:
            'Marks a top-level link as the current page (aria-current="page").',
        },
      ]}
    />
  );
}
