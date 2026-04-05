import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";

type ToastOptions = ExternalToast;

interface ToastConfirmOptions extends Omit<ExternalToast, "action" | "cancel"> {
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
}

type ToastFn = typeof sonnerToast & {
	confirm: (message: string, options?: ToastConfirmOptions) => string | number;
};

const toast: ToastFn = Object.assign(sonnerToast, {
	confirm: (message: string, options: ToastConfirmOptions = {}) => {
		const {
			description,
			confirmLabel = "Confirm",
			cancelLabel = "Cancel",
			onConfirm,
			onCancel,
			...rest
		} = options;

		return sonnerToast(message, {
			...rest,
			description,
			action: {
				label: confirmLabel,
				onClick: () => onConfirm?.(),
			},
			cancel: {
				label: cancelLabel,
				onClick: () => onCancel?.(),
			},
		});
	},
});

export { toast };
export type { ToastOptions, ToastConfirmOptions };
