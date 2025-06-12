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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useJoinPollContractMutation } from "@/hooks/use-contract-query";
import { useJoinPollMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const REGEXP_ACCESS_CODE = "^0x[a-fA-F0-9]{64}$";

const FormSchema = z.object({
	code: z
		.string()
		.length(66, {
			message: "Your join code must be 66 characters.",
		})
		.startsWith("0x", {
			message: "Your join code must start with 0x.",
		}),
});

const JoinPoll = () => {
	const dbMutation = useJoinPollMutation();
	const joinPollMutation = useJoinPollContractMutation();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			code: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		await joinPollMutation.mutateAsync(data.code);

		if (joinPollMutation.isError) {
			console.error(
				"Failed to join poll via contract:",
				joinPollMutation.error
			);
			return;
		}

		dbMutation.mutate(data.code);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-2/3 space-y-6"
			>
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Join Poll
					</DialogTitle>
					<DialogDescription>
						Please enter the code provided by the poll creator.
					</DialogDescription>
				</DialogHeader>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
							<FormControl>
								<InputOTP
									maxLength={66}
									{...field}
									pattern={REGEXP_ACCESS_CODE}
								>
									<div className="grid grid-cols-2 gap-4 items-start">
										{/* First column: "0x" */}
										<div className="flex justify-end">
											<InputOTPGroup>
												<InputOTPSlot
													key={0}
													index={0}
												/>
												<InputOTPSlot
													key={1}
													index={1}
												/>
											</InputOTPGroup>
										</div>

										{/* Second column: All 8 groups of 8 characters */}
										<div className="space-y-2">
											{/* First group of 8 hex chars */}
											<div className="flex justify-start">
												<InputOTPGroup>
													{Array.from({
														length: 8,
													}).map((_, slotIndex) => {
														const index =
															2 + slotIndex;
														return (
															<InputOTPSlot
																key={index}
																index={index}
															/>
														);
													})}
												</InputOTPGroup>
											</div>

											{/* Remaining 7 groups of 8 characters each */}
											{Array.from({ length: 7 }).map(
												(_, groupIndex) => (
													<div
														key={`row-${groupIndex}`}
														className="flex justify-start"
													>
														<InputOTPGroup>
															{Array.from({
																length: 8,
															}).map(
																(
																	_,
																	slotIndex
																) => {
																	const index =
																		10 +
																		groupIndex *
																			8 +
																		slotIndex;
																	return (
																		<InputOTPSlot
																			key={
																				index
																			}
																			index={
																				index
																			}
																		/>
																	);
																}
															)}
														</InputOTPGroup>
													</div>
												)
											)}
										</div>
									</div>
								</InputOTP>
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
							{/* <Vote />
							Vote */}
							<CirclePlus />
							Join
						</Button>
					</DialogClose>
				) : (
					<Button
						className="bg-green-500 hover:bg-green-600"
						disabled
					>
						{/* <Vote />
						Vote */}
						<CirclePlus />
						Join
					</Button>
				)}
			</form>
		</Form>
	);
};
export default JoinPoll;
