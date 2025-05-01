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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { DialogClose } from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";

const FormSchema = z.object({
	code: z.string().min(6, {
		message: "Your join code must be 6 characters.",
	}),
});

const JoinPoll = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			code: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(JSON.stringify(data, null, 2));
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-2/3 space-y-6"
			>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-2xl font-bold">
								Join Poll
							</FormLabel>
							<FormDescription>
								Please enter the one-time code provided by the
								poll creator.
							</FormDescription>
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
					<DialogClose>
						<Button
							type="submit"
							className="bg-green-500 hover:bg-green-600"
						>
							<CirclePlus />
							Vote
						</Button>
					</DialogClose>
				) : (
					<Button
						className="bg-green-500 hover:bg-green-600"
						disabled
					>
						<CirclePlus />
						Vote
					</Button>
				)}
			</form>
		</Form>
	);
};
export default JoinPoll;
