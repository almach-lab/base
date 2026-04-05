# Almach UI LLM API Snapshot

Generated: 2026-04-05T10:36:51.837Z

This file is generated from `packages/ui/src/index.ts` and docs metadata.
Use this as the primary LLM-oriented API reference.

## Alert

Module: `alert`

### Import

```tsx
import { Alert } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Alert`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Alert`
- Types: `AlertVariant`

## Avatar

Module: `avatar`

### Import

```tsx
import { Avatar } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Avatar`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Avatar`, `avatarVariants`
- Types: `AvatarProps`

## Badge

Module: `badge`

### Import

```tsx
import { Badge } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Badge`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Badge`, `badgeVariants`
- Types: `BadgeProps`

## Button

Module: `button`

### Import

```tsx
import { Button } from "@almach/ui";
```

### Most Common Tasks

- Trigger an action with semantic variants.
- Use loading state during async submit or mutation.
- Render as child when composing with links or custom elements.

### Anatomy

- `Button`

### API Notes

- variant + size define style and spacing.
- loading disables interactions and shows spinner.
- asChild enables slot-based composition.

### Exported Symbols

- Values: `Button`, `buttonVariants`
- Types: `ButtonProps`

### Accessibility Notes

- Use meaningful button text.
- Set disabled when action is unavailable.
- Prefer aria-label for icon-only usage.

## Calendar

Module: `calendar`

### Import

```tsx
import { Calendar } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Calendar`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Calendar`
- Types: `CalendarProps`

## Card

Module: `card`

### Import

```tsx
import { Card } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Card`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Card`, `Group`
- Types: (none)

## Carousel

Module: `carousel`

### Import

```tsx
import { Carousel } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Carousel`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Carousel`
- Types: (none)

## Checkbox

Module: `checkbox`

### Import

```tsx
import { Checkbox } from "@almach/ui";
```

### Most Common Tasks

- Capture boolean consent in forms.
- Render controlled list of preferences.
- Show disabled and invalid states consistently.

### Anatomy

- `Checkbox`

### API Notes

- isSelected/defaultSelected + onChange manage state.
- isDisabled blocks interaction.
- error sets invalid visual and semantic state.

### Exported Symbols

- Values: `Checkbox`
- Types: (none)

## Collapsible

Module: `collapsible`

### Import

```tsx
import { Collapsible } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Collapsible`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Collapsible`
- Types: (none)

## Command

Module: `command`

### Import

```tsx
import { Command } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Command`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Command`
- Types: (none)

## CURRENCIES

Module: `currency-input`

### Import

```tsx
import { CURRENCIES } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `CURRENCIES`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `CURRENCIES`, `CurrencyFlagBadge`, `InputCurrency`
- Types: `CurrencyDef`, `CurrencySelectorMode`, `CurrencyValue`, `InputCurrencyProps`

## Dialog

Module: `dialog`

### Import

```tsx
import { Dialog } from "@almach/ui";
```

### Most Common Tasks

- Show modal confirmation and block background interaction.
- Compose custom header/body/footer content.
- Control open state from parent logic.

### Anatomy

- `Dialog.Root`
- `Dialog.Trigger`
- `Dialog.Content`
- `Dialog.Title`
- `Dialog.Description`
- `Dialog.Close`

### API Notes

- open/defaultOpen + onOpenChange control visibility.
- Content handles focus trap and Escape close.
- Close part returns focus to trigger by default.

### Exported Symbols

- Values: `Dialog`
- Types: (none)

## Drawer

Module: `drawer`

### Import

```tsx
import { Drawer } from "@almach/ui";
```

### Most Common Tasks

- Open side panel for details or forms.
- Use directional variants for left/right/bottom entry.
- Allow swipe-to-dismiss on touch devices.

### Anatomy

- `Drawer.Root`
- `Drawer.Trigger`
- `Drawer.Content`
- `Drawer.Backdrop`
- `Drawer.Close`

### API Notes

- open/defaultOpen + onOpenChange control lifecycle.
- Motion is transition-first and interruptible.
- Backdrop click and Escape close when enabled.

### Exported Symbols

- Values: `Drawer`
- Types: (none)

## DropdownMenu

Module: `dropdown-menu`

### Import

```tsx
import { DropdownMenu } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `DropdownMenu`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `DropdownMenu`
- Types: (none)

## Input

Module: `input`

### Import

```tsx
import { Input } from "@almach/ui";
```

### Most Common Tasks

- Collect single-line text with label and helper text.
- Mark invalid state for form feedback.
- Use date input variant for date entry.

### Anatomy

- `Input.Root`
- `Input.Field`
- `Input.Label`
- `Input.Description`
- `Input.Error`

### API Notes

- isDisabled and isInvalid control interaction and state styling.
- description and errorMessage provide form feedback.
- value/defaultValue follow controlled and uncontrolled patterns.

### Exported Symbols

- Values: `DateInput`, `Input`
- Types: `DateInputProps`, `InputDateProps`, `InputProps`

## Label

Module: `label`

### Import

