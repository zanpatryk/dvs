import { client } from "@/hono-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ethers } from "ethers";
import { useContract } from "./use-contract";

export function useMetaMask() {
  const queryClient = useQueryClient();
  const contractContext = useContract();
  const navigate = useNavigate();
  const VOTING_SYSTEM_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const VOTING_SYSTEM_ABI = [
    { type: "constructor", inputs: [], stateMutability: "nonpayable" },
    {
      type: "function",
      name: "ADMIN_ROLE",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "DEFAULT_ADMIN_ROLE",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "MANAGER_ROLE",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "USER_ROLE",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "castVote",
      inputs: [
        { name: "_pollId", type: "uint256", internalType: "uint256" },
        { name: "_option", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "changeUserRole",
      inputs: [
        { name: "_account", type: "address", internalType: "address" },
        { name: "_role", type: "bytes32", internalType: "bytes32" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createPoll",
      inputs: [
        { name: "_title", type: "string", internalType: "string" },
        { name: "_options", type: "string[]", internalType: "string[]" },
        { name: "_duration", type: "uint256", internalType: "uint256" },
        { name: "_maxUses", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "endPoll",
      inputs: [{ name: "_pollId", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getAccessCodePollId",
      inputs: [{ name: "_code", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getPollAddress",
      inputs: [{ name: "_pollId", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getPollsByManager",
      inputs: [{ name: "manager", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getRoleAdmin",
      inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getRoleMember",
      inputs: [
        { name: "role", type: "bytes32", internalType: "bytes32" },
        { name: "index", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getRoleMemberCount",
      inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getRoleMembers",
      inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "grantRole",
      inputs: [
        { name: "role", type: "bytes32", internalType: "bytes32" },
        { name: "account", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "hasRole",
      inputs: [
        { name: "role", type: "bytes32", internalType: "bytes32" },
        { name: "account", type: "address", internalType: "address" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isAdmin",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isManager",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "joinPoll",
      inputs: [{ name: "_code", type: "bytes32", internalType: "bytes32" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "renounceRole",
      inputs: [
        { name: "role", type: "bytes32", internalType: "bytes32" },
        {
          name: "callerConfirmation",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "retrieveResults",
      inputs: [{ name: "pollId", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "revokeRole",
      inputs: [
        { name: "role", type: "bytes32", internalType: "bytes32" },
        { name: "account", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "startPoll",
      inputs: [{ name: "_pollId", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "totalPolls",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "AccessCodeGenerated",
      inputs: [
        {
          name: "pollId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "code",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "maxUses",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "AccessCodesGenerated",
      inputs: [
        {
          name: "pollId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "count",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "JoinedPoll",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "pollId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "PollCreated",
      inputs: [
        {
          name: "pollId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "pollAddress",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "title",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ResultsRetrieved",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "pollId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "tokenId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "RoleAdminChanged",
      inputs: [
        {
          name: "role",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "previousAdminRole",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "newAdminRole",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "RoleGranted",
      inputs: [
        {
          name: "role",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "account",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "sender",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "RoleRevoked",
      inputs: [
        {
          name: "role",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "account",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "sender",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    { type: "error", name: "AccessControlBadConfirmation", inputs: [] },
    {
      type: "error",
      name: "AccessControlUnauthorizedAccount",
      inputs: [
        { name: "account", type: "address", internalType: "address" },
        { name: "neededRole", type: "bytes32", internalType: "bytes32" },
      ],
    },
  ];

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0]; // Use the currently selected account

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(address);

      const votingSystemContract = new ethers.Contract(
        VOTING_SYSTEM_ADDRESS,
        VOTING_SYSTEM_ABI,
        signer
      );

      contractContext.setContract(votingSystemContract);

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
