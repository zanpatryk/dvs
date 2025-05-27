import { client } from "@/hono-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ethers } from "ethers";

export function useMetaMask() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: async () => {
			if (!window.ethereum) {
				throw new Error("MetaMask not installed");
			}
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const address = accounts[0]; // Use the currently selected account

			const provider = new ethers.BrowserProvider(window.ethereum);
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

			await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
		},
		onError(error) {
			console.error(error.message);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			const res = await client.auth.logout.$post();
			if (!res.ok) throw new Error("Failed to logout");
			await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
			navigate({ to: "/" });
		},
		onError(error) {
			console.error(error.message);
		},
	});

	const refreshMutation = useMutation({
		mutationFn: async () => {
			const res = await client.auth.refresh.$post();
			if (!res.ok) throw new Error("Failed to refresh token");
			await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
		},
		onError(error) {
			console.error(error.message);
		},
	});
	return {
		login: loginMutation.mutate,
		isLoginPending: loginMutation.isPending,
		logout: logoutMutation.mutate,
		refresh: refreshMutation.mutate,
	};
}
