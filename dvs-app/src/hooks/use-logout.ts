import { client } from "@/hono-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			// const res = await fetch("/api/auth/logout", {
			// 	method: "POST",
			// 	credentials: "include",
			// });
			const res = await client.auth.logout.$post();
			if (!res.ok) {
				throw new Error("Failed to logout");
			}
			// Clear React Query cache
			queryClient.clear();
		},
	});
}
