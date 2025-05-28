import CreateTicket from "@/components/ticket/create";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMetaMask } from "@/hooks/use-meta-mask";
import { UserRole } from "@/routes/_authenticated/_dashboard";
import { Link } from "@tanstack/react-router";
import {
	Clipboard,
	ClipboardList,
	LogOut,
	ShieldUser,
	Ticket,
	TriangleAlert,
	User,
	UserCog,
} from "lucide-react";

// Menu items.
const urlBase = "/dashboard";

const items = [
	{
		title: "Manage Tickets",
		url: "/tickets",
		icon: Ticket,
		tag: "admin",
	},
	{
		title: "Manage Users",
		url: "/users",
		icon: User,
		tag: "admin",
	},
	{
		title: "Manage Polls",
		url: "/manage-polls",
		icon: ClipboardList,
		tag: "manager",
	},
	{
		title: "Tickets",
		url: "/tickets",
		icon: Ticket,
		tag: "user, manager",
	},
	{
		title: "Polls",
		url: "/polls",
		icon: Clipboard,
		tag: "user, manager",
	},
];
// Role configurations
const roleConfig = {
	[UserRole.Admin]: {
		icon: ShieldUser,
		title: "Administrator",
		gradient: "bg-linear-65 from-pink-500 via-red-500 to-orange-500",
		description: "Full system access",
	},
	[UserRole.Manager]: {
		icon: UserCog,
		title: "Manager",
		gradient: "bg-linear-to-r from-yellow-500 via-lime-500 to-green-500",
		description: "Poll management access",
	},
	[UserRole.User]: {
		icon: User,
		title: "User",
		gradient: "bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500",
		description: "Standard user access",
	},
};

export function DashboardSidebar({ role }: { role: UserRole }) {
	const { logout } = useMetaMask();
	const config = roleConfig[role];
	const RoleIcon = config.icon;

	return (
		<Sidebar>
			<SidebarHeader className="p-6">
				<div className="flex flex-col items-center space-y-4">
					{/* Logo */}
					<img src="/dvs.svg" alt="DVS Logo" />

					{/* Role Header */}
					<div
						className={`w-full p-4 rounded-xl bg-gradient-to-r ${config.gradient} text-white shadow-lg`}
					>
						<div className="flex items-center justify-center space-x-2 mb-2">
							<RoleIcon className="w-5 h-5" />
							<h2 className="text-lg font-semibold">
								{config.title}
							</h2>
						</div>
						<p className="text-center text-sm opacity-90">
							{config.description}
						</p>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items
								.filter((item) => item.tag?.includes(role))
								.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className="hover:bg-blue-600 hover:text-white text-lg font-medium [&>svg]:size-5"
										>
											<Link to={urlBase + item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<Dialog>
									<DialogTrigger asChild>
										<SidebarMenuButton className="hover:bg-blue-600 hover:text-white text-lg font-medium [&>svg]:size-5">
											<TriangleAlert /> Report an issue
										</SidebarMenuButton>
									</DialogTrigger>
									<DialogContent>
										<CreateTicket />
									</DialogContent>
								</Dialog>
								<SidebarMenuButton
									className="hover:bg-blue-600 hover:text-white text-lg font-medium [&>svg]:size-5"
									onClick={() => logout()}
								>
									<LogOut /> Log out
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
