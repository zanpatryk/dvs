import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/hono-client";
import { apiCall } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { CalendarIcon, CirclePlus, Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FormSchema = z.object({
	title: z.string().min(1, {
		message: "Title cannot be empty",
	}),
	description: z.string(),
	options: z
		.array(
			z.object({
				value: z.string().min(1, { message: "Option cannot be empty" }),
			})
		)
		.min(1, { message: "At least one option is required" })
		.max(10, { message: "You can add up to 10 options" }),
	endTime: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
	managerIncluded: z.boolean(),
});

const CreatePoll = () => {
	type FormType = z.infer<typeof FormSchema>;

	const form = useForm<FormType>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			options: [{ value: "Option #1" }],
			endTime: "",
			managerIncluded: false,
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "options",
	});

	async function onSubmit(data: FormType) {
		console.log(JSON.stringify(data, null, 2));

		const res = await apiCall(() => client.api.polls.$post({ json: data }));

		if (!res.ok) {
			throw new Error(`Error ${res.status}`);
		}

		const asdas = await res.json();
		console.log(asdas);
	}

	function handleDateSelect(date: Date | undefined) {
		if (date) {
			form.setValue("endTime", date.toISOString());
		}
	}

	function handleTimeChange(type: "hour" | "minute", value: string) {
		const currentDate = form.getValues("endTime") || new Date();
		const newDate = new Date(currentDate);

		if (type === "hour") {
			const hour = parseInt(value, 10);
			newDate.setHours(hour);
		} else if (type === "minute") {
			newDate.setMinutes(parseInt(value, 10));
		}

		handleDateSelect(newDate);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-4xl space-y-6"
			>
				<div className="flex flex-col gap-2">
					<DialogTitle className="text-2xl font-bold">
						Create Poll
					</DialogTitle>
					<DialogDescription>
						Please fill out the form to create a new poll.
					</DialogDescription>
				</div>

				{/* Two column layout for title/description and endtime */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left column - Title and Description */}
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Poll #1"
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
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter the poll description"
											rows={6}
											{...field}
											className="overflow-auto resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Right column - End Time */}
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="endTime"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>End Time</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value &&
															"text-muted-foreground"
													)}
												>
													{field.value ? (
														formatDate(
															new Date(
																field.value
															)
														)
													) : (
														<span>
															dd.mm.yyyy, hh:mm
														</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<div className="sm:flex">
												<Calendar
													mode="single"
													selected={
														new Date(field.value)
													}
													onSelect={handleDateSelect}
													initialFocus
												/>
												<div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
													<ScrollArea className="w-64 sm:w-auto">
														<div className="flex sm:flex-col p-2">
															{Array.from(
																{ length: 24 },
																(_, i) => i
															)
																.reverse()
																.map((hour) => (
																	<Button
																		key={
																			hour
																		}
																		size="icon"
																		variant={
																			field.value &&
																			new Date(
																				field.value
																			).getHours() ===
																				hour
																				? "default"
																				: "ghost"
																		}
																		className="sm:w-full shrink-0 aspect-square"
																		onClick={() =>
																			handleTimeChange(
																				"hour",
																				hour.toString()
																			)
																		}
																	>
																		{hour}
																	</Button>
																))}
														</div>
														<ScrollBar
															orientation="horizontal"
															className="sm:hidden"
														/>
													</ScrollArea>
													<ScrollArea className="w-64 sm:w-auto">
														<div className="flex sm:flex-col p-2">
															{Array.from(
																{ length: 12 },
																(_, i) => i * 5
															).map((minute) => (
																<Button
																	key={minute}
																	size="icon"
																	variant={
																		field.value &&
																		new Date(
																			field.value
																		).getMinutes() ===
																			minute
																			? "default"
																			: "ghost"
																	}
																	className="sm:w-full shrink-0 aspect-square"
																	onClick={() =>
																		handleTimeChange(
																			"minute",
																			minute.toString()
																		)
																	}
																>
																	{minute
																		.toString()
																		.padStart(
																			2,
																			"0"
																		)}
																</Button>
															))}
														</div>
														<ScrollBar
															orientation="horizontal"
															className="sm:hidden"
														/>
													</ScrollArea>
												</div>
											</div>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="managerIncluded"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="mb-0 font-medium">
											Manager included as a participant
										</FormLabel>
										<FormDescription>
											Include the poll manager in the
											voting process
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Options section - full width below */}
				<div className="border-t pt-6">
					<FormItem>
						<FormLabel className="text-lg font-semibold">
							Poll Options
						</FormLabel>
						<FormDescription className="mb-4">
							Add the options that participants can vote for
							(minimum 1, maximum 10)
						</FormDescription>
						<ScrollArea className="max-h-[300px] w-full">
							<div className="space-y-3 pr-4">
								{fields.map((field, idx) => (
									<div
										key={field.id}
										className="flex items-center space-x-3 p-3 rounded-lg border bg-card"
									>
										<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
											{idx + 1}
										</div>
										<FormField
											control={form.control}
											name={
												`options.${idx}.value` as const
											}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input
															placeholder={`Enter option ${idx + 1}`}
															{...field}
															className="border-0 bg-transparent focus:ring-0 focus:border-primary"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{fields.length > 1 && (
											<Button
												variant="outline"
												size="icon"
												onClick={() => remove(idx)}
											>
												<X size={16} />
											</Button>
										)}
									</div>
								))}
							</div>
						</ScrollArea>
						<div className="mt-4 space-y-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full border-dashed"
								disabled={fields.length >= 10}
								onClick={() => append({ value: "" })}
							>
								<Plus size={16} className="mr-2" /> Add option
							</Button>
							{fields.length >= 10 && (
								<p className="text-sm text-muted-foreground text-center">
									Maximum of 10 options reached
								</p>
							)}
						</div>
					</FormItem>
				</div>

				{/* Action buttons */}
				<div className="flex space-x-4 justify-end pt-6 border-t">
					{form.formState.isValid ? (
						<>
							<DialogClose asChild>
								<Button
									type="submit"
									className="bg-green-500 hover:bg-green-600"
								>
									<CirclePlus className="mr-2" size={16} />
									Create Poll
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button variant="outline">
									<X className="mr-2" size={16} />
									Cancel
								</Button>
							</DialogClose>
						</>
					) : (
						<>
							<Button
								disabled
								type="submit"
								className="bg-green-500 hover:bg-green-600"
							>
								<CirclePlus className="mr-2" size={16} />
								Create Poll
							</Button>
							<DialogClose asChild>
								<Button variant="outline">
									<X className="mr-2" size={16} />
									Cancel
								</Button>
							</DialogClose>
						</>
					)}
				</div>
			</form>
		</Form>
	);
};

export default CreatePoll;
