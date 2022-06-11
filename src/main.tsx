import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// non-null-assertion reason: index always has a root container
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
