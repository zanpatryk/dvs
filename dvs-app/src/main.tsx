import { StrictMode } from "react";
import "./routes/css/index.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<RouterProvider router={router} />
			</ThemeProvider>
		</StrictMode>,
	)
}
