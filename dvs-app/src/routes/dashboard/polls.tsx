import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Clock,
	CirclePlus,
	CircleCheckBig,
	FileSearch,
	View,
	Award,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import JoinPoll from "@/components/poll/join";
import VotePoll from "@/components/poll/vote";
import { PollsData, PollStatus, StatsData } from "@/dummy/data";
import MintNFT from "@/components/poll/mint";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/polls")({
	component: RouteComponent,
});

interface StatsCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
	return (
		<div className="bg-white rounded-lg p-6 flex justify-between items-center shadow-sm">
			<div>
				<h3 className="text-lg font-medium">{title}</h3>
				<p className="text-4xl font-bold mt-2">{value}</p>
			</div>
			<div className="text-slate-400">{icon}</div>
		</div>
	);
}

interface PollCardProps {
	id: string;
	title: string;
	description: string;
	endDate: Date;
	status: PollStatus;
}

function PollCard({ id, title, description, endDate, status }: PollCardProps) {
	const [timeRemaining, setTimeRemaining] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const targetDate = endDate.getTime();
		const interval = setInterval(() => {
			const now = Date.now();
			const distance = targetDate - now;
			if (distance < 0) {
				clearInterval(interval);
				setTimeRemaining({
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
				});
				return;
			}
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor(
				(distance % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);
			setTimeRemaining({ days, hours, minutes, seconds });
		}, 1000);
		return () => clearInterval(interval);
	}, [endDate]);

	return (
		<div className="bg-white rounded-lg p-6 shadow-sm">
			<div className="mb-4">
				<h3 className="text-lg font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>

			{endDate.getTime() > Date.now() && (
				<div className="flex items-center text-sm text-slate-500 mb-4">
					<Clock className="h-4 w-4 mr-2" />
					Voting ends in:{" "}
					{timeRemaining.days > 0 && `${timeRemaining.days}d `}
					{timeRemaining.hours > 0 && `${timeRemaining.hours}h `}
					{timeRemaining.minutes > 0 && `${timeRemaining.minutes}m `}
					{timeRemaining.seconds > 0 && `${timeRemaining.seconds}s`}
				</div>
			)}

			<div className="flex justify-end space-x-2">
				{(() => {
					switch (status) {
						case PollStatus.Active:
							return (
								<Dialog>
									<DialogTrigger asChild>
										<Button className="bg-blue-600 hover:bg-blue-700">
											<CircleCheckBig />
											Vote
										</Button>
									</DialogTrigger>
									<DialogContent>
										<VotePoll pollId={id} />
									</DialogContent>
								</Dialog>
							);
						case PollStatus.Voted:
							return (
								<Button
									variant="outline"
									className="text-blue-600 border-blue-600"
								>
									<FileSearch />
									View Poll
								</Button>
							);
						case PollStatus.Finished:
							return (
								<Dialog>
									<DialogTrigger asChild>
										<Button className="bg-green-500 hover:bg-green-600">
											<Award />
											Mint participation NFT
										</Button>
									</DialogTrigger>
									<DialogContent>
										<MintNFT />
									</DialogContent>
								</Dialog>
							);
						case PollStatus.Minted:
							return (
								<Button className="bg-green-500 hover:bg-green-600">
									<View />
									View Results
								</Button>
							);
						default:
							return null;
					}
				})()}
			</div>
		</div>
	);
}

function RouteComponent() {
	return (
		<>
			<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
				<div className="flex items-center gap-2">
					<SidebarTrigger />
					<h1 className="text-3xl font-bold">Dashboard</h1>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="bg-blue-600 hover:bg-blue-700">
							<CirclePlus />
							Join a Poll
						</Button>
					</DialogTrigger>
					<DialogContent>
						<JoinPoll />
					</DialogContent>
				</Dialog>
			</header>
			<div className="flex-1 p-6 bg-gray-100">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{StatsData.map((stat) => (
						<StatsCard
							key={stat.title}
							title={stat.title}
							value={stat.value}
							icon={
								stat.icon && <stat.icon className="h-6 w-6" />
							}
						/>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
						<h2 className="sticky top-0 bg-gray-100 border-b text-xl font-medium text-muted-foreground pb-4">
							Active Votes
						</h2>
						<div className="space-y-4">
							{PollsData.map(
								(poll) =>
									(poll.status === PollStatus.Voted ||
										poll.status === PollStatus.Active) && (
										<PollCard
											key={poll.id}
											id={poll.id}
											title={poll.title}
											description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
											endDate={poll.endDate}
											status={poll.status}
										/>
									)
							)}
						</div>
					</div>
					<div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
						<h2 className="sticky top-0 bg-gray-100 border-b text-xl font-medium text-muted-foreground pb-4">
							Complete Votes
						</h2>
						<div className="space-y-4">
							{PollsData.map(
								(poll) =>
									(poll.status === PollStatus.Minted ||
										poll.status ===
											PollStatus.Finished) && (
										<PollCard
											key={poll.id}
											id={poll.id}
											title={poll.title}
											description={poll.description}
											endDate={poll.endDate}
											status={poll.status}
										/>
									)
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
