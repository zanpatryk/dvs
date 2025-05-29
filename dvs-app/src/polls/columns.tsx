import ViewTicketResponse from "@/components/ticket/response";
import ViewTicket from "@/components/ticket/view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";

export const columns: ColumnDef<{
	id: string;
	creatorAddress: string;
	title: string;
	description: string;
	startTime: string;
	endTime: string | null;
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
			header: "Status",
			cell: ({ row }) => {
				const endDate = new Date(row.getValue("endTime") as string);
				return (
					<p
						className={
							new Date() > endDate
								? "text-yellow-500"
								: "text-green-500"
						}
					>
						{ new Date() > endDate ? "Complete" : "Active"}
					</p>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const pollId = row.getValue("id") as string;
				const endDate = new Date(row.getValue("endTime") as string);

				return new Date() > endDate ? (
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
						{/* Add poll ending */}
						{/* <DialogContent>
						</DialogContent> */}
					</Dialog>
				);
			},
		},
	];
