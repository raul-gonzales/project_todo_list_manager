import "./css/styles.css";
// import "./ui/theme.js"; // this is just for testing the color randomizer on refresh
import { renderProjects } from "./ui/renderApp.js";

try {
  renderProjects();
} catch (error) {
  console.error("Error rendering app:", error);
}
