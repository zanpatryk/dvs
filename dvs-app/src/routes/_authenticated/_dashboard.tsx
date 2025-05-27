import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

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
	"0x74075427b61ee3138e08ff4d820118600d2a3fe4": UserRole.Manager // 7blak | Account 3
};

function getRoleForWallet(address?: string): UserRole {
	// TODO: Replace this with actual role-fetching logic (e.g., contract call or API)
	if (!address) return UserRole.User; // Default/fallback
	return WALLET_ROLE_MAP[address] ?? UserRole.User;
}

export const Route = createFileRoute("/_authenticated/_dashboard")({
	component: RouteComponent,
	notFoundComponent: () => {},
});

function RouteComponent() {
	const address = useAuth().data?.address ?? undefined;
	const userRole = getRoleForWallet(address);
	console.log(`${address} has role: ${userRole}`);
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex h-svh bg-slate-50">
				<SidebarProvider>
					<DashboardSidebar role = {userRole} />
					<SidebarInset>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ThemeProvider>
	);
}
