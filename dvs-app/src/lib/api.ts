import { client } from "@/hono-client";
import { queryOptions } from "@tanstack/react-query";

interface ApiResponse {
	ok: boolean;
	status: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json(): Promise<any>;
}

export async function apiCall<T extends ApiResponse>(
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
		throw new Error(`Error ${res.status}`);
	}

	return await res.json();
}

async function getCreatedPolls() {
	const res = await apiCall(() => client.api.polls.created.$get());

	if (!res.ok) {
		throw new Error(`Error ${res.status}`);
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

async function getPoll(pollId: string) {
	const res = await apiCall(() =>
		client.api.polls[":id"].$get({
			param: {
				id: pollId,
			},
		})
	);

	if (!res.ok) throw new Error("Not found");

	return await res.json();
}

export const pollQueryOptions = (pollId: string) =>
	queryOptions({
		queryKey: ["get-poll", pollId],
		queryFn: async () => {
			return getPoll(pollId);
		},
		staleTime: Infinity,
		retry: false,
	});
