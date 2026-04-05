import * as React from "react";

interface AsChildResult {
	children?: React.ReactNode;
	render?: React.ReactElement;
}

/**
 * Maps Radix-like `asChild` usage to React Aria's `render` prop composition.
 */
export function getAsChildProps(asChild: boolean | undefined, children: React.ReactNode): AsChildResult {
	if (!asChild) {
		return { children };
	}

	return { render: React.Children.only(children) as React.ReactElement };
}
