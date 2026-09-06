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
        name: "Month Picker",
        slug: "month-picker",
        description: "Month + year dropdowns for selecting an entire month.",
      },
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
        name: "Currency Input",
        slug: "currency-input",
        description: "Formatted currency field with locale support.",
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
      {
        name: "Slider",
        slug: "slider",
        description: "Single-value and range slider.",
      },
      {
        name: "Toggle",
        slug: "toggle",
        description: "Two-state button and toggle groups.",
      },
      {
        name: "Number Field",
        slug: "number-field",
        description: "Numeric input with steppers and formatting.",
      },
      {
        name: "Color Input",
        slug: "input-color",
        description: "Colour field with an inline popover picker.",
      },
      {
        name: "Input OTP",
        slug: "input-otp",
        description: "One-time-code field with paste support.",
      },
      {
        name: "Time Field",
        slug: "time-field",
        description: "Segmented time entry.",
      },
      {
        name: "Color Picker",
        slug: "color-picker",
        description: "Area, sliders, hex field and swatches.",
      },
      {
        name: "File Upload",
        slug: "file-upload",
        description: "Drop zone with an accessible file picker.",
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
      {
        name: "Meter",
        slug: "meter",
        description: "Value within a known range.",
      },
      {
        name: "Empty",
        slug: "empty",
        description: "Placeholder for lists with nothing in them.",
      },
      {
        name: "Stepper",
        slug: "stepper",
        description: "Progress through a multi-step flow.",
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
      {
        name: "Sidebar",
        slug: "sidebar",
        description: "Collapsible navigation sidebar with nested menus.",
      },
      {
        name: "Accordion",
        slug: "accordion",
        description: "Stacked disclosure panels.",
      },
      {
        name: "Breadcrumb",
        slug: "breadcrumb",
        description: "Hierarchy trail.",
      },
      {
        name: "Resizable",
        slug: "resizable",
        description: "Draggable panel splits.",
      },
      {
        name: "Toolbar",
        slug: "toolbar",
        description: "Grouped controls with arrow-key navigation.",
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
      {
        name: "Hover Card",
        slug: "hover-card",
        description: "Rich preview on hover and focus.",
      },
      {
        name: "Menubar",
        slug: "menubar",
        description: "Application-style menu row.",
      },
      {
        name: "Navigation Menu",
        slug: "navigation-menu",
        description: "Site navigation with dropdown panels.",
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
      {
        name: "Pagination",
        slug: "pagination",
        description: "Page navigation with collapsed ranges.",
      },
      {
        name: "Tree",
        slug: "tree",
        description: "Expandable hierarchy with keyboard support.",
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
