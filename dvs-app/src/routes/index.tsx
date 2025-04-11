import { HyperText } from "@/components/magicui/hyper-text";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="relative overflow-hidden h-svh">
				<Navbar />
				<div className="flex flex-col items-center justify-center gap-6 h-[calc(100svh-6rem)]">
					<HyperText className="text-8xl font-bold ">DVS</HyperText>
					<p className="font-semibold text-3xl text-muted-foreground">
						The first{" "}
						<span className="text-transparent bg-clip-text bg-linear-to-r/increasing from-indigo-500 to-teal-400">
							decentralized voting system
						</span>
					</p>
					<p className="text-muted-foreground text-lg max-w-xl text-justify">
						A <strong>transparent</strong>, <strong>secure</strong>,
						and <strong>tamper-proof</strong> voting platform built
						on <strong>blockchain technology</strong>. Whether
						you're managing a <strong>local election</strong>, a{" "}
						<strong>community poll</strong>, or a{" "}
						<strong>global decision-making process</strong>, our
						system ensures that <strong>every vote counts</strong> —
						and <strong>every voice is heard</strong>.
					</p>
					<p className="text-muted-foreground text-lg max-w-xl text-justify">
						No <strong>central authority</strong>. No{" "}
						<strong>manipulation</strong>. Just{" "}
						<strong>fair, verifiable results</strong> powered by{" "}
						<strong>cryptographic trust</strong>.
					</p>
					<RainbowButton>Get Started</RainbowButton>
				</div>
				<img
					src="/blob1.png"
					className="absolute -top-1/5 -right-1/5 w-1/2 opacity-75 -z-1"
					alt="Background Blob"
				/>
				<img
					src="/blob2.png"
					className="absolute -bottom-4/5 -left-1/5 w-1/2 opacity-75 -z-1"
					alt="Background Blob"
				/>
			</div>
		</ThemeProvider>
	);
}
