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
    "function createPoll(string _title, string[] _options, uint256 _duration, uint256 _maxUses) external",
    "function startPoll(uint256 _pollId) external",
    "function castVote(address _voter, uint256 _option) external",
    "function joinPoll(bytes32 _code) external",
    "function endPoll(uint256 _pollId) external",
    "function getPollsByManager(address manager) external view returns (uint256[])",
    "function getAccessCodePollId(bytes32 _code) external view returns (uint256)",

    // roles:
    "function hasRole(bytes32 role, address account) public view returns (bool)",
    "function MANAGER_ROLE() public pure returns (bytes32)",
    "function USER_ROLE() public pure returns (bytes32)",
    "function ADMIN_ROLE() public pure returns (bytes32)",
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

      const USER_ROLE = await votingSystemContract.USER_ROLE();
      const ADMIN_ROLE = await votingSystemContract.ADMIN_ROLE();

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
