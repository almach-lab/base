"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Types ──────────────────────────────────────────────────────────────── */
type ViewComponent = React.ComponentType<Record<string, unknown>>;

interface ViewsRegistry {
	[viewName: string]: ViewComponent;
}

/* ── Context ─────────────────────────────────────────────────────────────── */
interface FamilyModalCtxValue {
	view: string;
	setView: (view: string) => void;
	views: ViewsRegistry | undefined;
	contentHeight: number;
	setContentHeight: (h: number) => void;
}

const FamilyModalCtx = React.createContext<FamilyModalCtxValue | undefined>(undefined);
const DisplayedViewCtx = React.createContext<string>("default");

function useFamilyModal() {
	const ctx = React.useContext(FamilyModalCtx);
	if (!ctx) throw new Error("FamilyModal components must be used within FamilyModal");
	return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────────────── */
interface FamilyModalRootProps {
	children: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultView?: string;
	onViewChange?: (view: string) => void;
	views?: ViewsRegistry;
}

function FamilyModalRoot({
	children,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	defaultView = "default",
	onViewChange,
	views: customViews,
}: FamilyModalRootProps) {
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const [view, setView] = React.useState(defaultView);
	const [contentHeight, setContentHeight] = React.useState(0);

	const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setIsOpen = onOpenChange ?? setInternalOpen;

	const handleViewChange = (newView: string) => {
		setView(newView);
		onViewChange?.(newView);
	};

	const views =
		customViews && Object.keys(customViews).length > 0 ? customViews : undefined;

	return (
		<FamilyModalCtx.Provider
			value={{ view, setView: handleViewChange, views, contentHeight, setContentHeight }}
		>
			<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
				{children}
			</DialogPrimitive.Root>
		</FamilyModalCtx.Provider>
	);
}

/* ── Content ─────────────────────────────────────────────────────────────── */
interface FamilyModalContentProps {
	children?: React.ReactNode;
	className?: string;
}

const FamilyModalContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	FamilyModalContentProps
>(({ children, className }, ref) => {
	const { contentHeight } = useFamilyModal();

	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay
				className={cn(
					"fixed inset-0 z-50 bg-black/30",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
				)}
			/>
			<DialogPrimitive.Content
				ref={ref}
				className={cn(
					"fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
					"w-[calc(100%-2rem)] max-w-[361px]",
					"overflow-hidden rounded-[36px] bg-background shadow-xl outline-none",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
					"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
					className
				)}
				style={{
					height: contentHeight > 0 ? contentHeight : undefined,
					transition: "height 0.27s cubic-bezier(0.25, 1, 0.5, 1)",
				}}
			>
				{children ?? (
					<>
						<FamilyModalClose />
						<FamilyModalAnimatedWrapper>
							<FamilyModalAnimatedContent>
								<FamilyModalViewContent />
							</FamilyModalAnimatedContent>
						</FamilyModalAnimatedWrapper>
					</>
				)}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
});
FamilyModalContent.displayName = "FamilyModal.Content";

/* ── Animated Wrapper ─────────────────────────────────────────────────────── */
interface FamilyModalAnimatedWrapperProps {
	children: React.ReactNode;
	className?: string;
}

function FamilyModalAnimatedWrapper({ children, className }: FamilyModalAnimatedWrapperProps) {
	const { setContentHeight } = useFamilyModal();
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new ResizeObserver(() => {
			setContentHeight(el.offsetHeight);
		});
		observer.observe(el);
		setContentHeight(el.offsetHeight);
		return () => observer.disconnect();
	}, [setContentHeight]);

	return (
		<div ref={ref} className={cn("px-6 pb-6 pt-2.5 antialiased", className)}>
			{children}
		</div>
	);
}

/* ── Animated Content ─────────────────────────────────────────────────────── */
interface FamilyModalAnimatedContentProps {
	children: React.ReactNode;
}

