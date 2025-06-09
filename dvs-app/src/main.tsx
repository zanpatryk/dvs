import { StrictMode } from "react";
import "@/index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { ContractProvider } from "./hooks/use-contract";

const queryClient = new QueryClient();

const router = createRouter({ routeTree, context: { queryClient } });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// const config = createConfig({
// 	chains: [sepolia],
// 	connectors: [metaMask()],
// 	transports: {
// 		[sepolia.id]: http(),
// 	},
// });

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ContractProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ContractProvider>
		</StrictMode>
	);
}
