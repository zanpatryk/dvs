import {
	Car,
	FilePenLine,
	LogOut,
	Package,
	ShieldCheck,
	User,
} from "lucide-react";

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

// Menu items.
const items = [
	{
		title: "Users",
		url: "/users",
		icon: User,
	},
	{
		title: "Models",
		url: "/models",
		icon: Package,
	},
	{
		title: "Cars",
		url: "/cars",
		icon: Car,
	},
	{
		title: "Rentals",
		url: "/rentals",
		icon: FilePenLine,
	},
	{
		title: "Administrators",
		url: "/administrators",
		icon: ShieldCheck,
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
										className="hover:bg-app-secondary hover:text-white font-medium text-lg [&>svg]:size-6"
									>
										<a href={item.url}>
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
								<SidebarMenuButton
									className="hover:bg-secondary hover:text-white font-medium text-lg [&>svg]:size-6"
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