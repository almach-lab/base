import * as React from "react";
import { Button, Toaster, useToast } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function ToastPage() {
	return (
		<>
			<ComponentDoc
				name="Toast"
				description="Transient notifications that auto-dismiss. Use the useToast hook to fire them from anywhere in the component tree."
				examples={[
					{
						title: "Variants",
						description:
							"Three semantic variants. Click each button to trigger a toast.",
						preview: <ToastVariantsDemo />,
						code: `import { useToast } from "@almach/ui";

function Demo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: "Notification", description: "You have a new message." })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: "Saved!", description: "Your changes have been saved.", variant: "success" })
        }
      >
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
        }
      >
        Destructive
      </Button>
    </div>
  );
}`,
					},
					{
						title: "With action",
						description: "Toasts can include a single action button.",
						preview: <ToastActionDemo />,
						code: `const { toast } = useToast();

toast({
  title: "File deleted",
  description: "report-q4.pdf has been moved to trash.",
  action: (
    <ToastAction altText="Undo deletion">Undo</ToastAction>
  ),
});`,
					},
					{
						title: "Setup",
						description:
							"Add <Toaster /> once at the app root to render toasts.",
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
						code: `// main.tsx or App.tsx
import { Toaster } from "@almach/ui";

export default function App() {
  return (
    <>
      <YourRoutes />
      <Toaster />
    </>
  );
}`,
						centered: false,
					},
				]}
				props={[
					{
						name: "title",
						type: "ReactNode",
						required: true,
						description: "Short notification title.",
					},
					{
						name: "description",
						type: "ReactNode",
						description: "Optional secondary text below the title.",
					},
					{
						name: "variant",
						type: '"default" | "success" | "destructive"',
						default: '"default"',
						description: "Controls the color scheme of the toast.",
					},
					{
						name: "action",
						type: "ReactElement",
						description: "A single action button (ToastAction element).",
					},
					{
						name: "duration",
						type: "number",
						default: "4000",
						description: "Auto-dismiss delay in milliseconds.",
					},
				]}
			/>
			<Toaster />
		</>
	);
}

function ToastVariantsDemo() {
	const { toast } = useToast();
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toast({
						title: "Notification",
						description: "You have a new message in your inbox.",
					})
				}
			>
				Default
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toast({
						title: "Saved!",
						description: "Your changes have been saved successfully.",
						variant: "success",
					})
				}
			>
				Success
			</Button>
			<Button
				size="sm"
				variant="destructive"
				onClick={() =>
					toast({
						title: "Error",
						description: "Something went wrong. Please try again.",
						variant: "destructive",
					})
				}
			>
				Destructive
			</Button>
		</div>
	);
}

function ToastActionDemo() {
	const { toast } = useToast();
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() =>
				toast({
					title: "File deleted",
					description: "report-q4.pdf has been moved to trash.",
				})
			}
		>
			Delete file
		</Button>
	);
}
