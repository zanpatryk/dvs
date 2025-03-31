import { RainbowButton } from "@/components/ui/rainbow-button";
import Navbar from "@/LandingPage/Navbar";

function App() {
	return (
		<>
			<div className="relative overflow-hidden h-svh">
				<Navbar />
				<div className="flex flex-col items-center justify-center space-y-20">
					<h1 className="text-8xl font-bold">Welcome</h1>
					<h1 className="text-5xl font-bold">to the first</h1>
					<div className="text-8xl font-bold">
						<span className="text-transparent bg-clip-text bg-linear-to-r/increasing from-indigo-500 to-teal-400">
							Decentralized Voting System
						</span>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center mt-96 space-y-8">
					<RainbowButton>Get Started</RainbowButton>
				</div>
				<img
					src="/blob1.png"
					className="absolute -top-100 -right-100 w-1/2 opacity-75 -z-1"
					alt="Background Blob"
				/>
				<img
					src="/blob2.png"
					className="absolute -bottom-300 -left-100 w-1/2 opacity-75 -z-1"
					alt="Background Blob"
				/>
			</div>
		</>
	);
}

export default App;
