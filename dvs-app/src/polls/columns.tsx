import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { client } from "@/hono-client";
import { apiCall } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { queryClient } from "@/main";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";

export const columns: ColumnDef<{
	id: string;
	creatorAddress: string;
	title: string;
	description: string;
	participantLimit: number;
	accessCode: string;
	startTime: string;
	endTime: string | null;
	hasEndedPrematurely: boolean | null;
}>[] = [
		{
			accessorKey: "id",
			header: "UUID",
		},
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "description",
			header: "Description",
			cell: ({ row }) => {
				const description = row.getValue("description") as string;
				return <p className="truncate max-w-[25vw]">{description}</p>;
			},
		},
		{
			accessorKey: "startTime",
			header: "Creation Date",
			cell: ({ row }) =>
				formatDate(new Date(row.getValue("startTime") as string)),
		},
		{
			accessorKey: "endTime",
			header: "End Time",
			cell: ({ row }) =>
				formatDate(new Date(row.getValue("endTime") as string))
		},
		{
			accessorKey: "participants",
			header: "Participants",
		},
		{
			accessorKey: "hasEndedPrematurely",
			header: "Ended Prematurely",
			cell: ({ row }) => {
				return (
					<p className={row.getValue("hasEndedPrematurely") ? "text-orange-500" : "text-green-500"}>
						{row.getValue("hasEndedPrematurely") ? "Yes" : "No"}
					</p>
				)
			}
		},
		{
			header: "Status",
			cell: ({ row }) => {
				const endDate = new Date(row.getValue("endTime") as string);
				const hasEndedPrematurely = row.getValue("hasEndedPrematurely") as boolean | null;
				return (
					<p
						className={
							new Date() > endDate || hasEndedPrematurely
								? "text-black-500"
								: "text-green-500"
						}
					>
						{new Date() > endDate || hasEndedPrematurely ? "Complete" : "Active"}
					</p>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const pollId = row.getValue("id") as string;
				const endDate = new Date(row.getValue("endTime") as string);
				const hasEndedPrematurely = row.getValue("hasEndedPrematurely") as boolean | null;

				return new Date() > endDate || hasEndedPrematurely ? (
					<Dialog>
						<DialogTrigger asChild>
							<Button
								size="sm"
								className="bg-green-500 hover:bg-green-600"
							>
								<FileSearch />
								View results
							</Button>
						</DialogTrigger>
						{/* Add poll viewing */}
						{/* <DialogContent>
						</DialogContent> */}
					</Dialog>
				) : (
					<Dialog>
						<DialogTrigger asChild>
							<Button
								size="sm"
								className="bg-red-500 hover:bg-red-600"
							>
								<FileSearch />
								End
							</Button>
						</DialogTrigger>
						<DialogContent>
							<div className="flex flex-col gap-4">
								<p>Are you sure you want to end this poll prematurely?</p>
								<div className="flex justify-end gap-2">
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button
										className="bg-red-500 hover:bg-red-600"
										onClick={async () => {
											const res = await apiCall(() => client.api.polls[":id"].close.$post({
												param: {
													id: pollId,
												},
											}))

											if (!res.ok) {
												console.error("Failed to end poll:", res.statusText);
											}

											queryClient.invalidateQueries({ queryKey: ["get-created-polls"] })
											queryClient.invalidateQueries({ queryKey: ["get-polls"] })
										}}
									>
										Confirm
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				);
			},
		},
	];
