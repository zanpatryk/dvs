import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
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
			<Button className="hover:text-orange-500 transition-color duration-300">
				<img src="/metamask.svg" alt="MetaMask" className="h-6 mr-1" />
				Connect with MetaMask
			</Button>
		</nav>
	);
};

export default Navbar;
