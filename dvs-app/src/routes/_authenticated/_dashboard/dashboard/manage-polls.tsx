import JoinPoll from "@/components/poll/join";
import { createdPollsQueryOptions } from "@/lib/api";
import { columns } from "@/polls/columns";
import { DataTable } from "@/polls/data-table";
import { DashboardHeaderAction } from "@/routes/_authenticated/_dashboard";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlus } from "lucide-react";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/manage-polls"
)({
	beforeLoad: () => {
		const headerAction: DashboardHeaderAction = {
			label: "Create Poll",
			icon: <CirclePlus className="mr-2 h-4 w-4" />,
			dialog: <JoinPoll />,
		};

		return { headerAction };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { error, data } = useQuery(createdPollsQueryOptions);

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="flex-1 p-6 bg-gray-100">
			<div className="py-10 bg-white rounded-md shadow-sm">
				<DataTable columns={columns} data={data || []} />
			</div>
		</div>
	);
}
