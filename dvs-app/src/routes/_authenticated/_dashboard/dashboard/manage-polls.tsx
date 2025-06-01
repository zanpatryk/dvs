import CreatePoll from "@/components/poll/create";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createdPollsQueryOptions } from "@/lib/api";
import { columns } from "@/manage-polls-table/columns";
import { DataTable } from "@/manage-polls-table/data-table";
import { DashboardHeaderAction } from "@/routes/_authenticated/_dashboard";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlus, Inbox } from "lucide-react";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/manage-polls"
)({
	beforeLoad: () => {
		const headerAction: DashboardHeaderAction = {
			label: "Create Poll",
			icon: <CirclePlus className="mr-2 h-4 w-4" />,
			dialog: <CreatePoll />,
		};

		return { headerAction };
	},
	component: RouteComponent,
});

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="rounded-full bg-gray-200 p-6 mb-4">
				<Inbox className="h-8 w-8 text-gray-400" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				No Polls Created
			</h3>
			<p className="text-sm text-gray-500 max-w-sm">
				You haven't created any polls yet. Create your first poll to get
				started!
			</p>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>
			<div className="border rounded-lg">
				<div className="p-4 border-b bg-gray-50">
					<div className="flex gap-4">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="p-4 border-b last:border-b-0">
						<div className="flex gap-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-28" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function RouteComponent() {
	const { isPending, error, data } = useQuery(createdPollsQueryOptions);
	const createdPolls = data || [];

	return (
		<div className="h-full flex flex-col">
			{/* Header Section */}
			<div className="mb-6 flex-shrink-0">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Manage Polls
				</h1>
				<p className="text-gray-600">
					View and manage all the polls you've created
				</p>
			</div>

			{/* Content */}
			<div className="flex-initial min-h-0">
				<Card className="h-full">
					<CardContent className="h-full flex flex-col">
						{isPending ? (
							<LoadingSkeleton />
						) : error !== null &&
						  !error.message.includes("No polls found") ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="text-red-600 mb-4">
									Error loading polls
								</div>
								<p className="text-sm text-gray-600">
									Failed to load polls. Please try again.
								</p>
							</div>
						) : createdPolls.length === 0 ? (
							<EmptyState />
						) : (
							<div className="flex-1 overflow-hidden px-2">
								<DataTable
									columns={columns}
									data={createdPolls}
								/>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
