import { Forbidden } from "@/components/dashboard/forbidden";
import { UserRole } from "@/hooks/use-contract-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/dashboard/_admin-only"
)({
	component: RouteComponent,
	notFoundComponent: Forbidden,
});

function RouteComponent() {
	const { role } = Route.useRouteContext();

	if (!role || role !== UserRole.Admin) {
		return <Forbidden />;
	}

	return <Outlet />;
}
