import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DayNightPortfolio from "./DayNightPortfolio";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DayNightPortfolio />
  </StrictMode>,
);
