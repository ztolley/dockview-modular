import { InternalPanel } from "../panels";
import { registerPanel } from "./registry";

registerPanel({
  name: "internal",
  renderer: InternalPanel,
  title: "Internal Panel",
});
