import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useMetaMask } from "@/hooks/use-meta-mask";
import { formatAddress } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, LogOut, User } from "lucide-react";

const Navbar = () => {
	const { login, isLoginPending, logout } = useMetaMask();
	const { data, isPending, isError } = useAuth();

	const handleLogin = async () => {
		login();
	};

	const handleLogout = async () => {
		logout();
	};

	const renderAuthSection = () => {
		// Loading state
		if (isPending || isLoginPending) {
			return (
				<div className="flex items-center gap-2">
					<Skeleton className="h-10 w-32" />
				</div>
			);
		}

		// Error state - treat as not authenticated
		if (isError) {
			return (
				<Button
					className="hover:text-orange-500 transition-color duration-300"
					onClick={handleLogin}
				>
					<img
						src="/metamask.svg"
						alt="MetaMask"
						className="h-6 mr-2"
					/>
					Connect with MetaMask
				</Button>
			);
		}

		// Authenticated state
		if (data?.address) {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-10 w-10 rounded-full"
						>
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={`https://api.dicebear.com/7.x/identicon/svg?seed=${data.address}`}
									alt="User avatar"
								/>
								<AvatarFallback>
									<User className="h-4 w-4" />
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56"
						align="end"
						forceMount
					>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									Wallet Connected
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{formatAddress(data.address)}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link
								to="/dashboard/polls"
								className="cursor-pointer"
							>
								<LayoutGrid className="mr-2 h-4 w-4" />
								Dashboard
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							className="cursor-pointer text-red-600 focus:text-red-600"
						>
							<LogOut className="mr-2 h-4 w-4	text-red-600" />
							Disconnect
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}

		// Not authenticated state
		return (
			<Button
				className="hover:text-orange-500 transition-color duration-300"
				onClick={handleLogin}
			>
				<img src="/metamask.svg" alt="MetaMask" className="h-6 mr-2" />
				Connect with MetaMask
			</Button>
		);
	};

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
			{renderAuthSection()}
		</nav>
	);
};

export default Navbar;
