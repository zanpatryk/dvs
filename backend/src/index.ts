import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { healthRoute } from "./routes/health";
import { ticketsRoute } from "./routes/tickets";
import { authRoute, meRoute, type JwtPayload } from "./routes/auth";
import { jwt } from "hono/jwt";

const app = new Hono();

app.use("*", logger());
app.use(
	"/api/*",
	jwt({
		secret: process.env.JWT_SECRET!,
		cookie: "access_token",
	})
);

const apiRoutes = app
	.route("/auth", authRoute)
	.route("/health", healthRoute)
	.basePath("/api")
	.route("/me", meRoute)
	.route("/tickets", ticketsRoute);
app.get("*", serveStatic({ root: "../../dvs-app/dist" }));
app.get("*", serveStatic({ path: "../../dvs-app/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
