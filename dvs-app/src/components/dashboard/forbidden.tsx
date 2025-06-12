import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Forbidden() {
	return (
		<div className="h-full m-auto max-w-2xl flex flex-col justify-center items-center gap-4 ">
			<h1 className="font-bold text-2xl">
				You are not supposed to be here!
			</h1>
			<p className="text-muted-foreground text-center">
				Looks like you are not authorized to access this page. Please
				return to the home page and login with the correct credentials.
			</p>
			<Link to="/">
				<Button>Take me back</Button>
			</Link>
		</div>
	);
}
