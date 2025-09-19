# Dockvew Modular

A POC web application that renders Web Components in Dockview panels.

The initial iteration simply renders a few example web components to get the Dockview infrastructure in place.

The second iteration will add the plugin discovery logic that will analyse npm depdendencies and find those that conform to a protocol to describe a dockview panel web component and include it in the build and offer it as an option to display.

## Dockview panel plugin API

Dockview panels no longer require an imperative registration hook. Installed packages that describe themselves with `dockview.panels` metadata are picked up automatically and their constructors are wired into the registry before the workspace is created.

### Declaring panels in package.json

Third-party npm packages can self-describe the panels they expose by adding a `dockview.panels` stanza to their `package.json`:

```jsonc
{
  "name": "@vendor/my-panels",
  "version": "1.2.3",
  "dockview": {
    "panels": [
      {
        "name": "vendorWelcome",
        "module": "dist/welcome-panel.js",
        "export": "WelcomePanel",
        "title": "Welcome Panel"
      },
      {
        "name": "vendorMetrics",
        "module": "dist/metrics-panel.js"
      }
    ]
  }
}
```

- `name` is the identifier consumers use with `api.addPanel`.
- `module` is resolved relative to the package root unless it is an absolute specifier. Use `./` or `../` prefixes for relative files.
- `export` is optional; if omitted the package must provide a default export that implements `IContentRenderer`.
- `title` is optional; provide it to display a friendly label in menus. Defaults to a title-cased version of `name` when omitted.

### Build-time discovery

A Vite plugin (`vite-plugins/dockviewPlugins.ts`) runs in both dev and build modes. It scans `node_modules` for packages that expose `dockview.panels`, generates a virtual module with static imports for each declared panel, and ships it with the bundle. This keeps the production output self-contained for static hosting setups such as nginx.

### Example package

An example package lives at `plugins/@ztolley/hello-panel/`. Its `package.json` exposes the `GreetingPanel` constructor declared in `index.js`, and the root `package.json` wires it in using an npm `file:` dependency so it is resolved like any other installed package.
