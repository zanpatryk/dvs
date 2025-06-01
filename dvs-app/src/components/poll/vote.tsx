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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { pollDetailsQueryOptions, useVotePollMutation } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Vote } from "lucide-react";

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-3/4" /> {/* Title */}
				<Skeleton className="h-4 w-full" /> {/* Description line 1 */}
				<Skeleton className="h-4 w-2/3" /> {/* Description line 2 */}
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-16" /> {/* "Options" label */}
				<div className="space-y-3">
					{/* Mock radio options */}
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4 rounded-full" />{" "}
							{/* Radio button */}
							<Skeleton className="h-4 w-32" />{" "}
							{/* Option text */}
						</div>
					))}
				</div>
			</div>
			<Skeleton className="h-10 w-20" /> {/* Vote button */}
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

	const mutation = useVotePollMutation();

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
		mutation.mutate({
			pollId: pollId,
			vote: data.option.toString(),})
	}

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
							<FormLabel>Options</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value.toString()}
									className="flex flex-col"
								>
									{poll.options.map((option) => (
										<FormItem
											key={option.id}
											className="flex items-center gap-3"
										>
											<FormControl>
												<RadioGroupItem
													value={option.id.toString()}
												/>
											</FormControl>
											<FormLabel className="font-normal">
												{option.value}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{form.formState.isValid ? (
					<div>
						<DialogClose asChild>
							<Button
								type="submit"
								className="bg-green-500 hover:bg-green-600"
							>
								<Vote />
								Vote
							</Button>
						</DialogClose>
					</div>
				) : (
					<Button
						className="bg-green-500 hover:bg-green-600"
						disabled
					>
						<Vote />
						Vote
					</Button>
				)}
			</form>
		</Form>
	);
};
export default VotePoll;
