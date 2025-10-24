import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./styles/vanilla-dialog.scss"; // Import the new SCSS file

createRoot(document.getElementById("root")!).render(<App />);