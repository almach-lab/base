import * as React from "react";
import { SwipeActions, Badge, Card } from "@almach/ui";
import {
	Trash2, Archive, Star, Check, Flag, Pin, Edit3, Share2,
	CreditCard, CheckCircle2,
} from "lucide-react";
import { cn } from "@almach/utils";
import { ComponentDoc } from "../../component-doc";

/* ── Demo data ───────────────────────────────────────────────────────────── */
const EMAILS = [
	{ id: 1, from: "Alice Johnson",  subject: "Q4 Report Review",  preview: "Please review the attached...",   time: "2m ago",  unread: true  },
	{ id: 2, from: "Bob Martinez",   subject: "Team Lunch Friday",  preview: "Are you coming to lunch?",        time: "1h ago",  unread: false },
	{ id: 3, from: "Carol White",    subject: "Design Feedback",    preview: "The new mockups look great!",     time: "3h ago",  unread: true  },
];

const TASKS = [
	{ id: 1, label: "Submit expense report",    done: false },
	{ id: 2, label: "Review pull request #42",  done: false },
	{ id: 3, label: "Update documentation",     done: false },
];

/* ── Swipe-to-pay demo ───────────────────────────────────────────────────── */
function SwipeToPayDemo() {
	const [status, setStatus] = React.useState<"idle" | "done">("idle");

	if (status === "done") {
		return (
			<div className="w-full max-w-sm rounded-xl border bg-success/10 px-4 py-6 text-center">
				<CheckCircle2 className="mx-auto mb-2 size-8 text-success" />
				<p className="text-sm font-semibold">Payment sent!</p>
				<p className="mt-0.5 text-xs text-muted-foreground">$42.00 → Alice Johnson</p>
				<button
					onClick={() => setStatus("idle")}
					className="mt-4 text-xs text-muted-foreground underline underline-offset-2"
				>
					Reset demo
				</button>
			</div>
		);
	}

	return (
		<SwipeActions
			fullSwipe
			onFullSwipe={() => setStatus("done")}
			className="w-full max-w-sm rounded-xl border"
		>
			<SwipeActions.Left>
				<SwipeActions.Action
					variant="success"
					aria-label="Pay"
					onClick={() => setStatus("done")}
				>
					<CreditCard />
					Pay
				</SwipeActions.Action>
			</SwipeActions.Left>
			<SwipeActions.Content className="bg-background px-4 py-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs text-muted-foreground">Payment to</p>
						<p className="text-sm font-semibold">Alice Johnson</p>
					</div>
					<p className="text-lg font-bold tabular-nums">$42.00</p>
				</div>
				<p className="mt-2 text-xs text-muted-foreground">
					Swipe right to reveal Pay — or drag all the way across to confirm instantly.
				</p>
			</SwipeActions.Content>
		</SwipeActions>
	);
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export function SwipeActionsPage() {
	const [emails, setEmails] = React.useState(EMAILS);
	const [tasks,  setTasks]  = React.useState(TASKS);

	const removeEmail = (id: number) => setEmails(p => p.filter(e => e.id !== id));
	const doneTask    = (id: number) => setTasks(p => p.map(t => t.id === id ? { ...t, done: true } : t));
	const removeTask  = (id: number) => setTasks(p => p.filter(t => t.id !== id));

	return (
		<ComponentDoc
			name="SwipeActions"
			description="Reveal contextual actions by swiping in any direction — left, right, up, or down. Works on both touch and mouse. No external dependencies."
			pkg="@almach/ui"
			examples={[
				{
					title: "Email list — swipe left",
					description: "SwipeActions.Right slot reveals Archive + Delete when swiped left.",
					centered: false,
					preview: (
						<div className="w-full max-w-sm divide-y rounded-xl overflow-hidden border">
							{emails.map(email => (
								<SwipeActions key={email.id}>
									<SwipeActions.Right>
										<SwipeActions.Action variant="secondary" aria-label="Archive" onClick={() => removeEmail(email.id)}>
											<Archive />
											Archive
										</SwipeActions.Action>
										<SwipeActions.Action variant="destructive" aria-label="Delete" onClick={() => removeEmail(email.id)}>
											<Trash2 />
											Delete
										</SwipeActions.Action>
									</SwipeActions.Right>
									<SwipeActions.Content className="bg-background px-4 py-3">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													{email.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
													<p className="text-sm font-medium truncate">{email.from}</p>
												</div>
												<p className="text-xs font-medium truncate mt-0.5">{email.subject}</p>
												<p className="text-xs text-muted-foreground truncate">{email.preview}</p>
											</div>
											<span className="text-xs text-muted-foreground shrink-0">{email.time}</span>
										</div>
									</SwipeActions.Content>
								</SwipeActions>
							))}
							{emails.length === 0 && (
								<div className="px-4 py-8 text-center text-sm text-muted-foreground">Inbox zero 🎉</div>
							)}
						</div>
					),
					code: `<SwipeActions>
  <SwipeActions.Right>
    <SwipeActions.Action variant="secondary" onClick={archive}>
      <Archive /> Archive
    </SwipeActions.Action>
    <SwipeActions.Action variant="destructive" onClick={remove}>
      <Trash2 /> Delete
    </SwipeActions.Action>
  </SwipeActions.Right>
  <SwipeActions.Content className="bg-background px-4 py-3">
    {/* row content */}
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Task list — swipe right + left",
					description: "Left slot (swipe right) to complete. Right slot (swipe left) to delete.",
					centered: false,
					preview: (
						<div className="w-full max-w-sm divide-y rounded-xl overflow-hidden border">
							{tasks.map(task => (
								<SwipeActions key={task.id}>
									<SwipeActions.Left>
										<SwipeActions.Action variant="success" aria-label="Complete" onClick={() => doneTask(task.id)}>
											<Check />
											Done
										</SwipeActions.Action>
									</SwipeActions.Left>
									<SwipeActions.Right>
										<SwipeActions.Action variant="destructive" aria-label="Delete" onClick={() => removeTask(task.id)}>
											<Trash2 />
											Delete
										</SwipeActions.Action>
									</SwipeActions.Right>
									<SwipeActions.Content className="bg-background px-4 py-3.5">
										<div className="flex items-center gap-3">
											<div className={cn(
												"h-4 w-4 rounded-full border-2 shrink-0 transition-colors",
												task.done ? "border-success bg-success" : "border-muted-foreground/40",
											)} />
											<span className={cn("text-sm", task.done && "line-through text-muted-foreground")}>
												{task.label}
											</span>
										</div>
									</SwipeActions.Content>
								</SwipeActions>
							))}
						</div>
					),
					code: `<SwipeActions>
  <SwipeActions.Left>
    <SwipeActions.Action variant="success" onClick={complete}>
      <Check /> Done
    </SwipeActions.Action>
  </SwipeActions.Left>
  <SwipeActions.Right>
    <SwipeActions.Action variant="destructive" onClick={remove}>
      <Trash2 /> Delete
    </SwipeActions.Action>
  </SwipeActions.Right>
  <SwipeActions.Content className="bg-background px-4 py-3.5">
    {/* task row */}
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Swipe to pay",
					description:
						"fullSwipe fires the primary action on a decisive full-width swipe — no reveal-then-tap needed. Perfect for confirmations and payments.",
					preview: <SwipeToPayDemo />,
					code: `<SwipeActions
  fullSwipe
  onFullSwipe={handlePay}
>
  <SwipeActions.Left>
    <SwipeActions.Action variant="success" onClick={handlePay}>
      <CreditCard /> Pay
    </SwipeActions.Action>
  </SwipeActions.Left>
  <SwipeActions.Content className="bg-background px-4 py-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground">Payment to</p>
        <p className="text-sm font-semibold">Alice Johnson</p>
      </div>
      <p className="text-lg font-bold">$42.00</p>
    </div>
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Top & bottom — swipe up / down",
					description: "Top slot (swipe down) and Bottom slot (swipe up) for vertical actions.",
					preview: (
						<SwipeActions className="w-full max-w-sm rounded-xl">
							<SwipeActions.Top>
								<SwipeActions.Action variant="secondary"><Share2 /> Share</SwipeActions.Action>
								<SwipeActions.Action variant="warning"><Pin /> Pin</SwipeActions.Action>
								<SwipeActions.Action variant="default"><Star /> Star</SwipeActions.Action>
							</SwipeActions.Top>
							<SwipeActions.Bottom>
								<SwipeActions.Action variant="secondary"><Edit3 /> Edit</SwipeActions.Action>
								<SwipeActions.Action variant="destructive"><Trash2 /> Delete</SwipeActions.Action>
								<SwipeActions.Action variant="default"><Archive /> Archive</SwipeActions.Action>
							</SwipeActions.Bottom>
							<SwipeActions.Content>
								<Card>
									<Card.Content className="flex flex-col items-center gap-1 py-6 text-center">
										<p className="text-sm font-medium">Swipe up or down</p>
										<p className="text-xs text-muted-foreground">Reveals Top or Bottom action slots</p>
									</Card.Content>
								</Card>
							</SwipeActions.Content>
						</SwipeActions>
					),
					code: `<SwipeActions>
  <SwipeActions.Top>
    <SwipeActions.Action variant="secondary"><Share2 /> Share</SwipeActions.Action>
    <SwipeActions.Action variant="warning"><Pin /> Pin</SwipeActions.Action>
  </SwipeActions.Top>
  <SwipeActions.Bottom>
    <SwipeActions.Action variant="destructive"><Trash2 /> Delete</SwipeActions.Action>
  </SwipeActions.Bottom>
  <SwipeActions.Content>
    <Card>...</Card>
  </SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "All four directions",
					description: "Left, Right, Top, and Bottom slots active simultaneously.",
					preview: (
						<SwipeActions className="w-full max-w-sm rounded-xl">
							<SwipeActions.Left>
								<SwipeActions.Action variant="success"><Check /> Done</SwipeActions.Action>
							</SwipeActions.Left>
							<SwipeActions.Right>
								<SwipeActions.Action variant="destructive"><Trash2 /> Delete</SwipeActions.Action>
							</SwipeActions.Right>
							<SwipeActions.Top>
								<SwipeActions.Action variant="secondary"><Share2 /> Share</SwipeActions.Action>
								<SwipeActions.Action variant="warning"><Flag /> Flag</SwipeActions.Action>
							</SwipeActions.Top>
							<SwipeActions.Bottom>
								<SwipeActions.Action variant="default"><Archive /> Archive</SwipeActions.Action>
								<SwipeActions.Action variant="secondary"><Edit3 /> Edit</SwipeActions.Action>
							</SwipeActions.Bottom>
							<SwipeActions.Content>
								<Card>
									<Card.Content className="flex flex-col items-center gap-1 py-6 text-center">
										<p className="text-sm font-medium">Swipe any direction</p>
										<p className="text-xs text-muted-foreground">←  →  ↑  ↓</p>
									</Card.Content>
								</Card>
							</SwipeActions.Content>
						</SwipeActions>
					),
					code: `<SwipeActions>
  <SwipeActions.Left>
    <SwipeActions.Action variant="success"><Check /> Done</SwipeActions.Action>
  </SwipeActions.Left>
  <SwipeActions.Right>
    <SwipeActions.Action variant="destructive"><Trash2 /> Delete</SwipeActions.Action>
  </SwipeActions.Right>
  <SwipeActions.Top>
    <SwipeActions.Action variant="secondary"><Share2 /> Share</SwipeActions.Action>
  </SwipeActions.Top>
  <SwipeActions.Bottom>
    <SwipeActions.Action variant="default"><Archive /> Archive</SwipeActions.Action>
  </SwipeActions.Bottom>
  <SwipeActions.Content>...</SwipeActions.Content>
</SwipeActions>`,
				},
				{
					title: "Disabled",
					description: "Pass disabled to lock the item in place.",
					preview: (
						<SwipeActions disabled className="w-full max-w-sm rounded-xl border">
							<SwipeActions.Right>
								<SwipeActions.Action variant="destructive"><Trash2 /> Delete</SwipeActions.Action>
							</SwipeActions.Right>
							<SwipeActions.Content className="bg-background px-4 py-3.5">
								<p className="text-sm text-muted-foreground">Swipe is disabled</p>
							</SwipeActions.Content>
						</SwipeActions>
					),
					code: `<SwipeActions disabled>
  <SwipeActions.Right>
    <SwipeActions.Action variant="destructive">Delete</SwipeActions.Action>
  </SwipeActions.Right>
  <SwipeActions.Content>Row content</SwipeActions.Content>
</SwipeActions>`,
				},
			]}
			props={[
				{ name: "disabled",            type: "boolean",                  default: "false",   description: "Disables all swipe interactions." },
				{ name: "threshold",           type: "number",                   default: "0.4",     description: "Fraction of slot size the user must drag past to snap open (0–1)." },
				{ name: "overscroll",          type: "number",                   default: "0.15",    description: "Rubber-band resistance factor when dragging past the slot edge. Lower = more resistance (0–1)." },
				{ name: "fullSwipe",           type: "boolean",                  default: "false",   description: "Allow a full-width swipe to immediately fire the primary action — ideal for swipe-to-pay / swipe-to-dismiss." },
				{ name: "fullSwipeThreshold",  type: "number",                   default: "0.55",    description: "Fraction of container width needed to trigger a full swipe. Only applies when fullSwipe is true." },
				{ name: "onFullSwipe",         type: "(side: SwipeSide) => void",                    description: "Called immediately when a full-swipe gesture fires." },
				{ name: "onOpenChange",        type: "(side: SwipeSide) => void",                    description: 'Called when the revealed side changes. Receives "left", "right", "top", "bottom", or null.' },
				{ name: "Action › variant",    type: '"default" | "destructive" | "success" | "warning" | "secondary"', default: '"default"', description: "Color scheme for the action button." },
				{ name: "Action › closeOnAction", type: "boolean",              default: "true",    description: "Auto-closes the panel after the action button is clicked." },
			]}
		/>
	);
}
