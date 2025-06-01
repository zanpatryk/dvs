import RespondTicket from "@/components/ticket/respond";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { Ticket } from "../../../../backend/src/db/schema/tickets";

export const columns: ColumnDef<Ticket>[] = [
	{
		accessorKey: "id",
		header: "UUID",
	},
	{
		accessorKey: "issuerAddress",
		header: "Issuer Address",
		cell: ({ row }) => {
			const issuerAddress = row.getValue("issuerAddress") as string;
			return (
				<p className="truncate max-w-[25vw]">
					{issuerAddress || "Unknown"}
				</p>
			);
		},
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
						status === "resolved"
							? "text-green-500"
							: "text-yellow-500"
					}
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
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
		accessorKey: "response",
		header: "Response",
		cell: ({ row }) => {
			const response = row.getValue("response") as string;
			if (!response) {
				return <p className="text-gray-500 italic">No response yet</p>;
			}

			return <p className="truncate max-w-[25vw]">{response}</p>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const ticketId = row.getValue("id") as string;

			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button
							size="sm"
							className="bg-blue-500 hover:bg-blue-600"
						>
							<SquarePen />
							Respond
						</Button>
					</DialogTrigger>
					<DialogContent className="min-w-fit">
						<RespondTicket ticketId={ticketId} />
					</DialogContent>
				</Dialog>
			);
		},
	},
];
