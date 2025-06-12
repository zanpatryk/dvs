import { VotingSystemAbi as abi, VotingSystemContract } from "@/lib/abi";
import { getEthereumProvider } from "@/lib/ethereum";
import {
	queryOptions,
	useMutation,
	useQueries,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { ethers, EventLog } from "ethers";
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

	const tx = await contract.grantUserRole(address);

	await tx.wait();

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

async function getTotalPolls(contract?: VotingSystemContract) {
	if (!contract) {
		throw new Error("Contract not initialized");
	}

	return await contract.totalPolls();
}

export const totalPollsQueryOptions = (contract?: VotingSystemContract) =>
	queryOptions({
		queryKey: ["total-polls"],
		queryFn: () => getTotalPolls(contract),
		staleTime: 5 * 60 * 1000,
		enabled: !!contract,
	});

export function useCreatePollContractMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			title,
			options,
			duration,
			maxUses,
		}: {
			title: string;
			options: string[];
			duration: bigint;
			maxUses: bigint;
		}) => {
			const contract = queryClient.getQueryData<VotingSystemContract>([
				"contract",
			]);
			if (!contract) throw new Error("Contract not initialized");

			const tx = await contract.createPoll(
				title,
				options,
				duration,
				maxUses
			);

			// return await tx.wait();
			const receipt = await tx.wait();
			console.log(receipt);

			const PollCreatedEventArgs = (
				receipt?.logs.find(
					(log) => (log as EventLog).eventName === "PollCreated"
				) as EventLog
			).args.toArray();

			const AccessCodeGeneratedEventArgs = (
				receipt?.logs.find(
					(log) =>
						(log as EventLog).eventName === "AccessCodeGenerated"
				) as EventLog
			).args.toArray();

			const pollId = PollCreatedEventArgs[0] as bigint;
			const pollAddress = PollCreatedEventArgs[1] as string;
			const accessCode = AccessCodeGeneratedEventArgs[1] as string;

			return { pollId, pollAddress, accessCode };
		},
		onSuccess: (data) => {
			toast.success(
				`Poll with ID: ${data.pollId} created successfully!\n Address: ${data.pollAddress}\n Access Code: ${data.accessCode}`
			);
		},
		onError: (error: Error) => {
			console.error("Failed to create poll:", error);
			toast.error(`Failed to create poll: ${error.message}`);
		},
	});
}

// export function useStartPollContractMutation() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (pollId: bigint) => {
// 			const contract = queryClient.getQueryData<VotingSystemContract>([
// 				"contract",
// 			]);
// 			if (!contract) throw new Error("Contract not initialized");

// 			const tx = await contract.startPoll(pollId);
// 			return await tx.wait();
// 		},
// 		onSuccess: () => {
// 			toast.success("Poll started successfully");
// 			queryClient.invalidateQueries({ queryKey: ["get-polls"] });
// 		},
// 		onError: (error: Error) => {
// 			console.error("Failed to start poll:", error);
// 			toast.error(`Failed to start poll: ${error.message}`);
// 		},
// 	});
// }

export function useJoinPollContractMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (accessCode: string) => {
			const contract = queryClient.getQueryData<VotingSystemContract>([
				"contract",
			]);
			if (!contract) throw new Error("Contract not initialized");

			const tx = await contract.joinPoll(accessCode);
			return await tx.wait();
		},
		onSuccess: () => {
			toast.success("Joined poll successfully via contract");
			queryClient.invalidateQueries({ queryKey: ["get-polls"] });
		},
		onError: (error: Error) => {
			console.error("Failed to join poll:", error);
			toast.error(`Failed to join poll: ${error.message}`);
		},
	});
}

export function useCastVoteContractMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			pollId,
			optionIndex,
		}: {
			pollId: bigint;
			optionIndex: bigint;
		}) => {
			const contract = queryClient.getQueryData<VotingSystemContract>([
				"contract",
			]);
			if (!contract) throw new Error("Contract not initialized");

			const tx = await contract.castVote(pollId, optionIndex);
			return await tx.wait();
		},
		onSuccess: (_, variables) => {
			toast.success("Vote cast successfully");

			queryClient.invalidateQueries({ queryKey: ["get-polls"] });
			queryClient.invalidateQueries({
				queryKey: ["user-vote-status", variables.pollId.toString()],
			});
		},
		onError: (error: Error) => {
			console.error("Failed to cast vote:", error);
			toast.error(`Failed to cast vote: ${error.message}`);
		},
	});
}

async function getUserVoteStatus(
	pollId: bigint,
	userAddress: string,
	contract?: VotingSystemContract
) {
	if (!contract || !userAddress) {
		throw new Error("Contract not initialized or address not provided");
	}

	return await contract.hasUserVoted(pollId, userAddress);
}

export const userVoteStatusQueryOptions = (
	pollId: bigint,
	userAddress: string,
	contract?: VotingSystemContract
) =>
	queryOptions({
		queryKey: ["user-vote-status", pollId.toString(), userAddress],
		queryFn: () => getUserVoteStatus(pollId, userAddress, contract),
		staleTime: 5 * 60 * 1000,
		enabled: !!userAddress && !!contract && pollId > 0n,
	});

export function useUserVoteStatus(pollId: bigint, userAddress: string) {
	const { data: contract } = useContract();

	return useQuery(userVoteStatusQueryOptions(pollId, userAddress, contract));
}

export function useMultipleUserVoteStatus(
	pollIds: bigint[],
	userAddress: string
) {
	const { data: contract } = useContract();

	return useQueries({
		queries: pollIds.map((pollId) =>
			userVoteStatusQueryOptions(pollId, userAddress, contract)
		),
	});
}
