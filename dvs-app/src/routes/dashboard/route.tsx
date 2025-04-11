import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex h-svh bg-slate-50">
				<SidebarProvider>
					<DashboardSidebar />
					<SidebarInset>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ThemeProvider>
	);
}
