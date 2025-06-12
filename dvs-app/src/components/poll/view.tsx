import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { pollDetailsQueryOptions } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, CircleIcon, FileLock } from "lucide-react";

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-3/4" /> {/* Title */}
				<Skeleton className="h-4 w-full" /> {/* Description line 1 */}
				<Skeleton className="h-4 w-2/3" /> {/* Description line 2 */}
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-20" /> {/* "Your Vote" label */}
				<div className="space-y-3">
					{/* Mock radio options */}
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4 rounded-full" />
							<Skeleton className="h-4 w-32" />
						</div>
					))}
				</div>
			</div>
			<Skeleton className="h-10 w-20" /> {/* Close button */}
		</div>
	);
}

function ErrorState({ error }: { error: Error }) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="text-red-600 mb-4">Error loading poll</div>
			<p className="text-sm text-gray-600">{error.message}</p>
		</div>
	);
}

const ViewPoll = ({ pollId }: { pollId: string }) => {
	const {
		isPending: pollLoading,
		error: pollError,
		data: poll,
	} = useQuery(pollDetailsQueryOptions(pollId));

	// TODO: Add a function to get the user's actual vote choice
	const userVotedOption = "1";

	if (pollError) {
		return <ErrorState error={pollError} />;
	}

	if (pollLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="space-y-6">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">
					{poll.title}
				</DialogTitle>
				<DialogDescription>{poll.description}</DialogDescription>
			</DialogHeader>

			<div className="space-y-3">
				<Label className="text-base font-medium">Your Vote</Label>
				<RadioGroup value={userVotedOption} className="space-y-2">
					{poll.options.map((option) => {
						const isSelected =
							option.id.toString() === userVotedOption;
						return (
							<Label
								key={option.id}
								htmlFor={option.id.toString()}
								className={cn(
									"flex items-center rounded-md border px-4 py-3 transition-colors cursor-pointer",
									isSelected
										? "border-green-200 bg-green-50"
										: "border-gray-200 bg-gray-50"
								)}
							>
								<RadioGroupItem
									value={option.id.toString()}
									id={option.id.toString()}
									disabled
									className={cn(
										isSelected &&
											"text-green-600 border-green-600"
									)}
									dot={
										<CircleIcon
											className={cn(
												"absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
												isSelected
													? "fill-green-600"
													: "fill-gray-400"
											)}
										/>
									}
								/>
								<span
									className={cn(
										"ml-3 font-medium flex-1",
										isSelected
											? "text-green-700"
											: "text-gray-700"
									)}
								>
									{option.value}
									{isSelected && (
										<Badge className="ml-2 flex-shrink-0 bg-green-100 text-green-800">
											Your choice
										</Badge>
									)}
								</span>
							</Label>
						);
					})}
				</RadioGroup>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-center gap-2 text-blue-800">
					<FileLock className="h-4 w-4" />
					<span className="text-sm font-medium">
						Your vote has been recorded and cannot be changed.
					</span>
				</div>
			</div>

			<DialogClose asChild>
				<Button className="bg-green-500 hover:bg-green-600">
					<CheckCircle className="mr-2 h-4 w-4" />
					Close
				</Button>
			</DialogClose>
		</div>
	);
};

export default ViewPoll;
