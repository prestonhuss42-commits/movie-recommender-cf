import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const bootMessage = document.getElementById("boot-message");
if (bootMessage) {
  bootMessage.style.display = "none";
}
