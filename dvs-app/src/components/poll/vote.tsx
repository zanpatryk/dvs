import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	DialogClose,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CircleCheckBig } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { pollQueryOptions } from "@/lib/api";

const FormSchema = z.object({
	type: z.enum(["1", "2", "3"], {
		required_error: "You need to select an option.",
	}),
});

const VotePoll = ({ pollId }: { pollId: string }) => {
	// const poll = PollsData.find((poll) => poll.id === pollId);
	const { isPending, error, data } = useQuery(pollQueryOptions(pollId));

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(JSON.stringify(data, null, 2));
	}

	if (error) {
		return <div>Poll not found</div>;
	}

	if (isPending) {
		return <Skeleton className="h-4" />;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						{data.poll.title}
					</DialogTitle>
					<DialogDescription>
						{data.poll.description}
					</DialogDescription>
				</DialogHeader>
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Options</FormLabel>
							<FormDescription>Choose an option</FormDescription>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex flex-col space-y-1"
								>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="1" />
										</FormControl>
										<FormLabel className="font-normal">
											Option #1
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="2" />
										</FormControl>
										<FormLabel className="font-normal">
											Option #2
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="3" />
										</FormControl>
										<FormLabel className="font-normal">
											Option #3
										</FormLabel>
									</FormItem>
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
								<CircleCheckBig />
								Vote
							</Button>
						</DialogClose>
					</div>
				) : (
					<Button
						className="bg-green-500 hover:bg-green-600"
						disabled
					>
						<CircleCheckBig />
						Vote
					</Button>
				)}
			</form>
		</Form>
	);
};
export default VotePoll;
