import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Unauthorized() {
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
