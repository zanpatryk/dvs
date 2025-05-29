import { Hono } from "hono";
import { TicketsData } from "../../../dvs-app/src/dummy/data";

export const ticketsRoute = new Hono().get("/", async (c) => {
	return c.json(TicketsData);
});
