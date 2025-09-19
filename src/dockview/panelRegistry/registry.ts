import type { IContentRenderer } from "dockview-core";
import discoveredPlugins from "virtual:dockview-plugins";
import type { DockviewPlugin } from "./types";

/**
 * Central registry for all Dockview panels, both built-in and those registered
 * from NPM packages. Provides lookup, creation, and change notifications so
 * the rest of the application can stay decoupled from registration timing.
 */

export type PanelConstructor = new () => IContentRenderer;

interface RegisteredPanel {
  renderer: PanelConstructor;
  title: string;
}

const panelConstructors: Record<string, RegisteredPanel> = {};
const panelListeners = new Set<(panels: PanelInfo[]) => void>();

export interface PanelRegistration {
  /** Unique component identifier used with Dockview's `addPanel` API. */
  name: string;
  /** Class responsible for rendering the panel's content. */
  renderer: PanelConstructor;
  /** Optional human readable label shown in menus and panel titles. */
  title?: string;
}

export interface PanelInfo {
  /** Unique component identifier used by Dockview. */
  name: string;
  /** Friendly label suitable for UI display. */
  title: string;
}

/**
 * Registers a panel renderer with an optional friendly title. The most recent
 * registration wins when duplicate names are provided.
 */
export function registerPanel(registration: PanelRegistration): void {
  panelConstructors[registration.name] = {
    renderer: registration.renderer,
    title: registration.title ?? formatTitle(registration.name),
  };
  notifyPanelListeners();
}

export function createPanel(name: string): IContentRenderer {
  const panel = panelConstructors[name];

  if (!panel) {
    throw new Error(`Panel not found: ${name}`);
  }

  return new panel.renderer();
}

/** Returns all registered panels sorted by display title. */
export function getPanels(): PanelInfo[] {
  return Object.entries(panelConstructors)
    .map(([name, value]) => ({ name, title: value.title }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Looks up a panel by name. Returns `undefined` when no panel is registered. */
export function getPanelInfo(name: string): PanelInfo | undefined {
  const panel = panelConstructors[name];
  if (!panel) {
    return undefined;
  }
  return { name, title: panel.title };
}

/**
 * Subscribes to panel registry changes.
 * @param listener callback that receives the current panel list whenever it changes
 * @returns disposer that unsubscribes the listener
 */
export function onPanelsChanged(
  listener: (panels: PanelInfo[]) => void,
): () => void {
  panelListeners.add(listener);
  listener(getPanels());

  return () => {
    panelListeners.delete(listener);
  };
}

/** Notifies all subscribers with the latest panel list. */
function notifyPanelListeners(): void {
  if (panelListeners.size === 0) {
    return;
  }

  const panels = getPanels();
  for (const listener of panelListeners) {
    listener(panels);
  }
}

/** Generates a readable title from a camelCase, kebab-case, or snake_case name. */
function formatTitle(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Returns the list of plugins produced by the Vite discovery step. Because the
 * virtual module is generated at build time, the result is already fully
 * materialised and can be used synchronously during application bootstrap.
 */
export function getRegisteredPlugins(): DockviewPlugin[] {
  return discoveredPlugins;
}
