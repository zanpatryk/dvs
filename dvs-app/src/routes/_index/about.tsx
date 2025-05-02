import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_index/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">
						About This Application
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-base leading-relaxed">
					<p>
						The Decentralized Voting System (DVS) is designed to
						deliver a secure, transparent, and tamper-proof platform
						for voting processes using blockchain technology. By
						decentralizing the core functionalities of voting, the
						system ensures that no single authority can manipulate
						the outcome or control the process.
					</p>
					<p>
						At its core, DVS uses smart contracts to manage
						elections, votes, and user authentication. The
						architecture promotes trustless interaction between
						participants by recording all data immutably on the
						blockchain.
					</p>
					<p>
						Voters can authenticate using their MetaMask wallets,
						guaranteeing a cryptographic identity that preserves
						anonymity while ensuring legitimacy. The interface is
						designed to be intuitive, lightweight, and accessible to
						both technical and non-technical users.
					</p>
					<p>
						Our mission is to empower democratic engagement by
						providing a robust, decentralized alternative to
						traditional voting methods that are prone to security
						vulnerabilities and centralization risks.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
