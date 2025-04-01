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
import { Clipboard, LogOut, Ticket, TriangleAlert } from "lucide-react";

// Menu items.
const urlBase = "/user-dashboard";

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

export function NavbarSidebar() {
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
										<a href={urlBase + item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
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
								<SidebarMenuButton className="hover:bg-blue-600 hover:text-white text-lg font-medium [&>svg]:size-5">
									<TriangleAlert /> Report an issue
								</SidebarMenuButton>
								<SidebarMenuButton className="hover:bg-blue-600 hover:text-white text-lg font-medium [&>svg]:size-5">
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
