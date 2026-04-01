import * as React from "react";
import { SwipeActions, Badge, Card } from "@almach/ui";
import { Trash2, Archive, Star, Check, Edit3, MoreHorizontal } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

/* ── Shared demo data ────────────────────────────────────────────────────── */
const EMAILS = [
	{ id: 1, from: "Alice Johnson", subject: "Q4 Report Review", preview: "Please review the attached...", time: "2m ago", unread: true },
	{ id: 2, from: "Bob Martinez", subject: "Team Lunch Friday", preview: "Are you coming to lunch?", time: "1h ago", unread: false },
	{ id: 3, from: "Carol White", subject: "Design Feedback", preview: "The new mockups look great!", time: "3h ago", unread: true },
];

const TASKS = [
	{ id: 1, label: "Submit expense report", done: false },
	{ id: 2, label: "Review pull request #42", done: false },
	{ id: 3, label: "Update documentation", done: false },
];

export function SwipeActionsPage() {
	const [emails, setEmails] = React.useState(EMAILS);
	const [tasks, setTasks] = React.useState(TASKS);

	const deleteEmail = (id: number) => setEmails((prev) => prev.filter((e) => e.id !== id));
	const completeTask = (id: number) =>
		setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
	const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

	return (
		<ComponentDoc
			name="SwipeActions"
			description="Reveal contextual action buttons by swiping a list item left or right. Built with pointer events — works on both touch and mouse. No external dependencies."
			pkg="@almach/ui"
			examples={[
				{
					title: "Email list (swipe left to delete/archive)",
					description: "Swipe left to reveal Trash and Archive actions.",
					centered: false,
					preview: (
						<div className="w-full max-w-sm space-y-px rounded-xl overflow-hidden border">
							{emails.map((email) => (
								<SwipeActions key={email.id}>
									<SwipeActions.Trailing>
										<SwipeActions.Action
											variant="secondary"
											aria-label="Archive"
											onClick={() => deleteEmail(email.id)}
										>
											<Archive />
											Archive
										</SwipeActions.Action>
										<SwipeActions.Action
											variant="destructive"
											aria-label="Delete"
											onClick={() => deleteEmail(email.id)}
										>
											<Trash2 />
											Delete
										</SwipeActions.Action>
									</SwipeActions.Trailing>
									<SwipeActions.Content className="bg-background px-4 py-3">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													{email.unread && (
														<span className="h-2 w-2 rounded-full bg-primary shrink-0" />
													)}
													<p className="text-sm font-medium truncate">{email.from}</p>
												</div>
												<p className="text-xs font-medium text-foreground truncate mt-0.5">
													{email.subject}
												</p>
												<p className="text-xs text-muted-foreground truncate">{email.preview}</p>
											</div>
											<span className="text-xs text-muted-foreground shrink-0">{email.time}</span>
										</div>
									</SwipeActions.Content>
								</SwipeActions>
							))}
							{emails.length === 0 && (
								<div className="px-4 py-8 text-center text-sm text-muted-foreground">
									Inbox zero 🎉
								</div>
							)}
						</div>
					),
					code: `<SwipeActions>
  <SwipeActions.Trailing>
    <SwipeActions.Action variant="secondary" onClick={archive}>
      <Archive />
      Archive
    </SwipeActions.Action>
    <SwipeActions.Action variant="destructive" onClick={remove}>
      <Trash2 />
      Delete
    </SwipeActions.Action>
  </SwipeActions.Trailing>
  <SwipeActions.Content className="bg-background px-4 py-3">
    {/* row content */}
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Task list (swipe right to complete, left to delete)",
					description: "Leading swipe marks done; trailing swipe removes the task.",
					centered: false,
					preview: (
						<div className="w-full max-w-sm space-y-px rounded-xl overflow-hidden border">
							{tasks.map((task) => (
								<SwipeActions key={task.id}>
									<SwipeActions.Leading>
										<SwipeActions.Action
											variant="success"
											aria-label="Complete"
											onClick={() => completeTask(task.id)}
										>
											<Check />
											Done
										</SwipeActions.Action>
									</SwipeActions.Leading>
									<SwipeActions.Trailing>
										<SwipeActions.Action
											variant="destructive"
											aria-label="Delete"
											onClick={() => deleteTask(task.id)}
										>
											<Trash2 />
											Delete
										</SwipeActions.Action>
									</SwipeActions.Trailing>
									<SwipeActions.Content className="bg-background px-4 py-3.5">
										<div className="flex items-center gap-3">
											<div
												className={cn(
													"h-4 w-4 rounded-full border-2 shrink-0 transition-colors",
													task.done
														? "border-success bg-success"
														: "border-muted-foreground/40",
												)}
											/>
											<span
												className={cn(
													"text-sm",
													task.done && "line-through text-muted-foreground",
												)}
											>
												{task.label}
											</span>
										</div>
									</SwipeActions.Content>
								</SwipeActions>
							))}
						</div>
					),
					code: `<SwipeActions>
  <SwipeActions.Leading>
    <SwipeActions.Action variant="success" onClick={complete}>
      <Check />
      Done
    </SwipeActions.Action>
  </SwipeActions.Leading>
  <SwipeActions.Trailing>
    <SwipeActions.Action variant="destructive" onClick={remove}>
      <Trash2 />
      Delete
    </SwipeActions.Action>
  </SwipeActions.Trailing>
  <SwipeActions.Content className="bg-background px-4 py-3.5">
    {/* task row */}
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Card with actions",
					description: "Works on any content, not just flat list rows.",
					preview: (
						<SwipeActions className="w-full max-w-sm rounded-xl">
							<SwipeActions.Trailing>
								<SwipeActions.Action variant="warning" aria-label="Star">
									<Star />
									Star
								</SwipeActions.Action>
								<SwipeActions.Action variant="secondary" aria-label="Edit">
									<Edit3 />
									Edit
								</SwipeActions.Action>
							</SwipeActions.Trailing>
							<SwipeActions.Content>
								<Card>
									<Card.Content className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
											<MoreHorizontal className="h-5 w-5" />
										</div>
										<div>
											<p className="text-sm font-medium">Swipe me left</p>
											<p className="text-xs text-muted-foreground">Star or edit this card</p>
										</div>
									</Card.Content>
								</Card>
							</SwipeActions.Content>
						</SwipeActions>
					),
					code: `<SwipeActions className="rounded-xl">
  <SwipeActions.Trailing>
    <SwipeActions.Action variant="warning" onClick={star}>
      <Star />
      Star
    </SwipeActions.Action>
    <SwipeActions.Action variant="secondary" onClick={edit}>
      <Edit3 />
      Edit
    </SwipeActions.Action>
  </SwipeActions.Trailing>
  <SwipeActions.Content>
    <Card>...</Card>
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "All action variants",
					description: "default · destructive · success · warning · secondary",
					preview: (
						<div className="w-full max-w-sm space-y-px rounded-xl overflow-hidden border">
							{(
								[
									["default", "Default"],
									["destructive", "Destructive"],
									["success", "Success"],
									["warning", "Warning"],
									["secondary", "Secondary"],
								] as const
							).map(([variant, label]) => (
								<SwipeActions key={variant}>
									<SwipeActions.Trailing>
										<SwipeActions.Action variant={variant}>
											{label}
										</SwipeActions.Action>
									</SwipeActions.Trailing>
									<SwipeActions.Content className="bg-background px-4 py-3">
										<p className="text-sm">
											Swipe left →{" "}
											<Badge variant="outline" className="font-mono text-[10px]">
												{variant}
											</Badge>
										</p>
									</SwipeActions.Content>
								</SwipeActions>
							))}
						</div>
					),
					code: `<SwipeActions>
  <SwipeActions.Trailing>
    <SwipeActions.Action variant="destructive">Delete</SwipeActions.Action>
  </SwipeActions.Trailing>
  <SwipeActions.Content>Row</SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Disabled",
					description: "Pass disabled to lock the item in place.",
					preview: (
						<SwipeActions disabled className="w-full max-w-sm rounded-xl border">
							<SwipeActions.Trailing>
								<SwipeActions.Action variant="destructive">
									<Trash2 />
									Delete
								</SwipeActions.Action>
							</SwipeActions.Trailing>
							<SwipeActions.Content className="bg-background px-4 py-3.5">
								<p className="text-sm text-muted-foreground">Swipe is disabled</p>
							</SwipeActions.Content>
						</SwipeActions>
					),
					code: `<SwipeActions disabled>
  <SwipeActions.Trailing>
    <SwipeActions.Action variant="destructive">Delete</SwipeActions.Action>
  </SwipeActions.Trailing>
  <SwipeActions.Content>Row content</SwipeActions.Content>
</SwipeActions>`,
				},
			]}
			props={[
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Disables all swipe interactions. The content stays locked.",
				},
				{
					name: "onOpenChange",
					type: "(side: SwipeSide) => void",
					description: 'Called when the revealed side changes. Receives "leading", "trailing", or null.',
				},
				{
					name: "SwipeActions.Action › variant",
					type: '"default" | "destructive" | "success" | "warning" | "secondary"',
					default: '"default"',
					description: "Color scheme for the action button.",
				},
				{
					name: "SwipeActions.Action › closeOnAction",
					type: "boolean",
					default: "true",
					description: "Auto-closes the swipe after the action button is clicked.",
				},
			]}
		/>
	);
}

function cn(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}
