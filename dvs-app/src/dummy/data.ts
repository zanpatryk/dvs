import { ClipboardCheck, ClipboardList, Clock, Percent } from "lucide-react";

export enum PollStatus {
	Active = "active",
	Complete = "complete",
	Minted = "minted",
	Results = "results",
}

export const StatsData = [
	{
		title: "Total Polls",
		value: "69",
		icon: ClipboardList,
	},
	{ title: "Active Polls", value: "21", icon: Clock },
	{ title: "Complete Polls", value: "37", icon: ClipboardCheck },
	{ title: "Participation", value: "77 %", icon: Percent },
];

export type Poll = {
	id: string;
	title: string;
	description: string;
	status: PollStatus;
	endDate: Date;
};

export const PollsData: Poll[] = [
	{
		id: "1",
		title: "Poll #1",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		status: PollStatus.Active,
		endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
	},
	{
		id: "2",
		title: "Poll #2",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		status: PollStatus.Complete,
		endDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
	},
	{
		id: "3",
		title: "Poll #3",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		status: PollStatus.Minted,
		endDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
	},
	{
		id: "4",
		title: "Poll #4",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		status: PollStatus.Results,
		endDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
	},
];

export type Ticket = {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	status: "Pending" | "Resolved";
	response?: string;
};

export const TicketsData: Ticket[] = [
	{
		id: "13c7f497-1bc2-42fd-9770-980a64994070",
		title: "Ticket #1",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
		status: "Pending",
	},
	{
		id: "36a23bf4-f035-4ed7-81bc-14c514c30883",
		title: "Ticket #2",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
		status: "Resolved",
		response:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
	},
	{
		id: "4e312e00-d387-4905-9551-7768d9dda036",
		title: "Ticket #3",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
		status: "Pending",
	},
	{
		id: "c07c1d9a-3561-41fc-8379-87eb63989b1a",
		title: "Ticket #4",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
		status: "Resolved",
		response:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, praesentium quidem et, illo voluptates dolor voluptatum optio temporibus quia sapiente quae explicabo quos eligendi consequuntur omnis? Reiciendis, doloribus eos.",
	},
];
