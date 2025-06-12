import JoinPoll from "@/components/poll/join";
import { PollCard } from "@/components/poll/poll-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMultipleUserVoteStatus } from "@/hooks/use-contract-query";
import { pollsQueryOptions } from "@/lib/api";
import { DashboardHeaderAction } from "@/routes/_authenticated/_dashboard/route";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlus, Inbox } from "lucide-react";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/_not-for-admin/polls"
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
	const { address } = Route.useRouteContext();

	// Get poll IDs for vote status check
	const pollIds = data?.map((poll) => BigInt(poll.id)) || [];
	const voteStatuses = useMultipleUserVoteStatus(pollIds, address || "");

	// Helper function to get vote status for a poll
	const getUserVoteStatus = (pollId: string) => {
		const pollIndex = pollIds.findIndex((id) => id.toString() === pollId);
		if (pollIndex === -1) return { data: false, isLoading: true };

		const statusQuery = voteStatuses[pollIndex];
		return {
			data: statusQuery?.data || false,
			isLoading: statusQuery?.isLoading || false,
		};
	};

	// Helper function to check if poll is actually active (time-wise)
	const isPollTimeActive = (poll: NonNullable<typeof data>[0]) => {
		const endTime = poll.endTime ? new Date(poll.endTime) : null;
		return (
			(!endTime || endTime.getTime() > Date.now()) &&
			!poll.hasEndedPrematurely
		);
	};

	const activePolls =
		data?.filter((poll) => {
			const voteStatus = getUserVoteStatus(poll.id);
			const isTimeActive = isPollTimeActive(poll);
			const hasNotVoted = !voteStatus.data;

			// Poll is active if:
			// 1. It hasn't ended by time AND hasn't ended prematurely
			// 2. AND user hasn't voted yet
			return isTimeActive && hasNotVoted;
		}) || [];

	const completedPolls =
		data?.filter((poll) => {
			const voteStatus = getUserVoteStatus(poll.id);
			const isTimeActive = isPollTimeActive(poll);
			const hasVoted = voteStatus.data;

			// Poll is completed if:
			// 1. It has ended by time OR ended prematurely
			// 2. OR user has already voted
			return !isTimeActive || hasVoted;
		}) || [];

	// Check if any vote status is still loading
	const isVoteStatusLoading = voteStatuses.some((status) => status.isLoading);

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
					<div className="mb-4 flex-shrink-0">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							Active Polls
						</h2>
					</div>

					<div className="flex-1 overflow-y-auto space-y-4 pr-2">
						{isPending || isVoteStatusLoading ? (
							<LoadingSkeleton />
						) : error !== null &&
						  !error.message.includes("No polls found") ? (
							<div className="text-center py-8 text-red-600">
								Failed to load polls. Please try again.
							</div>
						) : activePolls.length === 0 ? (
							<EmptyState
								title="No Active Polls"
								description="There are currently no active polls you can vote on. Join a poll to get started!"
							/>
						) : (
							activePolls.map((poll) => {
								const voteStatus = getUserVoteStatus(poll.id);
								const isTimeActive = isPollTimeActive(poll);

								return (
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
										isActive={isTimeActive}
										hasVoted={voteStatus.data}
									/>
								);
							})
						)}
					</div>
				</div>

				{/* Completed Polls */}
				<div className="flex flex-col min-h-0">
					<div className="mb-4 flex-shrink-0">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
							Completed Polls
						</h2>
					</div>

					<div className="flex-1 overflow-y-auto space-y-4 pr-2">
						{isPending || isVoteStatusLoading ? (
							<LoadingSkeleton />
						) : error !== null &&
						  !error.message.includes("No polls found") ? (
							<div className="text-center py-8 text-red-600">
								Failed to load polls. Please try again.
							</div>
						) : completedPolls.length === 0 ? (
							<EmptyState
								title="No Completed Polls"
								description="Completed polls and polls you've voted on will appear here."
							/>
						) : (
							completedPolls.map((poll) => {
								const voteStatus = getUserVoteStatus(poll.id);
								const isTimeActive = isPollTimeActive(poll);

								return (
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
										isActive={isTimeActive}
										hasVoted={voteStatus.data}
									/>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default RouteComponent;
