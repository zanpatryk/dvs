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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTicketMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(50, { message: "Title must be at most 50 characters" }),
	description: z
		.string()
		.min(3, { message: "Description must be at least 3 characters" })
		.max(250, {
			message: "Description must be at most 250 characters",
		}),
});

const CreateTicket = () => {
	const mutation = useCreateTicketMutation();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
		},
		mode: "onChange",
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		mutation.mutate({ ...data });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Create Ticket
					</DialogTitle>
					<DialogDescription>
						Please fill out the form below to create a ticket.
					</DialogDescription>
				</DialogHeader>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Issue joining poll..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Issue Description</FormLabel>
							<FormDescription>
								Please describe the issue you are facing in
								detail.
							</FormDescription>
							<FormControl>
								<Textarea
									placeholder="I can't join a poll..."
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
							<Plus />
							Create
						</Button>
					</DialogClose>
				) : (
					<Button
						className="bg-green-500 hover:bg-green-600"
						disabled
					>
						<Plus />
						Create
					</Button>
				)}
			</form>
		</Form>
	);
};
export default CreateTicket;
