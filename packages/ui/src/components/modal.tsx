"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@almach/utils";
import { useIsMobile } from "../hooks/use-media-query";
import { Dialog } from "./dialog";
import { Drawer } from "./drawer";

/* ── Types ───────────────────────────────────────────────────────────────── */
type ViewComponent = React.ComponentType<Record<string, unknown>>;

interface ViewsRegistry {
	[viewName: string]: ViewComponent;
}

/* ── Context ─────────────────────────────────────────────────────────────── */
interface ModalCtxValue {
	isMobile: boolean;
	views: ViewsRegistry | undefined;
	view: string;
	setView: (v: string) => void;
	contentHeight: number;
	setContentHeight: (h: number) => void;
}

const ModalCtx = React.createContext<ModalCtxValue>({
	isMobile: false,
	views: undefined,
	view: "default",
	setView: () => {},
	contentHeight: 0,
	setContentHeight: () => {},
});

/* Internal: tracks which view is currently rendered (lags during transition) */
const DisplayedViewCtx = React.createContext<string>("default");

function useModalCtx() {
	return React.useContext(ModalCtx);
}

/** Use inside any view component to read/change the current view. */
function useModal() {
	const { view, setView } = useModalCtx();
	return { view, setView };
}

/* ── Root ─────────────────────────────────────────────────────────────────── */
interface ModalRootProps {
	children?: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Shorthand: wraps element in Modal.Trigger */
	trigger?: React.ReactNode;
	/** Shorthand: renders Modal.Header + Modal.Title (regular mode only) */
	title?: string;
	/** Shorthand: renders Modal.Description below the title */
	description?: string;
	/** Enable family multi-view mode — map of view name → component */
	views?: ViewsRegistry;
	/** Starting view for family mode (default: "default") */
	defaultView?: string;
	/** Called whenever the active view changes */
	onViewChange?: (view: string) => void;
}

function ModalRoot({
	children,
	open,
	defaultOpen,
	onOpenChange,
	trigger,
	title,
	description,
	views: customViews,
	defaultView = "default",
	onViewChange,
}: ModalRootProps) {
	const isMobile = useIsMobile();
	const Root = isMobile ? Drawer : Dialog;

	const [view, setView] = React.useState(defaultView);
	const [contentHeight, setContentHeight] = React.useState(0);

	const views =
		customViews && Object.keys(customViews).length > 0 ? customViews : undefined;

	const handleViewChange = (v: string) => {
		setView(v);
		onViewChange?.(v);
	};

	const rootProps = {
		...(open !== undefined && { open }),
		...(defaultOpen !== undefined && { defaultOpen }),
		...(onOpenChange !== undefined && { onOpenChange }),
	};

	const isFamilyMode = !!views;
	const hasShorthand = trigger !== undefined || title !== undefined;

	const inner =
		hasShorthand ? (
			<>
				{trigger !== undefined && (
					<ModalTrigger asChild>{trigger}</ModalTrigger>
				)}
				{isFamilyMode ? (
					<ModalContent />
				) : (
					<ModalContent>
						{title !== undefined && (
							<ModalHeader>
								<ModalTitle>{title}</ModalTitle>
								{description && <ModalDescription>{description}</ModalDescription>}
							</ModalHeader>
						)}
						{children}
					</ModalContent>
				)}
			</>
		) : (
			children
		);

	return (
		<ModalCtx.Provider
			value={{ isMobile, views, view, setView: handleViewChange, contentHeight, setContentHeight }}
		>
			<Root {...rootProps}>{inner}</Root>
		</ModalCtx.Provider>
	);
}

/* ── Trigger ─────────────────────────────────────────────────────────────── */
interface ModalTriggerProps {
	asChild?: boolean;
	children: React.ReactNode;
}

function ModalTrigger({ asChild, children }: ModalTriggerProps) {
	const { isMobile } = useModalCtx();
	const Trigger = isMobile ? Drawer.Trigger : Dialog.Trigger;
	return <Trigger {...(asChild !== undefined && { asChild })}>{children}</Trigger>;
}

/* ── Content ─────────────────────────────────────────────────────────────── */
interface ModalContentProps {
	children?: React.ReactNode;
	className?: string;
}

const ModalContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	ModalContentProps
>(({ children, className }, ref) => {
	const { isMobile, views, contentHeight } = useModalCtx();
	const isFamilyMode = !!views;

	const familyContent = children ?? (
		<>
			<ModalFamilyClose />
			<ModalAnimatedWrapper>
				<ModalAnimatedContent>
					<ModalViewContent />
				</ModalAnimatedContent>
			</ModalAnimatedWrapper>
		</>
	);

	/* Mobile — Vaul bottom sheet */
	if (isMobile) {
		return (
			<Drawer.Content className={className}>
				{isFamilyMode ? familyContent : children}
			</Drawer.Content>
		);
	}

	/* Desktop, family mode — bare DialogPrimitive with height animation */
	if (isFamilyMode) {
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
						"w-[calc(100%-2rem)] max-w-[361px] overflow-hidden rounded-[36px]",
						"bg-background shadow-xl outline-none",
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
					{familyContent}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		);
	}

	/* Desktop, regular mode — standard Dialog */
	return (
		<Dialog.Content ref={ref} className={className}>
			{children}
		</Dialog.Content>
	);
});
ModalContent.displayName = "Modal.Content";

