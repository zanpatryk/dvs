import VotePoll from "@/components/poll/vote";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface PollCardProps {
	id: string;
	title: string;
	description: string;
	endDate?: Date;
	isActive?: boolean;
	participantCount?: number;
}

export function PollCard({
	id,
	title,
	description,
	endDate,
	isActive = true,
}: PollCardProps) {
	const [timeRemaining, setTimeRemaining] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		expired: false,
	});

	useEffect(() => {
		if (!endDate) return;

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
					expired: true,
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

			setTimeRemaining({ days, hours, minutes, seconds, expired: false });
		}, 1000);

		return () => clearInterval(interval);
	}, [endDate]);

	const formatTimeRemaining = () => {
		if (timeRemaining.expired) return "Expired";

		const parts = [];
		if (timeRemaining.days > 0) parts.push(`${timeRemaining.days}d`);
		if (timeRemaining.hours > 0) parts.push(`${timeRemaining.hours}h`);
		if (timeRemaining.minutes > 0) parts.push(`${timeRemaining.minutes}m`);
		if (parts.length === 0 && timeRemaining.seconds > 0)
			parts.push(`${timeRemaining.seconds}s`);

		return parts.join(" ") || "Less than 1s";
	};

	const isExpired = endDate ? endDate.getTime() <= Date.now() : false;

	return (
		<Card
			className={cn(
				"group transition-all duration-200",
				isExpired && "opacity-75"
			)}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<CardTitle className="text-lg font-semibold line-clamp-2">
						{title}
					</CardTitle>
					<Badge
						variant={
							isActive && !isExpired ? "default" : "secondary"
						}
						className={cn(
							"ml-2 flex-shrink-0",
							isActive &&
								!isExpired &&
								"bg-green-100 text-green-800"
						)}
					>
						{isActive && !isExpired ? "Active" : "Completed"}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground line-clamp-2 mt-2">
					{description}
				</p>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="space-y-4">
					{/* Countdown Timer */}
					{endDate && isActive && !isExpired && (
						<div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
							<Clock className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium text-blue-900">
								Voting ends in: {formatTimeRemaining()}
							</span>
						</div>
					)}

					{isExpired && (
						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<TrendingUp className="h-4 w-4 text-gray-600" />
							<span className="text-sm font-medium text-gray-700">
								Voting has ended
							</span>
						</div>
					)}

					<Separator />

					{/* Action Button */}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								className={cn(
									"w-full",
									isActive && !isExpired
										? "bg-blue-600 hover:bg-blue-700"
										: "bg-gray-600 hover:bg-gray-700"
								)}
								disabled={isExpired}
							>
								{isActive && !isExpired ? (
									<>
										<CircleCheckBig className="mr-2 h-4 w-4" />
										Vote Now
									</>
								) : (
									<>
										<TrendingUp className="mr-2 h-4 w-4" />
										View Results
									</>
								)}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<VotePoll pollId={id} />
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
}
