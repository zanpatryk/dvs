import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Forbidden } from "@/components/dashboard/forbidden";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserRole } from "@/hooks/use-contract-query";
import {
	createFileRoute,
	Outlet,
	useMatches,
	useRouteContext,
} from "@tanstack/react-router";
import { ReactNode } from "react";

export const Route = createFileRoute("/_authenticated/_dashboard")({
	component: RouteComponent,
	notFoundComponent: Forbidden,
});

export interface DashboardHeaderAction {
	label: string;
	icon?: ReactNode;
	dialog?: ReactNode; // For dialog content
}

function RouteComponent() {
	const matches = useMatches();
	const currentMatch = matches[matches.length - 1];
	const { role } = Route.useRouteContext();

	const context = useRouteContext({
		from: currentMatch.routeId,
	});

	const headerAction =
		"headerAction" in context ? context.headerAction : undefined;

	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex h-dvh bg-slate-50">
				<SidebarProvider>
					<DashboardSidebar role={role ?? UserRole.User} />
					<SidebarInset className="flex flex-col">
						<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
							<div className="flex items-center gap-2">
								<SidebarTrigger />
								<h1 className="text-3xl font-bold">
									Dashboard
								</h1>
							</div>
							{headerAction && (
								<HeaderActionButton
									action={
										headerAction as DashboardHeaderAction
									}
								/>
							)}
						</header>

						<div className="flex-1 p-6 bg-gray-100 overflow-hidden flex flex-col">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-shrink-0">
								{/* {StatsData.map((stat) => (
									<StatsCard
										key={stat.title}
										title={stat.title}
										value={stat.value}
										icon={
											stat.icon && (
												<stat.icon className="h-6 w-6" />
											)
										}
									/>
								))} */}
							</div>
							<div className="flex-1 min-h-0">
								<Outlet />
							</div>
						</div>
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
				<DialogContent className="min-w-fit">
					{action.dialog}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Button className="bg-blue-600 hover:bg-blue-700">
			{action.icon}
			{action.label}
		</Button>
	);
}
