import { createFileRoute } from "@tanstack/react-router";
import { CirclePlus, Inbox } from "lucide-react";
import JoinPoll from "@/components/poll/join";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { pollsQueryOptions } from "@/lib/api";
import { DashboardHeaderAction } from "@/routes/_authenticated/_dashboard";
import { PollCard } from "@/components/dashboard/poll-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/polls"
)({
	beforeLoad: () => {
		const headerAction: DashboardHeaderAction = {
			label: "Join Poll",
			icon: <CirclePlus className="mr-2 h-4 w-4" />,
			dialog: <JoinPoll />,
		};

		return { headerAction };
	},
	component: RouteComponent,
});

function EmptyState({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="rounded-full bg-gray-200 p-6 mb-4">
				<Inbox className="h-8 w-8 text-gray-400" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				{title}
			</h3>
			<p className="text-sm text-gray-500 max-w-sm">{description}</p>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<Card key={i}>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="space-y-2 flex-1">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-4 w-full" />
							</div>
							<Skeleton className="h-6 w-16 ml-2" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex gap-4">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-32" />
							</div>
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function RouteComponent() {
	const { isPending, error, data } = useQuery(pollsQueryOptions);

	const activePolls =
		data?.filter((poll) => {
			const endTime = poll.endTime ? new Date(poll.endTime) : null;
			return (!endTime || endTime.getTime() > Date.now()) && !poll.hasEndedPrematurely;
		}) || [];

	const completedPolls =
		data?.filter((poll) => {
			const endTime = poll.endTime ? new Date(poll.endTime) : null;
			return (endTime && endTime.getTime() <= Date.now()) || poll.hasEndedPrematurely;
		}) || [];

	return (
		<div className="h-full flex flex-col">
			{/* Header Section */}
			<div className="mb-6 flex-shrink-0">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Polls</h1>
				<p className="text-gray-600">
					Participate in active polls and view completed ones
				</p>
			</div>

			{/* Content Grid */}
			<div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-0">
				{/* Active Polls */}
				<div className="flex flex-col min-h-0">
					<div className="flex items-center justify-between mb-4 flex-shrink-0">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							Active Polls
						</h2>
						<Badge
							variant="outline"
							className="text-green-700 border-green-200"
						>
							{activePolls.length} active
						</Badge>
					</div>

					<div className="flex-1 overflow-y-auto space-y-4 pr-2">
						{isPending ? (
							<LoadingSkeleton />
						) : error !== null &&
						  !error.message.includes("No polls found") ? (
							<div className="text-center py-8 text-red-600">
								Failed to load polls. Please try again.
							</div>
						) : activePolls.length === 0 ? (
							<EmptyState
								title="No Active Polls"
								description="There are currently no active polls. Join a poll to get started!"
							/>
						) : (
							activePolls.map((poll) => (
								<PollCard
									key={poll.id}
									id={poll.id}
									title={poll.title}
									description={poll.description}
									endDate={
										poll.endTime
											? new Date(poll.endTime)
											: undefined
									}
									isActive={true}
								/>
							))
						)}
					</div>
				</div>

				{/* Completed Polls */}
				<div className="flex flex-col min-h-0">
					<div className="flex items-center justify-between mb-4 flex-shrink-0">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
							Completed Polls
						</h2>
						<Badge
							variant="outline"
							className="text-gray-700 border-gray-200"
						>
							{completedPolls.length} completed
						</Badge>
					</div>

					<div className="flex-1 overflow-y-auto space-y-4 pr-2">
						{isPending ? (
							<LoadingSkeleton />
						) : error !== null &&
						  !error.message.includes("No polls found") ? (
							<div className="text-center py-8 text-red-600">
								Failed to load polls. Please try again.
							</div>
						) : completedPolls.length === 0 ? (
							<EmptyState
								title="No Completed Polls"
								description="Completed polls will appear here once they finish."
							/>
						) : (
							completedPolls.map((poll) => (
								<PollCard
									key={poll.id}
									id={poll.id}
									title={poll.title}
									description={poll.description}
									endDate={
										poll.endTime
											? new Date(poll.endTime)
											: undefined
									}
									isActive={false}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
