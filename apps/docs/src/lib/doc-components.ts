export interface DocComponentItem {
  name: string;
  slug: string;
  description: string;
}

export interface DocComponentGroup {
  name: "Inputs" | "Display" | "Layout" | "Overlay" | "Data";
  items: DocComponentItem[];
}

export const DOC_COMPONENT_GROUPS: DocComponentGroup[] = [
  {
    name: "Inputs",
    items: [
      {
        name: "Button",
        slug: "button",
        description: "Triggers an action or event.",
      },
      {
        name: "Checkbox",
        slug: "checkbox",
        description: "Boolean selection control.",
      },
      {
        name: "Input",
        slug: "input",
        description: "Text field with icon slots.",
      },
      { name: "Label", slug: "label", description: "Accessible form label." },
      {
        name: "Radio",
        slug: "radio",
        description: "Single-selection radio group.",
      },
      {
        name: "Select",
        slug: "select",
        description: "Dropdown + searchable select.",
      },
      {
        name: "Switch",
        slug: "switch",
        description: "Toggle control with three sizes.",
      },
      {
        name: "Tag Input",
        slug: "tag-input",
        description: "Multi-value tag input field.",
      },
      {
        name: "Textarea",
        slug: "textarea",
        description: "Multi-line text input.",
      },
      {
        name: "Swipe Button",
        slug: "swipe-button",
        description: "Confirm-by-swiping interaction with spring physics.",
      },
    ],
  },
  {
    name: "Display",
    items: [
      {
        name: "Alert",
        slug: "alert",
        description: "Inline feedback messages.",
      },
      {
        name: "Avatar",
        slug: "avatar",
        description: "User image with fallback initials.",
      },
      { name: "Badge", slug: "badge", description: "Status labels and tags." },
      {
        name: "Progress",
        slug: "progress",
        description: "Linear progress indicator.",
      },
      {
        name: "Skeleton",
        slug: "skeleton",
        description: "Shimmer loading placeholder.",
      },
      { name: "Toast", slug: "toast", description: "Transient notifications." },
      {
        name: "Tooltip",
        slug: "tooltip",
        description: "Contextual hover hints.",
      },
    ],
  },
  {
    name: "Layout",
    items: [
      {
        name: "Card",
        slug: "card",
        description: "Surface container with sections.",
      },
      {
        name: "Carousel",
        slug: "carousel",
        description: "Touch-friendly slide carousel.",
      },
      {
        name: "Separator",
        slug: "separator",
        description: "Horizontal or vertical divider.",
      },
      {
        name: "Swipe Actions",
        slug: "swipe-actions",
        description: "Reveal actions by swiping a list item.",
      },
      {
        name: "Scroll Area",
        slug: "scroll-area",
        description: "Themed scrollable container with custom scrollbars.",
      },
    ],
  },
  {
    name: "Overlay",
    items: [
      {
        name: "Collapsible",
        slug: "collapsible",
        description: "Expand / collapse content.",
      },
      {
        name: "Command",
        slug: "command",
        description: "⌘K command palette with search.",
      },
      {
        name: "Dialog",
        slug: "dialog",
        description: "Modal overlay with focus trapping.",
      },
      {
        name: "Drawer",
        slug: "drawer",
        description: "Bottom sheet with drag-to-dismiss.",
      },
      {
        name: "Dropdown Menu",
        slug: "dropdown-menu",
        description: "Contextual floating menu.",
      },
      {
        name: "Modal",
        slug: "modal",
        description: "Dialog on desktop, Drawer on mobile.",
      },
      {
        name: "Popover",
        slug: "popover",
        description: "Floating panel anchored to a trigger.",
      },
      {
        name: "Tabs",
        slug: "tabs",
        description: "Pill and underline tab variants.",
      },
    ],
  },
  {
    name: "Data",
    items: [
      {
        name: "Chart",
        slug: "chart",
        description: "Line, Bar, Area, Pie, and Radar charts.",
      },
      {
        name: "Calendar",
        slug: "calendar",
        description: "Date and date range picker.",
      },
      {
        name: "Table",
        slug: "table",
        description: "TanStack-powered data table.",
      },
    ],
  },
];

export const DOC_COMPONENT_ITEMS = DOC_COMPONENT_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    group: group.name,
    href: `/components/${item.slug}`,
  })),
);

export const DOC_COMPONENT_SLUGS = DOC_COMPONENT_ITEMS.map((item) => item.slug);
