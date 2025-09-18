import {
  createDockview,
  themeAbyss,
  type CreateComponentOptions,
  type IContentRenderer,
} from "dockview-core";
import { defaultLayout } from "./layouts";
import { WebComponentPanel } from "./panels";

let dockviewApi: ReturnType<typeof createDockview>;

export function setupDockview() {
  console.log("Setting up dockview");
  const appElement = document.getElementById("dockview-app");

  if (!appElement) {
    throw new Error("App element not found");
  }

  dockviewApi = createDockview(appElement, {
    theme: themeAbyss,
    createComponent: (options: CreateComponentOptions): IContentRenderer => {
      console.log("Creating component:", options.name);
      return new WebComponentPanel(options.name);
    },
  });

  console.log("Dockview API created");

  // TODO - load the layout (Replace with the code to use settings or a default saved layout)
  defaultLayout(dockviewApi);
}
