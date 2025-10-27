import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/_globals.scss"; // Import the new SCSS file
import "./styles/vanilla-dialog.scss"; // Import the new SCSS file for vanilla tabs
import "./styles/_dialog-tabs.scss"; // Import the new SCSS file for vanilla tabs

createRoot(document.getElementById("root")!).render(<App />);