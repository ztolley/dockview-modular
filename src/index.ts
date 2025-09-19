import "dockview-core/dist/styles/dockview.css";
import { setupDockview } from "@/dockview";
import "@/web-components";

import "./styles/layout.css";

// Delay initialisation until the DOM is ready so the Dockview container exists.
document.addEventListener("DOMContentLoaded", () => {
  try {
    setupDockview();
  } catch (error) {
    console.error("Failed to set up Dockview", error);
  }
});
