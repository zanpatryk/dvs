import { TicketsData } from "@/dummy/data";
import { columns } from "@/tickets/columns";
import { DataTable } from "@/tickets/data-table";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen } from "lucide-react";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/tickets"
)({
	component: RouteComponent,
});

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="rounded-full bg-gray-200 p-6 mb-4">
				<FolderOpen className="h-8 w-8 text-gray-400" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				No Tickets Found
			</h3>
			<p className="text-sm text-gray-500 max-w-sm">
				You don't have any tickets yet. Tickets will appear here when
				they're created.
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
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="p-4 border-b last:border-b-0">
						<div className="flex gap-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function RouteComponent() {
	// TODO: add loading/error states here
	const isLoading = false;
	const isError = null;
	const data = TicketsData;

	return (
		<div className="h-full flex flex-col">
			{/* Header Section */}
			<div className="mb-6 flex-shrink-0">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Support Tickets
				</h1>
				<p className="text-gray-600">View your support tickets</p>
			</div>

			{/* Content */}
			<div className="flex-initial min-h-0">
				<Card className="h-full">
					<CardContent className="p-6 h-full flex flex-col">
						{isLoading ? (
							<LoadingSkeleton />
						) : isError ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="text-red-600 mb-4">
									Error loading tickets
								</div>
								<p className="text-sm text-gray-600">
									Failed to load support tickets. Please try
									again.
								</p>
							</div>
						) : !data || data.length === 0 ? (
							<EmptyState />
						) : (
							<div className="flex-1 overflow-hidden px-2">
								<DataTable columns={columns} data={data} />
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
