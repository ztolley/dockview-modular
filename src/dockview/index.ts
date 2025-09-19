import {
  createDockview,
  themeAbyss,
  type CreateComponentOptions,
  type IContentRenderer,
} from "dockview-core";
import { activatePlugins } from "@/runtime/plugins/pluginManager";
import { defaultLayout } from "./layouts";
import {
  createPanel,
  getPanelInfo,
  getRegisteredPlugins,
} from "./panelRegistry";

let dockviewApi: ReturnType<typeof createDockview> | undefined;

/**
 * Bootstraps the Dockview workspace, activating any discovered plugins before
 * delegating panel creation to the registry-backed factory.
 */
export function setupDockview() {
  console.log("Setting up dockview");
  const appElement = document.getElementById("dockview-app");

  if (!appElement) {
    throw new Error("App element not found");
  }

  const plugins = getRegisteredPlugins();
  activatePlugins(plugins);

  dockviewApi = createDockview(appElement, {
    theme: themeAbyss,
    createComponent: (options: CreateComponentOptions): IContentRenderer => {
      console.log("Creating component:", options.name);
      return createPanel(options.name);
    },
  });

  console.log("Dockview API created");

  // TODO - load the layout (Replace with the code to use settings or a default saved layout)
  defaultLayout(dockviewApi);
}

/**
 * Adds a new panel instance to the active Dockview workspace using the
 * component name registered in the panel registry.
 * @param name Component identifier previously registered via `registerPanel`.
 */
export function addPanelByName(name: string): void {
  if (!dockviewApi) {
    console.warn("Dockview API not ready; cannot add panel", name);
    return;
  }

  const panelInfo = getPanelInfo(name);
  const title = panelInfo?.title ?? formatTitle(name);
  const id = `${name}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

  try {
    dockviewApi.addPanel({
      id,
      component: name,
      title,
    });
  } catch (error) {
    console.error(`Failed to add panel '${name}'`, error);
  }
}

/** Generates a readable fallback title for the given component name. */
function formatTitle(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}
