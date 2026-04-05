"use client";

import * as React from "react";

import { cn } from "@almach/utils";
import { useIsMobile } from "../hooks/use-media-query.js";
import { MOTION_VAR_OVERLAY_DURATION, resolveMotionDurationMs } from "./_motion.js";
import { Button } from "./button.js";
import { Dialog } from "./dialog.js";
import { Drawer } from "./drawer";

type ViewComponent = React.ComponentType<Record<string, unknown>>;
interface ViewsRegistry {
	[viewName: string]: ViewComponent;
}

const MODAL_VIEW_TRANSITION_MS = 180;
const MODAL_VIEW_TRANSITION_EASE = "cubic-bezier(0.22,1,0.36,1)";

interface ModalCtxValue {
	isMobile: boolean;
	views: ViewsRegistry | undefined;
	view: string;
	setView: (v: string) => void;
}

const ModalCtx = React.createContext<ModalCtxValue>({
	isMobile: false,
	views: undefined,
	view: "default",
	setView: () => {},
});

function useModalCtx() {
	return React.useContext(ModalCtx);
}

function useModal() {
	const { view, setView } = useModalCtx();
	return { view, setView };
}

interface ModalRootProps {
	children?: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	title?: string;
	description?: string;
	views?: ViewsRegistry;
	defaultView?: string;
	onViewChange?: (view: string) => void;
}

function ModalRoot({ children, open, defaultOpen, onOpenChange, trigger, title, description, views: customViews, defaultView = "default", onViewChange }: ModalRootProps) {
	const isMobile = useIsMobile();
	const Root = isMobile ? Drawer : Dialog;

	const [view, setView] = React.useState(defaultView);
	const views = customViews && Object.keys(customViews).length > 0 ? customViews : undefined;

	const handleViewChange = (v: string) => {
		setView(v);
		onViewChange?.(v);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange?.(nextOpen);
		if (!nextOpen) {
			handleViewChange(defaultView);
		}
	};

	const rootProps = {
		...(open !== undefined && { open }),
		...(defaultOpen !== undefined && { defaultOpen }),
		onOpenChange: handleOpenChange,
	};

	const hasShorthand = trigger !== undefined || title !== undefined;

	const inner = hasShorthand ? (
		<>
			{trigger !== undefined ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
			<ModalContent>
				{title !== undefined ? (
					<ModalHeader>
						<ModalTitle>{title}</ModalTitle>
						{description ? <ModalDescription>{description}</ModalDescription> : null}
					</ModalHeader>
				) : null}
				{views ? <ModalViewContent /> : children}
			</ModalContent>
		</>
	) : (
		children
	);

	return (
		<ModalCtx.Provider value={{ isMobile, views, view, setView: handleViewChange }}>
			<Root {...rootProps}>{inner}</Root>
		</ModalCtx.Provider>
	);
}

interface ModalTriggerProps {
	asChild?: boolean;
	children: React.ReactNode;
}
function ModalTrigger({ asChild, children }: ModalTriggerProps) {
	const { isMobile } = useModalCtx();
	const Trigger = isMobile ? Drawer.Trigger : Dialog.Trigger;
	return <Trigger {...(asChild !== undefined && { asChild })}>{children}</Trigger>;
}

interface ModalContentProps {
	children?: React.ReactNode;
	className?: string;
	hideClose?: boolean;
}
const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(({ children, className, hideClose }, ref) => {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Content ref={ref} className={className}>{children}</Drawer.Content>;
	return <Dialog.Content ref={ref} className={className} hideClose={hideClose}>{children}</Dialog.Content>;
});
ModalContent.displayName = "Modal.Content";

function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Header className={className} {...props} />;
	return <Dialog.Header className={className} {...props} />;
}

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Footer className={className} {...props} />;
	return <Dialog.Footer className={className} {...props} />;
}

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { isMobile } = useModalCtx();
	return (
		<div
			className={cn(
				isMobile ? "px-4 py-2" : "py-2",
				className,
			)}
			{...props}
		/>
	);
}

const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Title ref={ref} className={className} {...props} />;
	return <Dialog.Title ref={ref} className={className} {...props} />;
});
ModalTitle.displayName = "Modal.Title";

const ModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
	const { isMobile } = useModalCtx();
	if (isMobile) return <Drawer.Description ref={ref} className={className} {...props} />;
	return <Dialog.Description ref={ref} className={className} {...props} />;
});
ModalDescription.displayName = "Modal.Description";

interface ModalCloseProps {
	asChild?: boolean;
	children: React.ReactNode;
	className?: string;
}
function ModalClose({ asChild, children, className }: ModalCloseProps) {
	const { isMobile } = useModalCtx();
	const Close = isMobile ? Drawer.Close : Dialog.Close;
	return <Close {...(asChild !== undefined && { asChild })} {...(className !== undefined && { className })}>{children}</Close>;
}

function ModalViewContent({ views: propViews, view: explicitView }: { views?: ViewsRegistry; view?: string } = {}) {
	const { views: contextViews, view } = useModalCtx();
	const views = propViews ?? contextViews;
	const activeView = explicitView ?? view;
	if (!views) throw new Error("Modal.ViewContent requires views on the Modal root");
	const ViewComponent = views[activeView] ?? views.default;
	return ViewComponent ? <ViewComponent /> : null;
}

