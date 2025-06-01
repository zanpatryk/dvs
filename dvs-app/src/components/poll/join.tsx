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
import { useJoinPollMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CirclePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	code: z.string().min(6, {
		message: "Your join code must be 6 characters.",
	}),
});

const JoinPoll = () => {
	const mutation = useJoinPollMutation();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			code: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		mutation.mutate(data.code);
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
									maxLength={6}
									{...field}
									pattern={REGEXP_ONLY_DIGITS}
								>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
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
