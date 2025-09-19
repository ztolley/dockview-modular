import { promises as fs } from "node:fs";
import path from "node:path";
import type { ResolvedConfig } from "vite";

type DockviewPanelEntry = {
  name: string;
  module?: string;
  export?: string;
};

type PackageJson = {
  name?: string;
  dockview?: {
    panels?: DockviewPanelEntry[];
  };
};

/** Expanded metadata about a package that declared Dockview panels. */
type PackageWithPanels = {
  packageName: string;
  packageRoot: string;
  entries: DockviewPanelEntry[];
};

const VIRTUAL_ID = "virtual:dockview-plugins";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/**
 * Vite plugin that discovers Dockview panel packages via `package.json` metadata
 * and generates a virtual module exporting ready-to-activate plugin objects.
 */
export default function dockviewPlugins() {
  let root = process.cwd();

  return {
    name: "vite-plugin-dockview-plugins",
    enforce: "pre" as const,
    configResolved(cfg: ResolvedConfig) {
      root = cfg.root || process.cwd();
    },
    async resolveId(id: string) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
      return null;
    },
    async load(id: string) {
      if (id !== RESOLVED_ID) {
        return null;
      }

      // Discover every dependency that advertises Dockview panels via package.json.
      const packages = await findPackagesWithPanels(root);
      if (!packages.length) {
        return `export default [];`;
      }

      let importIndex = 0;
      const importStatements: string[] = [];
      const ctorDeclarations: string[] = [];
      const pluginEntries: string[] = [];

      for (const pkg of packages) {
        const panelDescriptors: string[] = [];

        for (const entry of pkg.entries) {
          const moduleVariable = `panelModule_${importIndex}`;
          const ctorVariable = `panelCtor_${importIndex}`;
          const specifier = resolveImportSpecifier(pkg, entry);

          importStatements.push(
            `import * as ${moduleVariable} from "${specifier}";`,
          );

          const defaultAccess = `${moduleVariable}["default"]`;
          const ctorExpression = entry.export
            ? `${moduleVariable}[${JSON.stringify(entry.export)}]`
            : defaultAccess;

          ctorDeclarations.push(`const ${ctorVariable} = ${ctorExpression};`);

          const title = entry.title ?? entry.name;

          panelDescriptors.push(`{
  name: ${JSON.stringify(entry.name)},
  title: ${JSON.stringify(title)},
  renderer: ${ctorVariable},
  source: ${JSON.stringify(specifier)}
}`);

          importIndex += 1;
        }

        pluginEntries.push(`{
  id: ${JSON.stringify(`pkg:${pkg.packageName}`)},
  register({ registerPanel }) {
    const panels = [
      ${panelDescriptors.join(",\n      ")}
    ];
    for (const panel of panels) {
      if (typeof panel.renderer !== "function") {
        console.warn(
          \`Dockview panel '\${panel.name}' from '${pkg.packageName}' did not export a constructor (source: \${panel.source})\`
        );
        continue;
      }
      registerPanel({ name: panel.name, title: panel.title, renderer: panel.renderer });
    }
  }
}`);
      }

      const code = `
${importStatements.join("\n")}

${ctorDeclarations.join("\n")}

const plugins = [
  ${pluginEntries.join(",\n  ")}
];

export default plugins;
`;

      if (process.env.DOCKVIEW_DEBUG_WRITE) {
        const debugPath = path.join(root, ".dockview-plugins.generated.mjs");
        await fs.writeFile(debugPath, code, "utf8");
      }

      return code;
    },
  };
}

/**
 * Scans the dependency tree for packages that declare Dockview panels and
 * returns the metadata needed to generate import statements for them.
 */
async function findPackagesWithPanels(
  root: string,
): Promise<PackageWithPanels[]> {
  const packagesDir = path.join(root, "node_modules");
  const packageDirs = await collectPackageDirs(packagesDir);
  const matches: PackageWithPanels[] = [];

  for (const dir of packageDirs) {
    const pkgJsonPath = path.join(dir, "package.json");
    const pkgJson = await readPackageJson(pkgJsonPath);
    if (!pkgJson?.name) {
      continue;
    }

    const entries = pkgJson.dockview?.panels?.filter(isValidPanelEntry);
    if (!entries?.length) {
      continue;
    }

    matches.push({
      packageName: pkgJson.name,
      packageRoot: dir,
      entries,
    });
  }

  return matches;
}

/**
 * Collects absolute paths for every package folder within the provided `node_modules` tree.
 */
async function collectPackageDirs(packagesDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(packagesDir);
    const packageDirs: string[] = [];

    for (const entry of entries) {
      if (entry.startsWith("@")) {
        const scopeDir = path.join(packagesDir, entry);
        try {
          const scopedPackages = await fs.readdir(scopeDir);
          for (const scoped of scopedPackages) {
            packageDirs.push(path.join(scopeDir, scoped));
          }
        } catch {
          /* ignore scoped directory that can't be read */
        }
      } else {
        packageDirs.push(path.join(packagesDir, entry));
      }
    }

    return packageDirs;
  } catch {
    return [];
  }
}

/**
 * Reads and parses a package.json file, returning null when the file cannot be read or parsed.
 */
async function readPackageJson(file: string): Promise<PackageJson | null> {
  try {
    const content = await fs.readFile(file, "utf8");
    return JSON.parse(content) as PackageJson;
  } catch {
    return null;
  }
}

/**
 * Ensures the metadata entry has a usable panel name.
 */
function isValidPanelEntry(
  entry: DockviewPanelEntry | undefined,
): entry is DockviewPanelEntry {
  return Boolean(
    entry && typeof entry.name === "string" && entry.name.trim().length,
  );
}

/**
 * Resolves the import specifier that will be emitted in the virtual module for
 * the panel entry. Supports bare specifiers, absolute paths (resolved relative
 * to the package root) and relative paths.
 */
function resolveImportSpecifier(
  pkg: PackageWithPanels,
  entry: DockviewPanelEntry,
): string {
  const modulePath = entry.module ?? ".";

  if (modulePath === ".") {
    return pkg.packageName;
  }

  if (modulePath.startsWith("./") || modulePath.startsWith("../")) {
    return normalizePath(path.resolve(pkg.packageRoot, modulePath));
  }

  if (modulePath.startsWith("/")) {
    return normalizePath(path.resolve(pkg.packageRoot, `.${modulePath}`));
  }

  return modulePath;
}

/** Normalises Windows and POSIX paths so Vite receives forward-slash specifiers. */
function normalizePath(p: string): string {
  return p.split(path.sep).join("/");
}
