import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useCastVoteContractMutation } from "@/hooks/use-contract-query";
import { pollDetailsQueryOptions } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleIcon, Vote } from "lucide-react";

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-16" />
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4 rounded-full" />
							<Skeleton className="h-4 w-32" />
						</div>
					))}
				</div>
			</div>
			<Skeleton className="h-10 w-20" />
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

const FormSchema = z.object({
	option: z.coerce.number(),
});

const VotePoll = ({ pollId }: { pollId: string }) => {
	const {
		isPending,
		error,
		data: poll,
	} = useQuery(pollDetailsQueryOptions(pollId));

	const castVoteMutation = useCastVoteContractMutation();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			option: 0,
		},
	});

	if (error) {
		return <ErrorState error={error} />;
	}

	if (isPending) {
		return <LoadingSkeleton />;
	}

	function onSubmit(data: z.infer<typeof FormSchema>) {
		castVoteMutation.mutate({
			pollId: BigInt(pollId),
			optionIndex: BigInt(data.option),
		});

		if (castVoteMutation.isError) {
			console.error(
				"Failed to cast vote via contract:",
				castVoteMutation.error
			);
			return;
		}
	}

	const selectedValue = form.watch("option");

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						{poll.title}
					</DialogTitle>
					<DialogDescription>{poll.description}</DialogDescription>
				</DialogHeader>

				<FormField
					control={form.control}
					name="option"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel className="text-base font-medium">
								Options
							</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={(value) =>
										field.onChange(Number(value))
									}
									value={field.value.toString()}
									className="space-y-2"
								>
									{poll.options.map((option) => {
										const isSelected =
											selectedValue === option.id;
										return (
											<Label
												key={option.id}
												htmlFor={option.id.toString()}
												className={cn(
													"flex items-center rounded-md border px-4 py-3 transition-colors cursor-pointer",
													isSelected
														? "border-blue-200 bg-blue-50"
														: "border-gray-200 bg-gray-50 hover:bg-gray-100"
												)}
											>
												<RadioGroupItem
													value={option.id.toString()}
													id={option.id.toString()}
													className={cn(
														isSelected &&
															"text-blue-600 border-blue-600"
													)}
													dot={
														<CircleIcon
															className={cn(
																"absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
																isSelected
																	? "fill-blue-600"
																	: "fill-gray-400"
															)}
														/>
													}
												/>
												<span
													className={cn(
														"ml-3 font-medium",
														isSelected
															? "text-blue-600"
															: "text-gray-700"
													)}
												>
													{option.value}
												</span>
											</Label>
										);
									})}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<DialogClose asChild>
						<Button
							type="submit"
							className="bg-green-500 hover:bg-green-600"
							disabled={
								castVoteMutation.isPending ||
								!form.formState.isValid
							}
						>
							<Vote className="mr-2 h-4 w-4" />
							{castVoteMutation.isPending ? "Voting..." : "Vote"}
						</Button>
					</DialogClose>
				</div>
			</form>
		</Form>
	);
};

export default VotePoll;
