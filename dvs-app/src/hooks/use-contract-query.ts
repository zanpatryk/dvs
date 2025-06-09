import { VotingSystemAbi as abi, VotingSystemContract } from "@/lib/abi";
import { getEthereumProvider } from "@/lib/ethereum";
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { ethers } from "ethers";
import { toast } from "sonner";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export enum UserRole {
	User = "user",
	Manager = "manager",
	Admin = "admin",
}

async function initializeContract() {
	if (typeof window === "undefined" || !window.ethereum) {
		throw new Error("Ethereum provider not available - MetaMask required");
	}

	const provider = await getEthereumProvider();

	if (!provider) {
		throw new Error("Failed to get Ethereum provider");
	}

	const signer = await provider.getSigner();
	const contract = new ethers.Contract(
		CONTRACT_ADDRESS,
		abi,
		signer
	) as unknown as VotingSystemContract;

	return contract;
}

export const contractQueryOptions = queryOptions({
	queryKey: ["contract"],
	queryFn: initializeContract,
	staleTime: Infinity,
	retry: 3,
	retryDelay: 1000,
	enabled: typeof window !== "undefined",
});

async function getUserRole(address?: string, contract?: VotingSystemContract) {
	if (!contract || !address) {
		throw new Error("Contract not initialized or address not provided");
	}

	const [isManager, isAdmin] = await Promise.all([
		contract.isManager(address),
		contract.isAdmin(address),
	]);

	if (isAdmin) return UserRole.Admin;
	if (isManager) return UserRole.Manager;
	return UserRole.User;
}

export function useContract() {
	return useQuery(contractQueryOptions);
}

export const userRoleQueryOptions = (
	address?: string,
	contract?: VotingSystemContract
) =>
	queryOptions({
		queryKey: ["user-role", address],
		queryFn: () => getUserRole(address, contract),
		staleTime: 5 * 60 * 1000,
		enabled: !!address && !!contract,
	});

export function useChangeUserRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			userAddress,
			role,
		}: {
			userAddress: string;
			role: UserRole;
		}) => {
			const contract = queryClient.getQueryData<VotingSystemContract>([
				"contract",
			]);

			if (!contract) {
				throw new Error("Contract not initialized");
			}

			// Get role bytes32 value
			let roleBytes32: string;
			switch (role) {
				case UserRole.Admin:
					roleBytes32 = await contract.ADMIN_ROLE();
					break;
				case UserRole.Manager:
					roleBytes32 = await contract.MANAGER_ROLE();
					break;
				case UserRole.User:
				default:
					roleBytes32 = await contract.USER_ROLE();
					break;
			}

			// Call the contract method with proper typing
			const tx = await contract.changeUserRole(userAddress, roleBytes32);

			return await tx.wait();
		},
		onSuccess: (_, variables) => {
			// Invalidate role queries for the specific address
			queryClient.invalidateQueries({
				queryKey: ["user-role", variables.userAddress],
			});
			// Also invalidate current user's role
			queryClient.invalidateQueries({ queryKey: ["user-role"] });
			toast.success(
				`User ${variables.userAddress} role changed successfully to ${variables.role}`
			);
		},
		onError: (error: Error) => {
			console.error("Failed to change user role:", error);
			toast.error(`Failed to change user role: ${error.message}`);
		},
	});
}
