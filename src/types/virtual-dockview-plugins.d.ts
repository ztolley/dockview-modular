declare module "virtual:dockview-plugins" {
  import type { DockviewPlugin } from "@/dockview/panelRegistry";

  const plugins: DockviewPlugin[];
  export default plugins;
}
