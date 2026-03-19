import * as React from "react";
import { Label, Textarea } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function TextareaPage() {
	return (
		<ComponentDoc
			name="Textarea"
			description="A multi-line text input with error state, resize support, and full keyboard accessibility."
			examples={[
				{
					title: "Default",
					description: "Always pair with a Label using matching id and htmlFor.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="ta-msg">Message</Label>
							<Textarea id="ta-msg" placeholder="Write your message…" rows={4} />
						</div>
					),
					code: `<Label htmlFor="msg">Message</Label>
<Textarea id="msg" placeholder="Write your message…" rows={4} />`,
					centered: false,
				},
				{
					title: "With character count",
					description: "Show remaining characters by composing with state.",
					preview: <CharCountTextarea />,
					code: `const MAX = 280;
const [text, setText] = React.useState("");

<div className="w-full max-w-sm space-y-1.5">
  <div className="flex justify-between items-center">
    <Label htmlFor="bio">Bio</Label>
    <span className={cn(
      "text-xs text-muted-foreground",
      text.length > MAX * 0.9 && "text-warning",
      text.length >= MAX && "text-destructive"
    )}>
      {text.length}/{MAX}
    </span>
  </div>
  <Textarea
    id="bio"
    value={text}
    onChange={(e) => setText(e.target.value.slice(0, MAX))}
    placeholder="Tell us about yourself…"
    rows={4}
  />
</div>`,
					centered: false,
				},
				{
					title: "Error state",
					description: "Shows a destructive ring and sets aria-invalid for validation.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="ta-err" required>
								Bio
							</Label>
							<Textarea id="ta-err" error defaultValue="x" rows={3} />
							<p className="text-xs text-destructive">
								Bio must be at least 10 characters.
							</p>
						</div>
					),
					code: `<Label htmlFor="bio" required>Bio</Label>
<Textarea id="bio" error defaultValue="x" rows={3} />
<p className="text-xs text-destructive">
  Bio must be at least 10 characters.
</p>`,
					centered: false,
				},
				{
					title: "Disabled",
					description: "Non-interactive at 50% opacity per HIG.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5 opacity-50">
							<Label htmlFor="ta-dis" className="cursor-not-allowed">
								Notes
							</Label>
							<Textarea
								id="ta-dis"
								disabled
								defaultValue="This field cannot be edited in your current role."
								rows={3}
							/>
						</div>
					),
					code: `<div className="opacity-50">
  <Label htmlFor="notes" className="cursor-not-allowed">Notes</Label>
  <Textarea
    id="notes"
    disabled
    defaultValue="This field cannot be edited in your current role."
    rows={3}
  />
</div>`,
					centered: false,
				},
			]}
			props={[
				{
					name: "error",
					type: "boolean",
					default: "false",
					description: "Applies a destructive ring and sets aria-invalid.",
				},
				{
					name: "rows",
					type: "number",
					default: "3",
					description: "Initial number of visible text rows.",
				},
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Prevents editing. Renders at 50% opacity with a not-allowed cursor.",
				},
				{
					name: "placeholder",
					type: "string",
					description: "Placeholder text shown when the field is empty.",
				},
			]}
		/>
	);
}

function CharCountTextarea() {
	const MAX = 280;
	const [text, setText] = React.useState("");
	const remaining = MAX - text.length;
	const isNearLimit = text.length > MAX * 0.9;
	const isAtLimit = text.length >= MAX;

	return (
		<div className="w-full max-w-sm space-y-1.5">
			<div className="flex items-center justify-between">
				<Label htmlFor="ta-bio">Bio</Label>
				<span
					className={[
						"text-xs",
						isAtLimit
							? "text-destructive font-medium"
							: isNearLimit
								? "text-warning"
								: "text-muted-foreground",
					].join(" ")}
				>
					{remaining} remaining
				</span>
			</div>
			<Textarea
				id="ta-bio"
				value={text}
				onChange={(e) => setText(e.target.value.slice(0, MAX))}
				placeholder="Tell us about yourself…"
				rows={4}
				error={isAtLimit}
			/>
		</div>
	);
}
