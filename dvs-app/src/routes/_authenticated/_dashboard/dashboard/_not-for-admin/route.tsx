import { Forbidden } from "@/components/dashboard/forbidden";
import { UserRole } from "@/hooks/use-contract-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/_not-for-admin"
)({
	beforeLoad: ({ context }) => {
		const { role } = context;

		if (!role || role === UserRole.Admin) {
			redirect({
				to: "/dashboard/manage-users",
				throw: true,
			});
		}
	},
	component: RouteComponent,
	notFoundComponent: Forbidden,
});

function RouteComponent() {
	const { role } = Route.useRouteContext();

	if (!role || role === UserRole.Admin) {
		return <Forbidden />;
	}

	return <Outlet />;
}
