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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ticketDetailsQueryOptions, useResolveTicketMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	response: z
		.string()
		.min(3, { message: "Response must be at least 10 characters" })
		.max(1000, {
			message: "Response must be at most 1000 characters",
		}),
});

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<DialogTitle />
			<DialogDescription />
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" /> {/* Title */}
				<Skeleton className="h-6 w-20" /> {/* Ticket ID */}
				<Skeleton className="h-4 w-3/4" /> {/* Description */}
			</div>
			<div className="space-y-2">
				<Skeleton className="h-5 w-20" /> {/* Response label */}
				<Skeleton className="h-32 w-full" /> {/* Textarea */}
			</div>
			<Skeleton className="h-10 w-24" /> {/* Submit button */}
		</div>
	);
}

function ErrorState({ error }: { error: Error }) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<DialogTitle className="text-red-600 mb-4">
				Error loading ticket
			</DialogTitle>
			<DialogDescription className="text-sm text-gray-600">
				{error.message}
			</DialogDescription>
		</div>
	);
}

const RespondTicket = ({ ticketId }: { ticketId: string }) => {
	const {
		isPending,
		error,
		data: ticket,
	} = useQuery(ticketDetailsQueryOptions(ticketId));

	const mutation = useResolveTicketMutation();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			response: "",
		},
		values: {
			response: ticket?.response || "",
		},
	});

	if (error) {
		return <ErrorState error={error} />;
	}

	if (isPending) {
		return <LoadingSkeleton />;
	}

	function onSubmit(data: z.infer<typeof FormSchema>) {
		mutation.mutate({ ticketId, ...data });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Resolve Ticket
					</DialogTitle>
					<p className="font-mono border rounded-md p-1 w-fit">
						#{ticket.id}
					</p>
					<DialogDescription>
						Please provide a detailed response to the ticket issue.
					</DialogDescription>
				</DialogHeader>
				<FormField
					control={form.control}
					name="response"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Response</FormLabel>
							<FormControl>
								<Textarea
									placeholder="The root of your issue is..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{form.formState.isValid ? (
					<DialogClose asChild>
						<Button
							type="submit"
							className="bg-green-500 hover:bg-green-600"
						>
							<SquarePen />
							Respond
						</Button>
					</DialogClose>
				) : (
					<Button
						className="bg-green-500 hover:bg-green-600"
						disabled
					>
						<SquarePen />
						Respond
					</Button>
				)}
			</form>
		</Form>
	);
};

export default RespondTicket;
