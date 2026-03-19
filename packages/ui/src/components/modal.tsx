"use client";

import * as React from "react";

import { useIsMobile } from "../hooks/use-media-query";
import { Dialog } from "./dialog";
import { Drawer } from "./drawer";

/* ── Context ─────────────────────────────────────────────────────────────── */
const ModalCtx = React.createContext(false);
const useModal = () => React.useContext(ModalCtx);

/* ── Root ────────────────────────────────────────────────────────────────── */
interface ModalRootProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

function ModalRoot({ open, onOpenChange, children }: ModalRootProps) {
	const isMobile = useIsMobile();
	const Root = isMobile ? Drawer : Dialog;
	return (
		<ModalCtx.Provider value={isMobile}>
			<Root open={open} onOpenChange={onOpenChange}>
				{children}
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
	const isMobile = useModal();
	const Trigger = isMobile ? Drawer.Trigger : Dialog.Trigger;
	return <Trigger asChild={asChild}>{children}</Trigger>;
}

/* ── Content ─────────────────────────────────────────────────────────────── */
interface ModalContentProps {
	className?: string;
	children: React.ReactNode;
}

function ModalContent({ className, children }: ModalContentProps) {
	const isMobile = useModal();
	if (isMobile)
		return <Drawer.Content className={className}>{children}</Drawer.Content>;
	return <Dialog.Content className={className}>{children}</Dialog.Content>;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
function ModalHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const isMobile = useModal();
	if (isMobile) return <Drawer.Header className={className} {...props} />;
	return <Dialog.Header className={className} {...props} />;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function ModalFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const isMobile = useModal();
	if (isMobile) return <Drawer.Footer className={className} {...props} />;
	return <Dialog.Footer className={className} {...props} />;
}

/* ── Title ───────────────────────────────────────────────────────────────── */
const ModalTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
	const isMobile = useModal();
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
	const isMobile = useModal();
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
	const isMobile = useModal();
	const Close = isMobile ? Drawer.Close : Dialog.Close;
	return (
		<Close asChild={asChild} className={className}>
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
