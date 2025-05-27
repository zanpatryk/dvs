import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
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

	const { headerAction } = context;

	const address = useAuth().data?.address ?? undefined;
	const userRole = getRoleForWallet(address);
	console.log(`${address} has role: ${userRole}`);
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex h-svh bg-slate-50">
				<SidebarProvider>
					<DashboardSidebar role={userRole} />
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
