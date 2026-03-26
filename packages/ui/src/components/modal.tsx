"use client";

import * as React from "react";

import { useIsMobile } from "../hooks/use-media-query";
import { Dialog } from "./dialog";
import { Drawer } from "./drawer";

/* ── Context ─────────────────────────────────────────────────────────────── */
const ModalCtx = React.createContext(false);
const useModalCtx = () => React.useContext(ModalCtx);

/* ── Root ─────────────────────────────────────────────────────────────────── */
interface ModalRootProps {
	children: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Shorthand: renders a trigger without needing Modal.Trigger */
	trigger?: React.ReactNode;
	/** Shorthand: renders a title without needing Modal.Header + Modal.Title */
	title?: string;
	/** Shorthand: renders a description below the title */
	description?: string;
}

function ModalRoot({
	children,
	open,
	defaultOpen,
	onOpenChange,
	trigger,
	title,
	description,
}: ModalRootProps) {
	const isMobile = useIsMobile();
	const Root = isMobile ? Drawer : Dialog;

	const rootProps = {
		...(open !== undefined && { open }),
		...(defaultOpen !== undefined && { defaultOpen }),
		...(onOpenChange !== undefined && { onOpenChange }),
	};

	const hasShorthand = trigger !== undefined || title !== undefined;

	return (
		<ModalCtx.Provider value={isMobile}>
			<Root {...rootProps}>
				{hasShorthand ? (
					<>
						{trigger !== undefined && (
							<ModalTrigger asChild>{trigger}</ModalTrigger>
						)}
						<ModalContent>
							{title !== undefined && (
								<ModalHeader>
									<ModalTitle>{title}</ModalTitle>
									{description && (
										<ModalDescription>{description}</ModalDescription>
									)}
								</ModalHeader>
							)}
							{children}
						</ModalContent>
					</>
				) : (
					children
				)}
			</Root>
		</ModalCtx.Provider>
	);
}

/* ── Trigger ─────────────────────────────────────────────────────────────── */
interface ModalTriggerProps {
	asChild?: boolean;
	children: React.ReactNode;
}

function ModalTrigger({ asChild, children }: ModalTriggerProps) {
	const isMobile = useModalCtx();
	const Trigger = isMobile ? Drawer.Trigger : Dialog.Trigger;
	return <Trigger {...(asChild !== undefined && { asChild })}>{children}</Trigger>;
}

/* ── Content ─────────────────────────────────────────────────────────────── */
interface ModalContentProps {
	className?: string;
	children: React.ReactNode;
}

function ModalContent({ className, children }: ModalContentProps) {
	const isMobile = useModalCtx();
	if (isMobile)
		return <Drawer.Content className={className}>{children}</Drawer.Content>;
	return <Dialog.Content className={className}>{children}</Dialog.Content>;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
function ModalHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const isMobile = useModalCtx();
	if (isMobile) return <Drawer.Header className={className} {...props} />;
	return <Dialog.Header className={className} {...props} />;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function ModalFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const isMobile = useModalCtx();
	if (isMobile) return <Drawer.Footer className={className} {...props} />;
	return <Dialog.Footer className={className} {...props} />;
}

/* ── Title ───────────────────────────────────────────────────────────────── */
const ModalTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
	const isMobile = useModalCtx();
	if (isMobile)
		return <Drawer.Title ref={ref} className={className} {...props} />;
	return <Dialog.Title ref={ref} className={className} {...props} />;
});
ModalTitle.displayName = "Modal.Title";

/* ── Description ─────────────────────────────────────────────────────────── */
const ModalDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const isMobile = useModalCtx();
	if (isMobile)
		return <Drawer.Description ref={ref} className={className} {...props} />;
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
	const isMobile = useModalCtx();
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

/* ── Compound export ─────────────────────────────────────────────────────── */
const Modal = Object.assign(ModalRoot, {
	Trigger: ModalTrigger,
	Content: ModalContent,
	Header: ModalHeader,
	Footer: ModalFooter,
	Title: ModalTitle,
	Description: ModalDescription,
	Close: ModalClose,
});

export { Modal };
