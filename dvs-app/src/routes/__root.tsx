import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface QueryContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<QueryContext>()({
	component: Root,
});

function Root() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
