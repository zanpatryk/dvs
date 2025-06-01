import { CreatePollFormType } from "@/components/poll/create";
import { client } from "@/hono-client";
import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiResponse {
	ok: boolean;
	status: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json(): Promise<any>;
}

async function apiCall<T extends ApiResponse>(
	fn: () => Promise<T>
): Promise<T> {
	const res = await fn();

	// Check if response is 401 (unauthorized)
	if (res.status === 401) {
		try {
			const refreshRes = await client.auth.refresh.$post();
			if (refreshRes.ok) {
				// Retry original call after successful refresh
				return await fn();
			}
		} catch {
			// Refresh failed, return original 401 response
		}
	}

	return res;
}

async function getAuth() {
	const res = await apiCall(() => client.api.me.$get());

	if (!res.ok) {
		throw new Error(`Error ${res.status}`);
	}

	return await res.json();
}

export const authQueryOptions = queryOptions({
	queryKey: ["auth", "me"],
	queryFn: getAuth,
	staleTime: 5 * 60 * 1000,
	retry: false,
});

async function getPolls() {
	const res = await apiCall(() => client.api.polls.$get());

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

async function getCreatedPolls() {
	const res = await apiCall(() => client.api.polls.created.$get());

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const pollsQueryOptions = queryOptions({
	queryKey: ["get-polls"],
	queryFn: getPolls,
	staleTime: Infinity,
	retry: false,
});

export const createdPollsQueryOptions = queryOptions({
	queryKey: ["get-created-polls"],
	queryFn: getCreatedPolls,
	staleTime: Infinity,
	retry: false,
});

async function getPollDetails(pollId: string) {
	const res = await apiCall(() =>
		client.api.polls[":id"].$get({
			param: {
				id: pollId,
			},
		})
	);

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const pollDetailsQueryOptions = (pollId: string) =>
	queryOptions({
		queryKey: ["get-poll-details", pollId],
		queryFn: () => getPollDetails(pollId),
		staleTime: Infinity,
		retry: false,
	});

async function createPoll(poll: CreatePollFormType) {
	const res = await apiCall(() => client.api.polls.$post({ json: poll }));

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const useCreatePollMutation = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: createPoll,
		onError: (error: Error) => {
			toast.error(error.message);
		},
		onSuccess: (_, variables) => {
			toast.success("Poll created successfully");
			if (variables.managerIncluded)
				queryClient.invalidateQueries({
					queryKey: ["get-created-polls"],
				});
			queryClient.invalidateQueries({ queryKey: ["get-polls"] });
		},
	});

	return mutation;
};

async function joinPoll(code: string) {
	const res = await apiCall(() =>
		client.api.polls.join.$patch({
			json: { code },
		})
	);

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error);
	}

	return await res.json();
}

export const useJoinPollMutation = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: joinPoll,
		onError: (error: Error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			toast.success("Joined poll successfully");
			queryClient.invalidateQueries({ queryKey: ["get-polls"] });
		},
	});

	return mutation;
};

async function endPoll(pollId: string) {
	const res = await apiCall(() =>
		client.api.polls[":id"].end.$patch({
			param: {
				id: pollId,
			},
		})
	);

	if (!res.ok) {
		const data = await res.json();
		throw new Error(`Failed to end poll: ${data.error}`);
	}

	return await res.json();
}

export const useEndPollMutation = (pollId: string) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: () => endPoll(pollId),
		onError: (error: Error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			toast.success("Poll ended successfully");
			queryClient.invalidateQueries({ queryKey: ["get-created-polls"] });
			queryClient.invalidateQueries({ queryKey: ["get-polls"] });
		},
	});
	return mutation;
};

async function getTickets() {
	const res = await apiCall(() => client.api.tickets.$get());

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const ticketsQueryOptions = queryOptions({
	queryKey: ["get-tickets"],
	queryFn: getTickets,
	staleTime: Infinity,
	retry: false,
});

async function getMyTickets() {
	const res = await apiCall(() => client.api.tickets.my.$get());

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const myTicketsQueryOptions = queryOptions({
	queryKey: ["get-my-tickets"],
	queryFn: getMyTickets,
	staleTime: Infinity,
	retry: false,
});

async function getTicketDetails(ticketId: string) {
	const res = await apiCall(() =>
		client.api.tickets[":id"].$get({
			param: {
				id: ticketId,
			},
		})
	);

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const ticketDetailsQueryOptions = (ticketId: string) =>
	queryOptions({
		queryKey: ["get-ticket-details", ticketId],
		queryFn: () => getTicketDetails(ticketId),
		staleTime: Infinity,
		retry: false,
	});

async function createTicket(ticket: { title: string; description: string }) {
	const res = await apiCall(() => client.api.tickets.$post({ json: ticket }));

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error);
	}

	return await res.json();
}

export const useCreateTicketMutation = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: createTicket,
		onError: (error: Error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			toast.success("Ticket created successfully");
			queryClient.invalidateQueries({ queryKey: ["get-my-tickets"] });
		},
	});

	return mutation;
};

async function respondToTicket(ticket: { ticketId: string; response: string }) {
	const res = await apiCall(() =>
		client.api.tickets[":id"].$patch({
			param: {
				id: ticket.ticketId,
			},
			json: { response: ticket.response },
		})
	);

	if (!res.ok) {
		const data = await res.json();
		throw new Error("error" in data ? data.error : `Error ${res.status}`);
	}

	return await res.json();
}

export const useResolveTicketMutation = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: respondToTicket,
		onError: (error: Error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			toast.success("Ticket resolved successfully");
			queryClient.invalidateQueries({ queryKey: ["get-tickets"] });
		},
	});

	return mutation;
};
