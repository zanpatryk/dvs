import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { client } from "../hono-client";

export function useMetaMaskAuth() {
	const [address, setAddress] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			if (!window.ethereum) {
				throw new Error("MetaMask is not installed");
			}
			// Request account access
			await window.ethereum.request({ method: "eth_requestAccounts" });

			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const userAddress = await signer.getAddress();
			setAddress(userAddress);

			// 1. Fetch nonce from backend
			// const nonceRes = await fetch(`/api/auth/nonce/${userAddress}`, {
			// 	credentials: "include",
			// });
			const nonceRes = await client.auth.nonce[":address"].$get({
				param: {
					address: userAddress,
				},
			});
			if (!nonceRes.ok) {
				throw new Error("Failed to fetch nonce");
			}
			const { nonce } = await nonceRes.json();

			// 2. Sign the nonce message
			const signature = await signer.signMessage(nonce);

			// 3. Send login request
			// const loginRes = await fetch("/api/auth/login", {
			// 	method: "POST",
			// 	credentials: "include",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify({ address: userAddress, signature }),
			// });
			const loginRes = await client.auth.login.$post({
				json: {
					address: userAddress,
					signature,
				},
			});
			if (!loginRes.ok) {
				const data = await loginRes.json();
				throw new Error(data.error);
			}

			// Invalidate protected queries to use new token
			// await queryClient.invalidateQueries(["protected-resource"]);
			await queryClient.invalidateQueries({
				queryKey: ["protected-resource"],
			});
			return userAddress;
		},
		onError: (error) => console.error(error),
	});

	return {
		login: mutation.mutate, // call this to start login
		isPending: mutation.isPending,
		error: mutation.error,
		address, // currently connected address, or null
	};
}
