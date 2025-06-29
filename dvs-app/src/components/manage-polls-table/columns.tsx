import { EndPollButton } from "@/components/manage-polls-table/end-poll-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";
import { Poll } from "../../../../backend/src/db/schema/polls";

export const columns: ColumnDef<Poll>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "accessCode",
		header: "Access Code",
		cell: ({ row }) => {
			const accessCode = row.getValue("accessCode") as string;
			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(accessCode)
								}
								className="font-mono border rounded-md p-1"
							>
								{accessCode}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy the Access Code</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
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
		accessorKey: "startTime",
		header: "Start Date",
		cell: ({ row }) => formatDate(row.getValue("startTime")),
	},
	{
		accessorKey: "endTime",
		header: "End Time",
		cell: ({ row }) => formatDate(row.getValue("endTime")),
	},
	{
		accessorKey: "participantLimit",
		header: "Max Participants",
	},
	{
		accessorKey: "hasEndedPrematurely",
		header: "Ended Prematurely",
		cell: ({ row }) => {
			return (
				<Checkbox
					className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
					checked={row.getValue("hasEndedPrematurely")}
				/>
			);
		},
	},
	{
		header: "Status",
		cell: ({ row }) => {
			const endDate = new Date(row.getValue("endTime") as string);
			const hasEndedPrematurely = row.getValue("hasEndedPrematurely") as
				| boolean
				| null;
			return (
				<p
					className={
						new Date() > endDate || hasEndedPrematurely
							? "text-muted-foreground"
							: "text-green-500"
					}
				>
					{new Date() > endDate || hasEndedPrematurely
						? "Complete"
						: "Active"}
				</p>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const pollId = row.getValue("id") as string;
			const endDate = new Date(row.getValue("endTime") as string);
			const hasEndedPrematurely = row.getValue("hasEndedPrematurely") as
				| boolean
				| null;

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
							<p>
								Are you sure you want to end this poll
								prematurely?
							</p>
							<div className="flex justify-end gap-2">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<EndPollButton pollId={pollId} />
							</div>
						</div>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
