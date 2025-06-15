import { authQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
	return useQuery(authQueryOptions);
}
