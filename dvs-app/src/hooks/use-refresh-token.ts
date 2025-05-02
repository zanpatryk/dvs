import { client } from "@/hono-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRefreshToken() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			// const res = await fetch("/api/auth/refresh", {
			// 	method: "POST",
			// 	credentials: "include",
			// });
			const res = await client.auth.refresh.$post();
			if (!res.ok) {
				throw new Error("Failed to refresh token");
			}
			// On success, invalidate protected query to refetch with new token
			await queryClient.invalidateQueries({
				queryKey: ["protected-resource"],
			});
		},
	});
}
