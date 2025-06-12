import { getEthereumProvider } from "@/lib/ethereum";
import { client } from "@/lib/hono-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useMetaMask() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: async () => {
			if (typeof window === "undefined" || !window.ethereum) {
				throw new Error("Ethereum provider not available");
			}

			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			const address = accounts[0]; // Use the currently selected account

			const provider = await getEthereumProvider();

			if (!provider) {
				throw new Error("Ethereum provider not initialized");
			}

			const signer = await provider.getSigner(address);

			const nonceRes = await client.auth.nonce[":address"].$get({
				param: {
					address,
				},
			});

			if (!nonceRes.ok) {
				throw new Error("Failed to fetch nonce");
			}

			const { nonce } = await nonceRes.json();

			const signature = await signer.signMessage(nonce);

			const loginRes = await client.auth.login.$post({
				json: {
					address,
					signature,
				},
			});

			if (!loginRes.ok) {
				const data = await loginRes.json();
				throw new Error(data.error);
			}
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["auth", "me"],
			});
		},
		onError(error) {
			console.error(error.message);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			const res = await client.auth.logout.$post();
			if (!res.ok) throw new Error("Failed to logout");
		},
		onSettled() {
			queryClient.clear();
			navigate({ to: "/" });
		},
		onError(error) {
			console.error(error.message);
		},
	});

	return {
		login: loginMutation.mutate,
		logout: logoutMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		isLoggingOut: logoutMutation.isPending,
		loginError: loginMutation.error,
		logoutError: logoutMutation.error,
	};
}
