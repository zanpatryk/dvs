import { StatsData, TicketsData } from "@/dummy/data";
import { StatsCard } from "@/routes/_authenticated/_dashboard/dashboard/polls";
import { columns } from "@/tickets/columns";
import { DataTable } from "@/tickets/data-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/tickets"
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex-1 p-6 bg-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{StatsData.map((stat) => (
					<StatsCard
						key={stat.title}
						title={stat.title}
						value={stat.value}
						icon={stat.icon && <stat.icon className="h-6 w-6" />}
					/>
				))}
			</div>
			<div className="py-10 bg-white rounded-md shadow-sm">
				<DataTable columns={columns} data={TicketsData} />
			</div>
		</div>
	);
}
