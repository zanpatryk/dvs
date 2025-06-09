import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_index")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="relative overflow-hidden h-svh">
				<Navbar />
				<Outlet />
			</div>
		</ThemeProvider>
	);
}
