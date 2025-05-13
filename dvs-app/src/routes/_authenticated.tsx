import { Button } from "@/components/ui/button";
import { authQueryOptions } from "@/hooks/use-auth";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		// TODO: hit /refresh endpoint if failed the first time
		// const data = await queryClient.fetchQuery(authQueryOptions);

		// if(!data.address)
		// {
		// 	const res = await queryClient.fetchQuery({

		// 	})
		// }

		return await queryClient.fetchQuery(authQueryOptions);
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
