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
