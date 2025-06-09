import { hc } from "hono/client";
import { type ApiRoutes } from "../../../backend/src/index";

export const client = hc<ApiRoutes>("/", {
	init: {
		credentials: "include",
	},
});
