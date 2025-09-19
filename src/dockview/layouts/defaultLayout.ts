import { DockviewApi } from "dockview-core";

/**
 * Seeds the workspace with a starter layout so users see content on first load.
 * @param api Active Dockview API returned from `createDockview`.
 */
export function defaultLayout(api: DockviewApi): void {
  console.log("Setting up default layout");

  api.addPanel({
    id: "InternalPanel",
    component: "internal",
    title: "Internal Panel",
  });
}
