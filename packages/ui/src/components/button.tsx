import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "cursor-pointer select-none rounded-lg text-sm",
    MOTION_INTERACTIVE,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
    "data-[pressed]:scale-[0.985]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm data-[hovered]:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm data-[hovered]:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground data-[hovered]:bg-secondary/80",
        ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        link: "text-primary underline-offset-4 data-[hovered]:underline",
        success:
          "bg-success text-success-foreground shadow-sm data-[hovered]:bg-success/90",
        warning:
          "bg-warning text-warning-foreground shadow-sm data-[hovered]:bg-warning/90",
      },
      size: {
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        default: "h-9 px-4 [&_svg]:size-4",
        lg: "h-11 px-6 text-base [&_svg]:size-4",
        icon: "h-9 w-9 [&_svg]:size-4",
        "icon-sm": "h-8 w-8 [&_svg]:size-3.5",
        "icon-lg": "h-11 w-11 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type AriaButtonProps = React.ComponentPropsWithoutRef<typeof AriaButton>;

export interface ButtonProps
  extends Omit<AriaButtonProps, "className" | "children" | "isDisabled">,
    VariantProps<typeof buttonVariants> {
  href?: string;
  target?: string;
  rel?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isDisabled?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      isDisabled,
      href,
      target,
      rel,
      ...props
    },
    ref,
  ) => {
    const isDisabledState = disabled ?? isDisabled ?? false;
    const classes = cn(buttonVariants({ variant, size, className }));

    const content = (
      <>
        {loading ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </>
    );

    if (href) {
      return (
        <AriaLink
          {...(props as any)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={classes}
          isDisabled={isDisabledState || loading}
        >
          {content}
        </AriaLink>
      );
    }

    return (
      <AriaButton
        {...props}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        isDisabled={isDisabledState || loading}
        aria-busy={loading || undefined}
      >
        {content}
      </AriaButton>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
