import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { healthRoute } from "./routes/health";
import { ticketsRoute } from "./routes/tickets";
import { authRoute, type JwtPayload } from "./routes/auth";
import { jwt, type JwtVariables } from "hono/jwt";

type Variables = JwtVariables<JwtPayload>;

const app = new Hono<{ Variables: Variables }>();

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
	.route("/tickets", ticketsRoute)
	.get("/test", (c) => {
		const payload = c.get("jwtPayload");
		return c.json(payload);
	});

app.get("*", serveStatic({ root: "../../dvs-app/dist" }));
app.get("*", serveStatic({ path: "../../dvs-app/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
