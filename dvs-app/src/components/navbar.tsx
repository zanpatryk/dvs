import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const Navbar = () => {
	const { address } = useAccount();
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();
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
			{address ? (
				<>
					<Button
						className="hover:text-orange-500 transition-color duration-300"
						onClick={() => {
							disconnect();
						}}
					>
						Disconnect
					</Button>
					<Link to="/dashboard">
						<Button size="icon">
							<LayoutGrid />
						</Button>
					</Link>
				</>
			) : (
				<Button
					className="hover:text-orange-500 transition-color duration-300"
					onClick={() => {
						connect({ connector: connectors[0] });
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
