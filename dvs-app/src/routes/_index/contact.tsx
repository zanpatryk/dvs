import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_index/contact")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Contact Us</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 ">
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Your full name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								rows={5}
								placeholder="Type your message here"
								required
								className="max-h-96"
							/>
						</div>
						<Button type="submit" className="w-full">
							Send Message
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