function FamilyModalAnimatedContent({ children }: FamilyModalAnimatedContentProps) {
	const { view } = useFamilyModal();
	const [displayedView, setDisplayedView] = React.useState(view);
	const [visible, setVisible] = React.useState(true);
	const pendingRef = React.useRef(view);

	React.useEffect(() => {
		if (view === displayedView) return;
		pendingRef.current = view;
		setVisible(false);
		const t = setTimeout(() => {
			setDisplayedView(pendingRef.current);
			setVisible(true);
		}, 120);
		return () => clearTimeout(t);
	}, [view, displayedView]);

	return (
		<DisplayedViewCtx.Provider value={displayedView}>
			<div
				style={{
					opacity: visible ? 1 : 0,
					transform: visible ? "scale(1)" : "scale(0.96)",
					transition: "opacity 0.12s ease, transform 0.12s ease",
				}}
			>
				{children}
			</div>
		</DisplayedViewCtx.Provider>
	);
}

/* ── View Content ─────────────────────────────────────────────────────────── */
interface FamilyModalViewContentProps {
	views?: ViewsRegistry;
}

function FamilyModalViewContent({ views: propViews }: FamilyModalViewContentProps = {}) {
	const { views: contextViews } = useFamilyModal();
	const displayedView = React.useContext(DisplayedViewCtx);
	const views = propViews ?? contextViews;

	if (!views) {
		throw new Error(
			"FamilyModalViewContent requires views via props or FamilyModal root"
		);
	}

	const ViewComponent = views[displayedView] ?? views.default;
	return ViewComponent ? <ViewComponent /> : null;
}

/* ── Close ────────────────────────────────────────────────────────────────── */
interface FamilyModalCloseProps {
	children?: React.ReactNode;
	className?: string;
}

function FamilyModalClose({ children, className }: FamilyModalCloseProps) {
	return (
		<DialogPrimitive.Close
			className={cn(
				"absolute right-8 top-7 z-10 flex h-8 w-8 items-center justify-center",
				"rounded-full bg-muted text-muted-foreground",
				"transition-transform focus:scale-95 active:scale-75 cursor-pointer",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
		>
			{children ?? <FamilyModalCloseIcon />}
		</DialogPrimitive.Close>
	);
}

/* ── Header ───────────────────────────────────────────────────────────────── */
interface FamilyModalHeaderProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	className?: string;
}

function FamilyModalHeader({ icon, title, description, className }: FamilyModalHeaderProps) {
	return (
		<header className={cn("mt-[21px]", className)}>
			{icon}
			<DialogPrimitive.Title className="mt-2.5 text-[22px] font-semibold text-foreground md:font-medium">
				{title}
			</DialogPrimitive.Title>
			{description && (
				<DialogPrimitive.Description className="mt-3 text-[17px] font-medium leading-[24px] text-muted-foreground md:font-normal">
					{description}
				</DialogPrimitive.Description>
			)}
		</header>
	);
}

/* ── Button ───────────────────────────────────────────────────────────────── */
interface FamilyModalButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

function FamilyModalButton({ children, onClick, className }: FamilyModalButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-muted px-4",
				"text-[17px] font-semibold text-foreground md:font-medium",
				"transition-transform focus:scale-95 active:scale-95 cursor-pointer",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

/* ── Secondary Button ─────────────────────────────────────────────────────── */
interface FamilyModalSecondaryButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	className: string;
}

function FamilyModalSecondaryButton({
	children,
	onClick,
	className,
}: FamilyModalSecondaryButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"flex h-12 w-full items-center justify-center gap-[15px] rounded-full",
				"text-center text-[19px] font-semibold md:font-medium",
				"transition-transform focus:scale-95 active:scale-95 cursor-pointer",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

/* ── Close Icon ───────────────────────────────────────────────────────────── */
function FamilyModalCloseIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Close</title>
			<path
				d="M10.4854 1.99998L2.00007 10.4853"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.4854 10.4844L2.00007 1.99908"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/* ── Compound export ──────────────────────────────────────────────────────── */
const FamilyModal = Object.assign(FamilyModalRoot, {
	Trigger: DialogPrimitive.Trigger,
	Content: FamilyModalContent,
	AnimatedWrapper: FamilyModalAnimatedWrapper,
	AnimatedContent: FamilyModalAnimatedContent,
	ViewContent: FamilyModalViewContent,
	Close: FamilyModalClose,
	Header: FamilyModalHeader,
	Button: FamilyModalButton,
	SecondaryButton: FamilyModalSecondaryButton,
});

export { FamilyModal, useFamilyModal };
export type { ViewsRegistry, ViewComponent };
