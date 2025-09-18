import "dockview-core/dist/styles/dockview.css";
import { setupDockview } from "@/dockview";
import "@/web-components";

import "./styles/layout.css";

document.addEventListener("DOMContentLoaded", () => {
  setupDockview();
});
