import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	DialogClose,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	usePollResults,
	useRetrieveResultsContractMutation,
	type PollResults,
} from "@/hooks/use-contract-query";
import { pollDetailsQueryOptions } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
	BarChart3,
	Loader2,
	PieChart as PieChartIcon,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import { Pie, PieChart } from "recharts";

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-24" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="space-y-2">
								<div className="flex justify-between">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-16" />
								</div>
							</div>
						))}
					</div>
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
			</div>
			<Skeleton className="h-10 w-20" />
		</div>
	);
}

function ErrorState({ error }: { error: Error }) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="text-red-600 mb-4">Error loading poll results</div>
			<p className="text-sm text-gray-600">{error.message}</p>
		</div>
	);
}

interface ResultsDisplayProps {
	poll: any;
	pollResults: PollResults;
}

function ResultsDisplay({ poll, pollResults }: ResultsDisplayProps) {
	// Map the contract results to poll options for display
	const resultsWithOptions = pollResults.options.map((result) => {
		const pollOption = poll.options[result.optionIndex];
		return {
			id: pollOption?.id || result.optionIndex,
			value: pollOption?.value || `Option ${result.optionIndex + 1}`,
			votes: result.votes,
			percentage: result.percentage,
		};
	});

	const winningOption = resultsWithOptions.reduce((prev, current) =>
		prev.votes > current.votes ? prev : current
	);

	// Prepare chart data
	const chartData = resultsWithOptions.map((option, index) => ({
		option: option.value,
		votes: option.votes,
		percentage: option.percentage,
		fill: `var(--chart-${index + 1})`,
	}));

	// Chart configuration
	const chartConfig: ChartConfig = {
		votes: {
			label: "Votes",
		},
		...resultsWithOptions.reduce(
			(acc, option, index) => {
				const key = option.value.toLowerCase().replace(/\s+/g, "");
				acc[key] = {
					label: option.value,
					color: `var(--chart-${index + 1})`,
				};
				return acc;
			},
			{} as Record<string, { label: string; color: string }>
		),
	};

	return (
		<>
			{/* Results Summary */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-gray-600" />
						<span className="text-sm font-medium text-gray-700">
							Total Votes: {pollResults.totalVotes}
						</span>
					</div>
					<Badge className="bg-green-100 text-green-800">
						Poll Completed
					</Badge>
				</div>
			</div>

			{/* Poll Results with Chart */}
			<div className="space-y-3">
				<Label className="text-base font-medium flex items-center gap-2">
					<BarChart3 className="h-4 w-4" />
					Poll Results
				</Label>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Results List */}
					<div className="space-y-4">
						{resultsWithOptions.map((option) => {
							const isWinner = option.id === winningOption.id;
							return (
								<div
									key={option.id}
									className={cn(
										"rounded-md border px-4 py-3 transition-colors",
										isWinner
											? "border-green-200 bg-green-50"
											: "border-gray-200 bg-gray-50"
									)}
								>
									<div className="flex items-center justify-between">
										<span
											className={cn(
												"font-medium",
												isWinner
													? "text-green-700"
													: "text-gray-700"
											)}
										>
											{option.value}
											{isWinner && (
												<Badge className="ml-2 bg-green-100 text-green-800">
													Winner
												</Badge>
											)}
										</span>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<span>{option.votes} votes</span>
											<span>({option.percentage}%)</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Pie Chart */}
					<Card className="flex flex-col">
						<CardHeader className="items-center pb-0">
							<CardTitle className="flex items-center gap-2">
								<PieChartIcon className="h-4 w-4" />
								Vote Distribution
							</CardTitle>
						</CardHeader>
						<CardContent className="flex-1 pb-0">
							<ChartContainer
								config={chartConfig}
								className="mx-auto aspect-square max-h-[250px]"
							>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={
											<ChartTooltipContent hideLabel />
										}
									/>
									<Pie
										data={chartData}
										dataKey="votes"
										nameKey="option"
									/>
								</PieChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-center gap-2 text-blue-800">
					<TrendingUp className="h-4 w-4" />
					<span className="text-sm font-medium">
						Results retrieved successfully from your participation
						NFT.
					</span>
				</div>
			</div>
		</>
	);
}

interface RetrieveResultsProps {
	poll: any;
	onRetrieveResults: () => void;
	isLoading: boolean;
}

function RetrieveResults({
	poll,
	onRetrieveResults,
	isLoading,
}: RetrieveResultsProps) {
	return (
		<>
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
				<div className="flex flex-col items-center gap-4">
					<div className="rounded-full bg-blue-100 p-3">
						<Upload className="h-8 w-8 text-blue-600" />
					</div>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold text-blue-900">
							Results Available
						</h3>
						<p className="text-sm text-blue-700 max-w-md">
							To view the poll results, you need to retrieve them
							using your participation NFT. This ensures secure
							and verifiable access to the results.
						</p>
					</div>
					<Button
						className="bg-blue-600 hover:bg-blue-700"
						onClick={onRetrieveResults}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Retrieving...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Retrieve Results with NFT
							</>
						)}
					</Button>
				</div>
			</div>

			<DialogClose asChild>
				<Button variant="outline">Close</Button>
			</DialogClose>
		</>
	);
}

const ViewResults = ({ pollId }: { pollId: string }) => {
	const {
		isPending: pollLoading,
		error: pollError,
		data: poll,
	} = useQuery(pollDetailsQueryOptions(pollId));

	const retrieveResultsMutation = useRetrieveResultsContractMutation();
	const { data: pollResults } = usePollResults(pollId);

	if (pollError) {
		return <ErrorState error={pollError} />;
	}

	if (pollLoading) {
		return <LoadingSkeleton />;
	}

	const handleRetrieveResults = () => {
		retrieveResultsMutation.mutate(BigInt(pollId));
	};

	return (
		<div className="space-y-6">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">
					{poll.title}
				</DialogTitle>
				<DialogDescription>{poll.description}</DialogDescription>
			</DialogHeader>

			{pollResults ? (
				<ResultsDisplay poll={poll} pollResults={pollResults} />
			) : (
				<RetrieveResults
					poll={poll}
					onRetrieveResults={handleRetrieveResults}
					isLoading={retrieveResultsMutation.isPending}
				/>
			)}

			{pollResults && (
				<DialogClose asChild>
					<Button className="bg-green-500 hover:bg-green-600">
						<BarChart3 className="mr-2 h-4 w-4" />
						Close
					</Button>
				</DialogClose>
			)}
		</div>
	);
};

export default ViewResults;
