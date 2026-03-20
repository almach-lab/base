import * as React from "react";
import { Input, Label } from "@almach/ui";
import { Eye, EyeOff, Mail, Search } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function InputPage() {
	return (
		<ComponentDoc
			name="Input"
			description="A text field with optional left/right element slots, error state, and full keyboard accessibility."
			examples={[
				{
					title: "Default",
					description: "Always pair with a Label using matching id and htmlFor.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="email-demo">Email address</Label>
							<Input id="email-demo" type="email" placeholder="john@example.com" />
						</div>
					),
					code: `<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" placeholder="john@example.com" />`,
					centered: false,
				},
				{
					title: "With icon elements",
					description:
						"leftElement accepts non-interactive decorations; rightElement accepts buttons or icons.",
					preview: (
						<div className="w-full max-w-sm space-y-3">
							<Input
								leftElement={<Search className="h-4 w-4" />}
								placeholder="Search…"
							/>
							<Input
								placeholder="Enter email…"
								rightElement={<Mail className="h-4 w-4" />}
							/>
						</div>
					),
					code: `<Input
  leftElement={<Search className="h-4 w-4" />}
  placeholder="Search…"
/>
<Input
  placeholder="Enter email…"
  rightElement={<Mail className="h-4 w-4" />}
/>`,
					centered: false,
				},
				{
					title: "Password with toggle",
					description:
						"rightElement supports interactive elements like buttons.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="pw-demo">Password</Label>
							<PasswordInput />
						</div>
					),
					code: `function PasswordInput() {
  const [show, setShow] = React.useState(false);
  return (
    <Input
      type={show ? "text" : "password"}
      placeholder="Enter password…"
      rightElement={
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {show
            ? <EyeOff className="h-4 w-4" />
            : <Eye className="h-4 w-4" />
          }
        </button>
      }
    />
  );
}`,
					centered: false,
				},
				{
					title: "Error state",
					description:
						"Pass error to apply a destructive ring and set aria-invalid for screen readers.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="err-demo" required>
								Email
							</Label>
							<Input id="err-demo" error defaultValue="not-an-email" />
							<p className="text-xs text-destructive">
								Enter a valid email address.
							</p>
						</div>
					),
					code: `<Label htmlFor="email" required>Email</Label>
<Input id="email" error defaultValue="not-an-email" />
<p className="text-xs text-destructive">Enter a valid email address.</p>`,
					centered: false,
				},
				{
					title: "Disabled",
					description:
						"Disabled inputs are non-interactive and render at 50% opacity.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5 opacity-50">
							<Label htmlFor="dis-demo" className="cursor-not-allowed">
								Username
							</Label>
							<Input
								id="dis-demo"
								disabled
								defaultValue="alice_johnson"
							/>
						</div>
					),
					code: `<div className="opacity-50">
  <Label htmlFor="username" className="cursor-not-allowed">Username</Label>
  <Input id="username" disabled defaultValue="alice_johnson" />
</div>`,
					centered: false,
				},
			]}
			props={[
				{
					name: "leftElement",
					type: "ReactNode",
					description:
						"Non-interactive content in the left slot (icon, currency symbol, etc.).",
				},
				{
					name: "rightElement",
					type: "ReactNode",
					description:
						"Content in the right slot. Interactive elements (buttons) are supported.",
				},
				{
					name: "error",
					type: "boolean",
					default: "false",
					description:
						"Applies a destructive ring and sets aria-invalid for validation feedback.",
				},
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Prevents interaction. Renders at 50% opacity with a not-allowed cursor.",
				},
				{
					name: "type",
					type: "string",
					default: '"text"',
					description: "Standard HTML input type (email, password, number, etc.).",
				},
			]}
		/>
	);
}

function PasswordInput() {
	const [show, setShow] = React.useState(false);
	return (
		<Input
			id="pw-demo"
			type={show ? "text" : "password"}
			placeholder="Enter password…"
			rightElement={
				<button
					type="button"
					aria-label={show ? "Hide password" : "Show password"}
					onClick={() => setShow((v) => !v)}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					{show ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</button>
			}
		/>
	);
}
