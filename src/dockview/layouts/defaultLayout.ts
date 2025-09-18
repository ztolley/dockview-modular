import { DockviewApi } from "dockview-core";

export function defaultLayout(api: DockviewApi) {
  console.log("Setting up default layout");

  api.addPanel({
    id: "debug",
    component: "ztdm-debug",
    title: "Debug",
  });
}
