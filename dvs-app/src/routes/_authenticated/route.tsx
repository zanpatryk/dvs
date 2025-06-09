import { Unauthorized } from "@/components/dashboard/unauthorized";
import {
	contractQueryOptions,
	userRoleQueryOptions,
} from "@/hooks/use-contract-query";
import { authQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		try {
			const { address } = await queryClient.fetchQuery(authQueryOptions);
			const contract = await queryClient.fetchQuery(contractQueryOptions);

			const role = await queryClient.fetchQuery(
				userRoleQueryOptions(address, contract)
			);

			return { address, role };
		} catch {
			return { address: null, role: null };
		}
	},
	notFoundComponent: Unauthorized,
	component: RouteComponent,
});

function RouteComponent() {
	const { address } = Route.useRouteContext();

	if (!address) return <Unauthorized />;

	return <Outlet />;
}
