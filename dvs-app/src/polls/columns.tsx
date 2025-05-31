import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useEndPollMutation } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch, Loader2 } from "lucide-react";

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
			formatDate(new Date(row.getValue("endTime") as string)),
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
								<EndPollButton pollId={pollId}>
									Confirm
								</EndPollButton>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

const EndPollButton = ({
	pollId,
	children,
}: React.PropsWithChildren & { pollId: string }) => {
	const mutation = useEndPollMutation(pollId);

	return (
		<Button
			className="bg-red-500 hover:bg-red-600"
			onClick={() => mutation.mutate()}
		>
			{mutation.isPending ? (
				<Loader2 className="animate-spin" />
			) : (
				children
			)}
		</Button>
	);
};
