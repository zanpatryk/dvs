import { TicketsData } from "@/dummy/data";
import { formatDate } from "@/lib/utils";

const ViewTicket = ({ ticketId }: { ticketId: string }) => {
	const ticket = TicketsData.find((ticket) => ticket.id === ticketId);

	if (!ticket) {
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
		</div>
	);
};
export default ViewTicket;
