import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatsData, TicketsData } from "@/dummy/data";
import { StatsCard } from "@/routes/dashboard/polls";
import { columns } from "@/tickets/columns";
import { DataTable } from "@/tickets/data-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/tickets")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
				<div className="flex items-center gap-2">
					<SidebarTrigger />
					<h1 className="text-3xl font-bold">Tickets</h1>
				</div>
			</header>
			<div className="flex-1 p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{StatsData.map((stat) => (
						<StatsCard
							key={stat.title}
							title={stat.title}
							value={stat.value}
							icon={
								stat.icon && <stat.icon className="h-6 w-6" />
							}
						/>
					))}
				</div>
				<div className=" py-10">
					<DataTable columns={columns} data={TicketsData} />
				</div>
			</div>
		</>
	);
}