```tsx
import { Label } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Label`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Label`
- Types: (none)

## Modal

Module: `modal`

### Import

```tsx
import { Modal } from "@almach/ui";
```

### Most Common Tasks

- Render stacked workflow views.
- Control modal from imperative hook.
- Embed forms with deterministic close behavior.

### Anatomy

- `Modal.Root`
- `Modal.Trigger`
- `Modal.Content`
- `Modal.Title`
- `Modal.Close`

### API Notes

- open/defaultOpen + onOpenChange control visibility.
- useModal helper supports programmatic flows.
- Focus and escape behavior follows dialog semantics.

### Exported Symbols

- Values: `Modal`, `useModal`
- Types: `ViewComponent`, `ViewsRegistry`

## Popover

Module: `popover`

### Import

```tsx
import { Popover } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Popover`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Popover`
- Types: (none)

## Progress

Module: `progress`

### Import

```tsx
import { Progress } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Progress`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Progress`
- Types: (none)

## Radio

Module: `radio`

### Import

```tsx
import { Radio } from "@almach/ui";
```

### Most Common Tasks

- Select one option from a small set.
- Render option cards with labels and descriptions.
- Control selection for form integration.

### Anatomy

- `Radio.Group`
- `Radio.Item`

### API Notes

- value/defaultValue + onChange manage group selection.
- isDisabled supported on group and item.
- name integrates with native form submission.

### Exported Symbols

- Values: `Radio`
- Types: (none)

## ScrollArea

Module: `scroll-area`

### Import

```tsx
import { ScrollArea } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `ScrollArea`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `ScrollArea`, `ScrollBar`
- Types: (none)

## Select

Module: `select`

### Import

```tsx
import { Select } from "@almach/ui";
```

### Most Common Tasks

- Select a single value from a list.
- Render grouped options with section headers.
- Use searchable mode for long lists.

### Anatomy

- `Select.Root`
- `Select.Trigger`
- `Select.Value`
- `Select.Content`
- `Select.Item`
- `Select.Indicator`

### API Notes

- value/defaultValue + onValueChange manage selection.
- open/defaultOpen + onOpenChange manage popup state.
- isDisabled and isInvalid align with field semantics.

### Exported Symbols

- Values: `Select`
- Types: `SelectSearchableOption`, `SelectSearchableProps`

### Accessibility Notes

- Arrow keys move through options.
- Enter or Space selects item.
- Escape closes the popup and returns focus.

## Separator

Module: `separator`

### Import

```tsx
import { Separator } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Separator`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Separator`
- Types: (none)

## Skeleton

Module: `skeleton`

### Import

```tsx
import { Skeleton } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Skeleton`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Skeleton`
- Types: (none)

## SwipeActions

Module: `swipe-actions`

### Import

```tsx
import { SwipeActions } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `SwipeActions`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `SwipeActions`, `useSwipeActions`
- Types: `SwipeActionProps`, `SwipeActionsProps`, `SwipeActionVariant`, `SwipeSide`

## SwipeButton

Module: `swipe-button`

### Import

```tsx
import { SwipeButton } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `SwipeButton`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `SwipeButton`
- Types: `SwipeButtonRootProps`, `SwipeButtonThumbProps`

## Switch

Module: `switch`

### Import

```tsx
import { Switch } from "@almach/ui";
```

### Most Common Tasks

- Toggle settings with immediate feedback.
- Use with label/description for preferences.
- Control setting from external store state.

### Anatomy

- `Switch`

### API Notes

- isSelected/defaultSelected + onChange manage state.
- isDisabled blocks interaction.
- error applies invalid semantics and styles.

### Exported Symbols

- Values: `Switch`
- Types: `SwitchProps`

## Table

Module: `table`

### Import

```tsx
import { Table } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Table`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Table`
- Types: `ColumnDef`

## Tabs

Module: `tabs`

### Import

```tsx
import { Tabs } from "@almach/ui";
```

### Most Common Tasks

- Switch between related content panels.
- Control selected tab from parent state.
- Disable individual tabs when unavailable.

### Anatomy

- `Tabs.Root`
- `Tabs.List`
- `Tabs.Trigger`
- `Tabs.Content`

### API Notes

- selectedKey/defaultSelectedKey + onSelectionChange manage active tab.
- Trigger and Content share the same id key.
- isDisabled disables a trigger.

### Exported Symbols

- Values: `Tabs`, `tabsListVariants`, `tabsTriggerVariants`
- Types: (none)

## TagInput

Module: `tag-input`

### Import

```tsx
import { TagInput } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `TagInput`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `TagInput`
- Types: `TagInputProps`

## Textarea

Module: `textarea`

### Import

```tsx
import { Textarea } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Textarea`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Textarea`
- Types: `TextareaProps`

## Toast

Module: `toast`

### Import

```tsx
import { Toast } from "@almach/ui";
```

### Most Common Tasks

- Show transient feedback after user actions.
- Use semantic variants (success, error, warning, info).
- Attach inline actions for recovery paths.

### Anatomy

- `toast()`
- `Toaster`

### API Notes

- Mount <Toaster /> once near app root.
- toast() accepts title, description, duration, and action.
- toast.promise() maps loading/success/error lifecycle.

### Exported Symbols

- Values: `toast`
- Types: `ToastConfirmOptions`, `ToastOptions`

## Toaster

Module: `toaster`

### Import

```tsx
import { Toaster } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Toaster`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Toaster`
- Types: (none)

## Tooltip

Module: `tooltip`

### Import

```tsx
import { Tooltip } from "@almach/ui";
```

### Most Common Tasks

- Use the exported component in controlled or uncontrolled form.

### Anatomy

- `Tooltip`

### API Notes

- Refer to the component page for full prop and behavior details.

### Exported Symbols

- Values: `Tooltip`
- Types: (none)

