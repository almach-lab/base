import * as React from "react";
import { Button, Toaster, toast } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function ToastPage() {
	return (
		<>
			<ComponentDoc
				name="Toast"
				description="Transient notifications powered by Sonner. Call toast() from anywhere — no provider wiring needed beyond placing <Toaster /> once at the app root."
				examples={[
					{
						title: "Variants",
						description: "Four semantic variants. Click each button to trigger a toast.",
						preview: <ToastVariantsDemo />,
						code: `import { toast } from "@almach/ui";

toast("Notification", { description: "You have a new message." });
toast.success("Saved!", { description: "Your changes have been saved." });
toast.error("Error", { description: "Something went wrong." });
toast.warning("Warning", { description: "Check your input." });`,
					},
					{
						title: "With action",
						description: "Pass an action button via the action option.",
						preview: <ToastActionDemo />,
						code: `toast("File deleted", {
  description: "report-q4.pdf has been moved to trash.",
  action: { label: "Undo", onClick: () => console.log("Undo") },
});`,
					},
					{
						title: "Promise",
						description: "Tracks async state with loading → success / error.",
						preview: <ToastPromiseDemo />,
						code: `toast.promise(saveData(), {
  loading: "Saving…",
  success: "Saved successfully!",
  error: "Failed to save.",
});`,
					},
					{
						title: "Setup",
						description: "Add <Toaster /> once at the app root.",
						preview: (
							<div className="w-full max-w-sm rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
								{"// main.tsx or App.tsx"}<br />
								{"import { Toaster } from \"@almach/ui\";"}<br />
								<br />
								{"export default function App() {"}<br />
								{"  return ("}<br />
								{"    <>"}<br />
								{"      <YourRoutes />"}<br />
								{"      <Toaster />"}<br />
								{"    </>"}<br />
								{"  );"}<br />
								{"}"}
							</div>
						),
						code: `import { Toaster, toast } from "@almach/ui";

// Place once at the root:
<Toaster />

// Call from anywhere:
toast.success("Done!");`,
						centered: false,
					},
				]}
				props={[
					{
						name: "toast(message, options?)",
						type: "function",
						description: "Default (info) toast.",
					},
					{
						name: "toast.success / .error / .warning / .info",
						type: "function",
						description: "Semantic variant helpers.",
					},
					{
						name: "toast.promise(promise, messages)",
						type: "function",
						description: "Tracks loading → success / error state.",
					},
					{
						name: "options.description",
						type: "string",
						description: "Secondary text below the title.",
					},
					{
						name: "options.duration",
						type: "number",
						default: "4000",
						description: "Auto-dismiss delay in milliseconds.",
					},
					{
						name: "options.action",
						type: "{ label: string; onClick: () => void }",
						description: "Inline action button.",
					},
				]}
			/>
			<Toaster />
		</>
	);
}

function ToastVariantsDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="outline" size="sm" onClick={() => toast("Notification", { description: "You have a new message in your inbox." })}>
				Default
			</Button>
			<Button variant="outline" size="sm" onClick={() => toast.success("Saved!", { description: "Your changes have been saved successfully." })}>
				Success
			</Button>
			<Button variant="destructive" size="sm" onClick={() => toast.error("Error", { description: "Something went wrong. Please try again." })}>
				Error
			</Button>
			<Button variant="outline" size="sm" onClick={() => toast.warning("Warning", { description: "Please review your input before submitting." })}>
				Warning
			</Button>
		</div>
	);
}

function ToastActionDemo() {
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() =>
				toast("File deleted", {
					description: "report-q4.pdf has been moved to trash.",
					action: { label: "Undo", onClick: () => toast("Restored", { description: "File restored successfully." }) },
				})
			}
		>
			Delete file
		</Button>
	);
}

function ToastPromiseDemo() {
	const fakeAsync = () => new Promise<void>((res) => setTimeout(res, 1500));
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() =>
				toast.promise(fakeAsync(), {
					loading: "Saving changes…",
					success: "Changes saved!",
					error: "Failed to save.",
				})
			}
		>
			Save with promise
		</Button>
	);
}
