import { client } from "@/hono-client";
import { useQuery } from "@tanstack/react-query";

export function useProtectedQuery() {
	return useQuery({
		queryKey: ["protected-resource"],
		queryFn: async () => {
			// const res = await fetch("/api/protected/resource", {
			// 	credentials: "include",
			// });
			const res = await client.api.test.$get();
			if (!res.ok) {
				throw new Error("Failed to fetch protected resource");
			}
			return res.json();
		},
	});
}
