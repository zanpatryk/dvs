import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useMetaMask } from "@/hooks/use-meta-mask";
import { Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";

const Navbar = () => {
	const { login, logout } = useMetaMask();
	const { data, isPending, error } = useAuth();

	if (isPending) return <Skeleton className="h-4" />;
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<nav className="flex justify-evenly items-center h-24 p-4 backdrop-blur-sm">
			<img src="/dvs.svg" alt="Logo" className="h-full" />
			<Link to="/" className="text-2xl font-bold">
				Home
			</Link>
			<Link to="/about" className="text-2xl font-bold">
				About
			</Link>
			<Link to="/contact" className="text-2xl font-bold">
				Contact
			</Link>
			{data?.address ? (
				<>
					<Button
						className="hover:text-orange-500 transition-color duration-300"
						onClick={() => {
							logout();
						}}
					>
						Disconnect
					</Button>
					<Link to="/dashboard/polls">
						<Button size="icon">
							<LayoutGrid />
						</Button>
					</Link>
				</>
			) : (
				<Button
					className="hover:text-orange-500 transition-color duration-300"
					onClick={() => {
						login();
					}}
				>
					<img
						src="/metamask.svg"
						alt="MetaMask"
						className="h-6 mr-1"
					/>
					Connect with MetaMask
				</Button>
			)}
		</nav>
	);
};

export default Navbar;
