import type { PanelRegistration } from "./registry";

/** Context passed to plugin register hooks, allowing them to contribute panels. */
export interface DockviewPluginContext {
  /**
   * Registers a panel renderer with the host application.
   * @param registration Panel metadata to add to the registry.
   */
  registerPanel(registration: PanelRegistration): void;
}

/**
 * Contract implemented by build-generated plugins that wire package panels
 * into the Dockview runtime.
 */
export interface DockviewPlugin {
  /** Stable identifier for diagnostics and duplicate guards */
  id: string;
  /** Called during activation so the plugin can register its panels. */
  register(context: DockviewPluginContext): void;
}

/** Declaration describing a single panel exported by an npm package. */
export interface DockviewPackagePanelEntry {
  /** Name used when calling api.addPanel */
  name: string;
  /** Module specifier that exports the panel constructor */
  module: string;
  /** Named export within the module; defaults to the module's default export */
  export?: string;
  /** Optional human readable title shown in menus */
  title?: string;
}

/** Root metadata block read from a package's `package.json`. */
export interface DockviewPackageMetadata {
  panels: DockviewPackagePanelEntry[];
}
