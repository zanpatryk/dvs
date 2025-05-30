import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard/stats";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { StatsData } from "@/dummy/data";
import { useAuth } from "@/hooks/use-auth";
import { Unauthorized } from "@/routes/_authenticated";
import {
	createFileRoute,
	Outlet,
	useMatches,
	useRouteContext,
} from "@tanstack/react-router";
import { ReactNode } from "react";

export enum UserRole {
	User = "user",
	Manager = "manager",
	Admin = "admin",
}

const WALLET_ROLE_MAP: Record<string, UserRole> = {
	// Convert the wallet addresses to lowercase first!!!
	// "0x123...": UserRole.User,
	// "0x456...": UserRole.Manager,
	// "0x789...": UserRole.Admin,
	"0xe621324665fbb008bef14ffaff85029d5dddc61d": UserRole.Admin, // 7blak | Account 1
	"0x7d5312bfd5006f43b5c920224f1317f1b5ab53cc": UserRole.User, // 7blak | Account 2
	"0x74075427b61ee3138e08ff4d820118600d2a3fe4": UserRole.Manager, // 7blak | Account 3
	"0x30523b4fa092ec6517b725d9a37e0ad3b7b2ea73": UserRole.Manager, // Yourekt | Account 1
};

function getRoleForWallet(address?: string): UserRole {
	// TODO: Replace this with actual role-fetching logic (e.g., contract call or API)
	if (!address) return UserRole.User; // Default/fallback
	return WALLET_ROLE_MAP[address] ?? UserRole.User;
}

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

	const headerAction =
		"headerAction" in context ? context.headerAction : undefined;

	const address = useAuth().data?.address ?? undefined;
	const userRole = getRoleForWallet(address);

	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex h-dvh bg-slate-50">
				<SidebarProvider>
					<DashboardSidebar role={userRole} />
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
								{StatsData.map((stat) => (
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
								))}
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
