import { StrictMode } from "react";
import "./routes/css/index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// MetaMask
const config = createConfig({
	chains: [sepolia],
	connectors: [metaMask()],
	transports: {
		[sepolia.id]: http(),
	},
});

const client = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<WagmiProvider config={config}>
				<QueryClientProvider client={client}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</WagmiProvider>
		</StrictMode>
	);
}
