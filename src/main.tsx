import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/_globals.scss"; // Import the new SCSS file
import "../packages/core/src/styles/vanilla-dialog.scss"; // Correction du chemin d'import
import "../packages/core/src/styles/_dialog-tabs.scss"; // Correction du chemin d'import

createRoot(document.getElementById("root")!).render(<App />);