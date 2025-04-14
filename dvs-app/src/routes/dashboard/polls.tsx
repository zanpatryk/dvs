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
	return (
		<div className="bg-white rounded-lg p-6 shadow-sm">
			<div className="mb-4">
				<h3 className="text-lg font-medium">{title}</h3>
				<p className="text-sm text-slate-500">{description}</p>
			</div>

			{endDate.getTime() > Date.now() && (
				<div className="flex items-center text-sm text-slate-500 mb-4">
					<Clock className="h-4 w-4 mr-2" />
					<span>
						Voting ends in:{" "}
						{Math.floor(
							(endDate.getTime() - Date.now()) / (1000 * 60 * 60)
						)}{" "}
						hours{" "}
						{Math.floor(
							((endDate.getTime() - Date.now()) / (1000 * 60)) %
								60
						)}{" "}
						minutes
					</span>
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
						case PollStatus.Complete:
							return (
								<Button
									variant="outline"
									className="text-blue-600 border-blue-600"
								>
									<FileSearch />
									View Poll
								</Button>
							);
						case PollStatus.Minted:
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
						case PollStatus.Results:
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
			<div className="flex-1 p-6">
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
					{/* <StatsCard
						title="Total Polls"
						value="69"
						icon={<ClipboardList className="h-6 w-6" />}
					/>
					<StatsCard
						title="Active Polls"
						value="21"
						icon={<Clock className="h-6 w-6" />}
					/>
					<StatsCard
						title="Complete Polls"
						value="37"
						icon={<ClipboardCheck className="h-6 w-6" />}
					/>
					<StatsCard
						title="Participation"
						value="77 %"
						icon={<Percent className="h-6 w-6" />}
					/> */}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
						<h2 className="sticky top-0 bg-white border-b text-xl font-medium text-muted-foreground pb-4">
							Active Votes
						</h2>
						<div className="space-y-4">
							{PollsData.map(
								(poll) =>
									poll.status != PollStatus.Minted && (
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
							{/* <PollCard
								id="1"
								isActive={true}
								timeRemaining="21 hours 37 minutes"
								actionButton={
									<Dialog>
										<DialogTrigger asChild>
											<Button className="bg-blue-600 hover:bg-blue-700">
												<CircleCheckBig />
												Vote
											</Button>
										</DialogTrigger>
										<DialogContent>
											<VotePoll />
										</DialogContent>
									</Dialog>
								}
							/>
							<PollCard
								id="2"
								isActive={true}
								timeRemaining="21 hours 37 minutes"
								actionButton={
									<Button
										variant="outline"
										className="text-blue-600 border-blue-600"
									>
										<FileSearch />
										View Poll
									</Button>
								}
							/>
							<PollCard
								id="3"
								isActive={true}
								timeRemaining="21 hours 37 minutes"
								actionButton={
									<Button
										variant="outline"
										className="text-blue-600 border-blue-600"
									>
										<FileSearch />
										View Poll
									</Button>
								}
							/> */}
						</div>
					</div>
					<div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
						<h2 className="sticky top-0 bg-white border-b text-xl font-medium text-muted-foreground pb-4">
							Complete Votes
						</h2>
						<div className="space-y-4">
							{PollsData.map(
								(poll) =>
									poll.status != PollStatus.Active && (
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
							{/* <PollCard
								id="4"
								isActive={false}
								actionButtons={[
									<Button
										key="view"
										variant="outline"
										className="text-blue-600 border-blue-600"
									>
										<FileSearch />
										View Poll
									</Button>,
									<Button
										key="results"
										className="bg-green-500 hover:bg-green-600"
									>
										<View />
										View Results
									</Button>,
								]}
							/>
							<PollCard
								id="5"
								isActive={false}
								actionButtons={[
									<Button
										key="view"
										variant="outline"
										className="text-blue-600 border-blue-600"
									>
										<FileSearch />
										View Poll
									</Button>,
									<Button
										key="mint"
										className="bg-green-500 hover:bg-green-600"
									>
										<Award />
										Mint participation NFT
									</Button>,
								]}
							/>
							<PollCard
								id="6"
								isActive={false}
								actionButtons={[
									<Button
										key="view"
										variant="outline"
										className="text-blue-600 border-blue-600"
									>
										<FileSearch />
										View Poll
									</Button>,
									<Button
										key="mint"
										className="bg-green-500 hover:bg-green-600"
									>
										<span className="mr-2">
											<Award />
										</span>{" "}
										Mint participation NFT
									</Button>,
								]}
							/> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
