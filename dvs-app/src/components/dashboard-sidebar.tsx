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
import { Link } from "@tanstack/react-router";
import { Clipboard, LogOut, Ticket, TriangleAlert } from "lucide-react";
import { useDisconnect } from "wagmi";

// Menu items.
const urlBase = "/dashboard";

const items = [
	{
		title: "Tickets",
		url: "/tickets",
		icon: Ticket,
	},
	{
		title: "Polls",
		url: "/polls",
		icon: Clipboard,
	},
];

export function DashboardSidebar() {
	const { disconnect } = useDisconnect();

	return (
		<Sidebar>
			<SidebarHeader>
				<img src="/public/dvs.svg" alt="DVS Logo" />
				<h1 className="text-2xl text-app-primary font-medium text-center">{`Hello, USER!`}</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
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
									onClick={() => disconnect()}
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
