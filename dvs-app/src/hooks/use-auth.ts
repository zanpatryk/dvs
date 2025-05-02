import { queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/hono-client";

async function getAuth() {
	const res = await client.api.me.$get();
	if (!res.ok) {
		if (res.status === 401) return { address: null };
		throw new Error(`Error ${res.status}`);
	}
	return await res.json();
}

export const authQueryOptions = queryOptions({
	queryKey: ["auth", "me"],
	queryFn: getAuth,
	staleTime: Infinity,
});

export function useAuth() {
	return useQuery(authQueryOptions);
}
