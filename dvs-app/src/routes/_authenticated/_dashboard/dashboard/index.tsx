import { Forbidden } from "@/components/dashboard/forbidden";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/dashboard/")({
	component: Forbidden,
	notFoundComponent: Forbidden,
});