function ModalAnimatedViewContainer({ children, className }: { children: React.ReactNode; className?: string }) {
	const transitionMs = resolveMotionDurationMs(MOTION_VAR_OVERLAY_DURATION, MODAL_VIEW_TRANSITION_MS);
	const contentRef = React.useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = React.useState<number | null>(null);

	React.useEffect(() => {
		const node = contentRef.current;
		if (!node) return;

		const updateHeight = () => {
			const next = node.offsetHeight;
			setContentHeight((prev) => (prev === next ? prev : next));
		};

		updateHeight();
		const observer = new ResizeObserver(updateHeight);
		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			className="overflow-hidden transition-[height] motion-reduce:transition-none"
			style={{
				transitionDuration: `var(--theme-motion-overlay-duration, ${transitionMs}ms)`,
				transitionTimingFunction: `var(--theme-motion-ease-standard, ${MODAL_VIEW_TRANSITION_EASE})`,
				...(contentHeight === null ? {} : { height: `${contentHeight}px` }),
			}}
		>
			<div ref={contentRef} className={cn("flow-root", className)}>
				{children}
			</div>
		</div>
	);
}

function ModalAnimatedView({ children, views }: { children?: React.ReactNode; views?: ViewsRegistry }) {
	const { view } = useModalCtx();
	const [displayedView, setDisplayedView] = React.useState(view);
	const [phase, setPhase] = React.useState<"idle" | "exit" | "enter">("idle");
	const pendingRef = React.useRef(view);
	const exitTimerRef = React.useRef<number | null>(null);
	const enterTimerRef = React.useRef<number | null>(null);
	const transitionMs = resolveMotionDurationMs(MOTION_VAR_OVERLAY_DURATION, MODAL_VIEW_TRANSITION_MS);

	const clearTimers = React.useCallback(() => {
		if (exitTimerRef.current !== null) {
			window.clearTimeout(exitTimerRef.current);
			exitTimerRef.current = null;
		}
		if (enterTimerRef.current !== null) {
			window.clearTimeout(enterTimerRef.current);
			enterTimerRef.current = null;
		}
	}, []);

	React.useEffect(() => clearTimers, [clearTimers]);

	React.useEffect(() => {
		pendingRef.current = view;
		if (view !== displayedView && phase === "idle") {
			setPhase("exit");
		}
	}, [view, displayedView, phase]);

	React.useEffect(() => {
		if (phase !== "exit") return;
		exitTimerRef.current = window.setTimeout(() => {
			setDisplayedView(pendingRef.current);
			setPhase("enter");
			exitTimerRef.current = null;
		}, transitionMs);

		return () => {
			if (exitTimerRef.current !== null) {
				window.clearTimeout(exitTimerRef.current);
				exitTimerRef.current = null;
			}
		};
	}, [phase]);

	React.useEffect(() => {
		if (phase !== "enter") return;
		enterTimerRef.current = window.setTimeout(() => {
			setPhase("idle");
			enterTimerRef.current = null;
		}, transitionMs);

		return () => {
			if (enterTimerRef.current !== null) {
				window.clearTimeout(enterTimerRef.current);
				enterTimerRef.current = null;
			}
		};
	}, [phase]);

	React.useEffect(() => {
		if (phase === "idle" && pendingRef.current !== displayedView) {
			setPhase("exit");
		}
	}, [phase, displayedView]);

	const renderedContent = children ?? <ModalViewContent {...(views !== undefined && { views })} view={displayedView} />;
	const contentWithView = React.isValidElement(renderedContent) && renderedContent.type === ModalViewContent
		? React.cloneElement(renderedContent as React.ReactElement<{ view?: string }>, { view: displayedView })
		: renderedContent;

	return (
		<div
			className={cn(
				"will-change-[opacity,transform] transition-[opacity,transform] motion-reduce:transition-none",
				phase === "exit" ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100",
			)}
			style={{
				transitionDuration: `var(--theme-motion-overlay-duration, ${transitionMs}ms)`,
				transitionTimingFunction: `var(--theme-motion-ease-standard, ${MODAL_VIEW_TRANSITION_EASE})`,
			}}
		>
			{contentWithView}
		</div>
	);
}

function ModalViewHeader({ icon, title, description, className }: { icon?: React.ReactNode; title: string; description?: string; className?: string }) {
	return (
		<header className={cn("mt-1", className)}>
			{icon}
			<ModalTitle className="mt-2 text-lg font-semibold text-foreground">{title}</ModalTitle>
			{description ? <ModalDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</ModalDescription> : null}
		</header>
	);
}

function ModalNavButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
	return (
		<Button
			variant="outline"
			{...(onClick !== undefined && { onPress: onClick })}
			className={cn(
				"h-11 w-full justify-start border-input bg-muted px-4 text-foreground",
				"hover:bg-accent hover:border-accent",
				className,
			)}
		>
			{children}
		</Button>
	);
}

function ModalActionButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
	return (
		<Button
			{...(onClick !== undefined && { onPress: onClick })}
			className={cn(
				"h-11 w-full",
				className,
			)}
		>
			{children}
		</Button>
	);
}

const Modal = Object.assign(ModalRoot, {
	Trigger: ModalTrigger,
	Content: ModalContent,
	Header: ModalHeader,
	Body: ModalBody,
	Footer: ModalFooter,
	Title: ModalTitle,
	Description: ModalDescription,
	Close: ModalClose,
	ViewHeader: ModalViewHeader,
	ViewContent: ModalViewContent,
	AnimatedViewContainer: ModalAnimatedViewContainer,
	AnimatedView: ModalAnimatedView,
	NavButton: ModalNavButton,
	ActionButton: ModalActionButton,
});

export { Modal, useModal };
export type { ViewsRegistry, ViewComponent };
