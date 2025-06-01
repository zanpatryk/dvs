import ViewTicketResponse from "@/components/ticket/response";
import ViewTicket from "@/components/ticket/view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Ticket } from "@/dummy/data";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";

export const columns: ColumnDef<Ticket>[] = [
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
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<p
					className={
						status === "Resolved"
							? "text-green-500"
							: "text-yellow-500"
					}
				>
					{status}
				</p>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Creation Date",
		cell: ({ row }) =>
			formatDate(new Date(row.getValue("createdAt") as string)),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const ticketId = row.getValue("id") as string;
			const status = row.getValue("status") as string;

			return status === "Pending" ? (
				<Dialog>
					<DialogTrigger asChild>
						<Button
							size="sm"
							className="bg-blue-500 hover:bg-blue-600"
						>
							<FileSearch />
							View
						</Button>
					</DialogTrigger>
					<DialogContent>
						<ViewTicket ticketId={ticketId} />
					</DialogContent>
				</Dialog>
			) : (
				<Dialog>
					<DialogTrigger asChild>
						<Button
							size="sm"
							className="bg-green-500 hover:bg-green-600"
						>
							<FileSearch />
							View Response
						</Button>
					</DialogTrigger>
					<DialogContent>
						<ViewTicketResponse ticketId={ticketId} />
					</DialogContent>
				</Dialog>
			);
		},
	},
];
