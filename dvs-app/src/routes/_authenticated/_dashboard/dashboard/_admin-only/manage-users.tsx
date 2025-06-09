import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useChangeUserRoleMutation,
	UserRole,
} from "@/hooks/use-contract-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/_admin-only/manage-users"
)({
	component: RouteComponent,
});

const formSchema = z.object({
	address: z.string().startsWith("0x").length(42, {
		message: "Address must be a valid Ethereum address",
	}),
	role: z.nativeEnum(UserRole, {
		errorMap: (issue, ctx) => {
			if (issue.code === "invalid_type") {
				return { message: "Invalid role selected" };
			}
			return { message: ctx.defaultError };
		},
	}),
});

function RouteComponent() {
	const mutation = useChangeUserRoleMutation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: "",
			role: UserRole.User,
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		mutation.mutate({
			userAddress: data.address,
			role: data.role,
		});
	};

	return (
		<div className="h-full flex flex-col">
			{/* Header Section */}
			<div className="mb-6 flex-shrink-0">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Manage Users
				</h1>
				<p className="text-gray-600">
					Change user roles and permissions within the system. Enter a
					valid Ethereum address and select the desired role.
				</p>
			</div>

			{/* Content */}
			<div className="flex-initial min-h-0">
				<Card className="h-full">
					<CardContent className="p-6 flex items-center justify-center h-full">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 max-w-md w-full"
							>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Ethereum Address
											</FormLabel>
											<FormControl>
												<Input
													placeholder="0x..."
													{...field}
													disabled={
														mutation.isPending
													}
												/>
											</FormControl>
											<FormDescription>
												Enter the user's Ethereum
												address to change their role.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={mutation.isPending}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a role" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.values(
														UserRole
													).map((role) => (
														<SelectItem
															key={role}
															value={role}
														>
															{role
																.charAt(0)
																.toUpperCase() +
																role.slice(1)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormDescription>
												Select the new role for the
												user. This will affect their
												permissions within the system.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									disabled={mutation.isPending}
									className="w-full"
								>
									{mutation.isPending
										? "Updating..."
										: "Update Role"}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
