import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// CSS Import
import "./css/tailwind.css";
import "./css/main.css";

// Components Import
import App from "./App.jsx";

createRoot(document.querySelector("#root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
