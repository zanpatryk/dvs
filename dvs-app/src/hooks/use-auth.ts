import { useQuery } from "@tanstack/react-query";
import { authQueryOptions } from "@/lib/api";

// async function getAuth() {
// 	let res = await client.api.me.$get();

// 	if (res.status === 401) {
// 		const refreshRes = await client.auth.refresh.$post();
// 		if (refreshRes.ok) {
// 			res = await client.api.me.$get();
// 		}
// 	}

// 	if (!res.ok) {
// 		throw new Error(`Error ${res.status}`);
// 	}

// 	return await res.json();
// }

// export const authQueryOptions = queryOptions({
// 	queryKey: ["auth", "me"],
// 	queryFn: getAuth,
// 	staleTime: 5 * 60 * 1000,
// 	retry: false,
// });

// export function useAuth() {
// 	return useQuery(authQueryOptions);
// }

export function useAuth() {
	return useQuery(authQueryOptions);
}
