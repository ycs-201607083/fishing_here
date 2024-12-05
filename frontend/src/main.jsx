import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { Provider } from "./components/ui/provider.jsx";
import "./font/font.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider>
    <App />
    <Toaster />
  </Provider>,
  // </StrictMode>,
);
