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
import { Clipboard, LogOut, Ticket, TriangleAlert, User } from "lucide-react";

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
		title: "Tickets",
		url: "/tickets",
		icon: Ticket,
		tag: "user, manager"
	},
	{
		title: "Polls",
		url: "/polls",
		icon: Clipboard,
		tag: "user, manager"
	},
];

export function DashboardSidebar({ role }: {role: UserRole}) {
	const { logout } = useMetaMask();

	return (
		<Sidebar>
			<SidebarHeader>
				<img src="/dvs.svg" alt="DVS Logo" />
				<h1 className="text-2xl text-app-primary font-medium text-center">{`Hello, ${role.toUpperCase()}!`}</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.filter((item) => 
								item.tag?.includes(role))
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
