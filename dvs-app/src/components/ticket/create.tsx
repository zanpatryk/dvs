import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	description: z
		.string()
		.min(2, {
			message: "Description must be at least 2 characters.",
		})
		.max(250, {
			message: "Description must be at most 250 characters.",
		}),
});

const CreateTicket = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			description: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(JSON.stringify(data, null, 2));
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-2xl font-bold">
								Issue Description
							</FormLabel>
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
					<DialogClose>
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
