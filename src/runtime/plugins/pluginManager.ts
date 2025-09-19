import { registerPanel } from "@/dockview/panelRegistry";
import type {
  DockviewPlugin,
  DockviewPluginContext,
} from "@/dockview/panelRegistry/types";

/**
 * Runtime helper that activates build-discovered plugins and funnels their
 * panel registrations into the shared panel registry.
 */

const loadedPluginIds = new Set<string>();

/**
 * Shared context instance passed to every plugin during activation so they can
 * contribute panel constructors via the central registry.
 */
const context: DockviewPluginContext = {
  registerPanel,
};

/**
 * Activates a single plugin, guarding against duplicate activations and
 * delegating registration of any panels the plugin exposes.
 * @param plugin The plugin to activate.
 */
export function activatePlugin(plugin: DockviewPlugin): void {
  if (loadedPluginIds.has(plugin.id)) {
    console.warn(`Plugin '${plugin.id}' already activated; skipping.`);
    return;
  }

  plugin.register(context);
  loadedPluginIds.add(plugin.id);
}

/**
 * Activates a collection of plugins in order.
 * @param plugins Plugins returned from the discovery step.
 */
export function activatePlugins(plugins: DockviewPlugin[]): void {
  for (const plugin of plugins) {
    activatePlugin(plugin);
  }
}
