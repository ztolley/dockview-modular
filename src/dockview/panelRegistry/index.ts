import { InternalPanel } from "../panels";
import { registerPanel } from "./registry";

export * from "./registry";
export * from "./types";

registerPanel({
  name: "internal",
  renderer: InternalPanel,
  title: "Internal Panel",
});