/* ── Header ──────────────────────────────────────────────────────────────── */
function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Header className={className} {...props} />;
	return <Dialog.Header className={className} {...props} />;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Footer className={className} {...props} />;
	return <Dialog.Footer className={className} {...props} />;
}

/* ── Title ───────────────────────────────────────────────────────────────── */
const ModalTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Title ref={ref} className={className} {...props} />;
	return <Dialog.Title ref={ref} className={className} {...props} />;
});
ModalTitle.displayName = "Modal.Title";

/* ── Description ─────────────────────────────────────────────────────────── */
const ModalDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Description ref={ref} className={className} {...props} />;
	return <Dialog.Description ref={ref} className={className} {...props} />;
});
ModalDescription.displayName = "Modal.Description";

/* ── Close ───────────────────────────────────────────────────────────────── */
interface ModalCloseProps {
	asChild?: boolean;
	children: React.ReactNode;
	className?: string;
}

function ModalClose({ asChild, children, className }: ModalCloseProps) {
	const { isMobile } = useModalCtx();
	const Close = isMobile ? Drawer.Close : Dialog.Close;
	return (
		<Close
			{...(asChild !== undefined && { asChild })}
			{...(className !== undefined && { className })}
		>
			{children}
		</Close>
	);
}

/* ── Family: animated wrapper (measures height) ───────────────────────────── */
function ModalAnimatedWrapper({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { setContentHeight } = useModalCtx();
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new ResizeObserver(() => setContentHeight(el.offsetHeight));
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

/* ── Family: animated content (view transitions) ─────────────────────────── */
function ModalAnimatedContent({ children }: { children: React.ReactNode }) {
	const { view } = useModalCtx();
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

/* ── Family: view content renderer ───────────────────────────────────────── */
function ModalViewContent({ views: propViews }: { views?: ViewsRegistry } = {}) {
	const { views: contextViews } = useModalCtx();
	const displayedView = React.useContext(DisplayedViewCtx);
	const views = propViews ?? contextViews;

	if (!views) throw new Error("Modal.ViewContent requires views on the Modal root");

	const ViewComponent = views[displayedView] ?? views.default;
	return ViewComponent ? <ViewComponent /> : null;
}

/* ── Family: floating close button ───────────────────────────────────────── */
function ModalFamilyClose({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	const { isMobile } = useModalCtx();
	const Close = isMobile ? Drawer.Close : DialogPrimitive.Close;
	return (
		<Close
			className={cn(
				"absolute right-8 top-7 z-10 flex h-8 w-8 items-center justify-center",
				"rounded-full bg-muted text-muted-foreground cursor-pointer",
				"transition-transform focus:scale-95 active:scale-75",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
		>
			{children ?? <ModalCloseIcon />}
		</Close>
	);
}

/* ── Family: view header (icon + title + description) ─────────────────────── */
interface ModalViewHeaderProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	className?: string;
}

function ModalViewHeader({ icon, title, description, className }: ModalViewHeaderProps) {
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

/* ── Family: navigation button ────────────────────────────────────────────── */
function ModalNavButton({
	children,
	onClick,
	className,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-muted px-4",
				"text-[17px] font-semibold text-foreground md:font-medium cursor-pointer",
				"transition-transform focus:scale-95 active:scale-95",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
		>
			{children}
		</button>
	);
}

/* ── Family: action button (pill) ─────────────────────────────────────────── */
function ModalActionButton({
	children,
	onClick,
	className,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	className: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex h-12 w-full items-center justify-center gap-[15px] rounded-full",
				"text-center text-[19px] font-semibold md:font-medium cursor-pointer",
				"transition-transform focus:scale-95 active:scale-95",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
		>
			{children}
		</button>
	);
}

/* ── Close icon ───────────────────────────────────────────────────────────── */
function ModalCloseIcon() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<title>Close</title>
			<path d="M10.4854 1.99998L2.00007 10.4853" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M10.4854 10.4844L2.00007 1.99908" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

/* ── Compound export ─────────────────────────────────────────────────────── */
const Modal = Object.assign(ModalRoot, {
	Trigger: ModalTrigger,
	Content: ModalContent,
	Header: ModalHeader,
	Footer: ModalFooter,
	Title: ModalTitle,
	Description: ModalDescription,
	Close: ModalClose,
	/* Family mode */
	ViewHeader: ModalViewHeader,
	ViewContent: ModalViewContent,
	AnimatedWrapper: ModalAnimatedWrapper,
	AnimatedContent: ModalAnimatedContent,
	NavButton: ModalNavButton,
	ActionButton: ModalActionButton,
});

export { Modal, useModal };
export type { ViewsRegistry, ViewComponent };
