/**
 * @deprecated Use `Card.Layers`, `Card.LayerHeader`, `Card.LayerBody`, and `Card.LayerRow`
 * from `@almach/ui` instead. LayeredCard has been merged into the Card component.
 *
 * @example
 * import { Card } from "@almach/ui";
 * <Card.Layers>
 *   <Card.LayerHeader>Settings</Card.LayerHeader>
 *   <Card.LayerRow action={<Switch />}>Notifications</Card.LayerRow>
 * </Card.Layers>
 */
export { Card as LayeredCard } from "./card";
