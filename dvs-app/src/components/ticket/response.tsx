import { Separator } from "@/components/ui/separator";
import { TicketsData } from "@/dummy/data";
import { formatDate } from "@/lib/utils";

const ViewTicketResponse = ({ ticketId }: { ticketId: string }) => {
	const ticket = TicketsData.find((ticket) => ticket.id === ticketId);

	if (!ticket || ticket.status !== "Resolved") {
		return <div>Ticket not found</div>;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">
				{ticket.title} @ {formatDate(ticket.createdAt)}
			</h1>
			<p className="text-muted-foreground text-sm">
				{ticket.description}
			</p>
			<Separator className="my-4" />
			<p className="text-sm">{ticket.response}</p>
		</div>
	);
};
export default ViewTicketResponse;
