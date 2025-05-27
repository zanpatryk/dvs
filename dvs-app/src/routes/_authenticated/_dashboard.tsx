import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Unauthorized } from "@/routes/_authenticated";
import {
	createFileRoute,
	Outlet,
	useMatches,
	useRouteContext,
} from "@tanstack/react-router";
import { ReactNode } from "react";

export const Route = createFileRoute("/_authenticated/_dashboard")({
	component: RouteComponent,
	notFoundComponent: Unauthorized,
});

export interface DashboardHeaderAction {
	label: string;
	icon?: ReactNode;
	dialog?: ReactNode; // For dialog content
}

function RouteComponent() {
	const matches = useMatches();
	const currentMatch = matches[matches.length - 1];

	const context = useRouteContext({
		from: currentMatch.routeId,
	});

	const { headerAction } = context;

	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex h-svh bg-slate-50">
				<SidebarProvider>
					<DashboardSidebar />
					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
							<div className="flex items-center gap-2">
								<SidebarTrigger />
								<h1 className="text-3xl font-bold">
									Dashboard
								</h1>
							</div>
							<HeaderActionButton
								action={headerAction as DashboardHeaderAction}
							/>
						</header>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ThemeProvider>
	);
}

function HeaderActionButton({ action }: { action: DashboardHeaderAction }) {
	if (action.dialog) {
		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button className="bg-blue-600 hover:bg-blue-700">
						{action.icon}
						{action.label}
					</Button>
				</DialogTrigger>
				<DialogContent>{action.dialog}</DialogContent>
			</Dialog>
		);
	}

	return (
		<Button
			variant={action.variant || "default"}
			onClick={action.onClick}
			className={
				action.variant === "default"
					? "bg-blue-600 hover:bg-blue-700"
					: undefined
			}
		>
			{action.icon}
			{action.label}
		</Button>
	);
}
