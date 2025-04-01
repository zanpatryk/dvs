import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Clock,
	ClipboardList,
	ClipboardCheck,
	Percent,
	CirclePlus,
	CircleCheckBig,
	FileSearch,
	View,
	Award,
} from "lucide-react";
import { NavbarSidebar } from "@/components/navbar-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAccount } from "wagmi";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { address } = useAccount();

	if (!address) {
		return <Navigate to="/" replace />;
	}

	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="flex min-h-screen bg-slate-50">
				{/* Sidebar */}
				<SidebarProvider>
					<NavbarSidebar />
					{/* Main Content */}
					<div className="flex-1 p-6">
						<div className="flex justify-between items-center mb-8">
							<h1 className="text-3xl font-bold">Dashboard</h1>
							<Button className="bg-blue-600 hover:bg-blue-700">
								<span>
									<CirclePlus />
								</span>{" "}
								Join a Poll
							</Button>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							<StatsCard
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
							/>
						</div>

						{/* Polls Sections */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Active Votes */}
							<div>
								<h2 className="text-xl font-medium text-slate-600 mb-4">
									Active Votes
								</h2>
								<div className="space-y-4">
									<PollCard
										id="1"
										isActive={true}
										timeRemaining="21 hours 37 minutes"
										actionButton={
											<Button className="bg-blue-600 hover:bg-blue-700">
												<CircleCheckBig />
												Vote
											</Button>
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
												<span className="mr-2">
													<FileSearch />
												</span>{" "}
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
												<span className="mr-2">
													<FileSearch />
												</span>{" "}
												View Poll
											</Button>
										}
									/>
								</div>
							</div>

							{/* Complete Votes */}
							<div>
								<h2 className="text-xl font-medium text-slate-600 mb-4">
									Complete Votes
								</h2>
								<div className="space-y-4">
									<PollCard
										id="4"
										isActive={false}
										actionButtons={[
											<Button
												key="view"
												variant="outline"
												className="text-blue-600 border-blue-600"
											>
												<span className="mr-2">
													<FileSearch />
												</span>{" "}
												View Poll
											</Button>,
											<Button
												key="results"
												className="bg-green-500 hover:bg-green-600"
											>
												<span className="mr-2">
													<View />
												</span>{" "}
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
												<span className="mr-2">
													<FileSearch />
												</span>{" "}
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
												<span className="mr-2">
													<FileSearch />
												</span>{" "}
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
									/>
								</div>
							</div>
						</div>
					</div>
				</SidebarProvider>
			</div>
		</ThemeProvider>
	);
}

interface StatsCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
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
	id: string | number;
	isActive: boolean;
	timeRemaining?: string;
	actionButton?: React.ReactNode;
	actionButtons?: React.ReactNode[];
}

function PollCard({
	id,
	isActive,
	timeRemaining,
	actionButton,
	actionButtons,
}: PollCardProps) {
	return (
		<div className="bg-white rounded-lg p-6 shadow-sm">
			<div className="mb-4">
				<h3 className="text-lg font-medium">Poll #{id}</h3>
				<p className="text-sm text-slate-500">Description</p>
			</div>

			{isActive && timeRemaining && (
				<div className="flex items-center text-sm text-slate-500 mb-4">
					<Clock className="h-4 w-4 mr-2" />
					<span>Voting ends in: {timeRemaining}</span>
				</div>
			)}

			<div className="flex justify-end space-x-2">
				{actionButton}
				{actionButtons &&
					actionButtons.map((button, index) => (
						<div key={index}>{button}</div>
					))}
			</div>
		</div>
	);
}
