import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ticketDetailsQueryOptions } from "@/lib/api";
import { formatDate } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<DialogTitle />
			<DialogDescription />
			<div className="space-y-2">
				<Skeleton className="h-8 w-3/4" /> {/* Title */}
				<Skeleton className="h-4 w-1/3" /> {/* Date */}
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" /> {/* Description line 1 */}
				<Skeleton className="h-4 w-5/6" /> {/* Description line 2 */}
				<Skeleton className="h-4 w-2/3" /> {/* Description line 3 */}
			</div>
		</div>
	);
}

function ErrorState({ error }: { error: Error }) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<DialogTitle className="text-red-600 mb-4">
				Error loading ticket
			</DialogTitle>
			<DialogDescription className="text-sm text-gray-600">
				{error.message}
			</DialogDescription>
		</div>
	);
}

const ViewTicket = ({ ticketId }: { ticketId: string }) => {
	const {
		isPending,
		error,
		data: ticket,
	} = useQuery(ticketDetailsQueryOptions(ticketId));

	if (error) {
		return <ErrorState error={error} />;
	}

	if (isPending) {
		return <LoadingSkeleton />;
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">
					{ticket.title}
				</DialogTitle>
				<DialogDescription className="border-l pl-4 italic">
					{ticket.description}
				</DialogDescription>
				<div className="text-xs text-muted-foreground">
					Created on: {formatDate(new Date(ticket.createdAt))}
				</div>
			</DialogHeader>
			{ticket.response && (
				<>
					<Separator />
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">Response</h2>
						<p className="text-muted-foreground">
							{ticket.response}
						</p>
					</div>
				</>
			)}
		</>
	);
};

export default ViewTicket;
