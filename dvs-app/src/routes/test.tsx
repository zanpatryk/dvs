import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";
import { useMetaMaskAuth } from "@/hooks/use-metamask-auth";
import { useProtectedQuery } from "@/hooks/use-protected-query";
import { useRefreshToken } from "@/hooks/use-refresh-token";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		login,
		isPending: loggingIn,
		error: loginError,
		address,
	} = useMetaMaskAuth();
	const {
		data: protectedData,
		isLoading: loadingData,
		error: protectedError,
		refetch: refetchProtected,
	} = useProtectedQuery();
	const { mutate: refresh, isPending: refreshing } = useRefreshToken();
	const { mutate: logout, isPending: loggingOut } = useLogout();
	return (
		<div style={{ padding: 20 }}>
			<h1>MetaMask JWT Auth Demo</h1>

			{/* If not connected, show login Button */}
			{!address ? (
				<Button onClick={() => login()} disabled={loggingIn}>
					{loggingIn
						? "Connecting..."
						: "Connect & Login with MetaMask"}
				</Button>
			) : (
				<div>
					<p>
						<strong>Logged in as:</strong> {address}
					</p>

					{/* Fetch protected resource */}
					<Button
						onClick={() => refetchProtected()}
						disabled={loadingData}
					>
						{loadingData
							? "Loading..."
							: "Fetch Protected Resource"}
					</Button>
					{protectedError && (
						<p style={{ color: "red" }}>
							Error: {protectedError.message}
						</p>
					)}
					{protectedData && (
						<div>
							<h3>Protected Data:</h3>
							<pre>{JSON.stringify(protectedData, null, 2)}</pre>
						</div>
					)}

					{/* Refresh token */}
					<Button onClick={() => refresh()} disabled={refreshing}>
						{refreshing ? "Refreshing..." : "Refresh Token"}
					</Button>

					{/* Logout */}
					<Button onClick={() => logout()} disabled={loggingOut}>
						{loggingOut ? "Logging out..." : "Logout"}
					</Button>
				</div>
			)}

			{loginError && (
				<p style={{ color: "red" }}>
					Login Error: {loginError.message}
				</p>
			)}
		</div>
	);
}
