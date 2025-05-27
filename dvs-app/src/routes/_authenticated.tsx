import { Button } from "@/components/ui/button";
import { authQueryOptions } from "@/lib/api";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		try {
			return await queryClient.fetchQuery(authQueryOptions);
		} catch {
			return { address: null };
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { address } = Route.useRouteContext();

	if (!address) return <Unauthorized />;

	return <Outlet />;
}

function Unauthorized() {
	return (
		<div className="h-screen m-auto max-w-2xl flex flex-col justify-center items-center gap-4 ">
			<h1 className="font-bold text-2xl">
				You are not supposed to be here!
			</h1>
			<p className="text-muted-foreground">
				Looks like you are not logged in. Please return to the home page
				and login.
			</p>
			<Link to="/">
				<Button>Take me back</Button>
			</Link>
		</div>
	);
}
