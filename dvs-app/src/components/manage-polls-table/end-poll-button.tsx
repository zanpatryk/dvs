import { Button } from "@/components/ui/button";
import { useEndPollContractMutation } from "@/hooks/use-contract-query";
import { useEndPollMutation } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const EndPollButton = ({ pollId }: { pollId: string }) => {
	const dbMutation = useEndPollMutation();
	const contractMutation = useEndPollContractMutation();

	async function handleEndPoll() {
		await contractMutation.mutateAsync(BigInt(pollId));

		if (contractMutation.isError) {
			console.error(
				"Error ending poll on contract:",
				contractMutation.error
			);
			return;
		}

		dbMutation.mutate(pollId);
	}

	return (
		<Button
			className="bg-red-500 hover:bg-red-600 w-20"
			onClick={handleEndPoll}
		>
			{dbMutation.isPending ? (
				<Loader2 className="animate-spin" />
			) : (
				"Confirm"
			)}
		</Button>
	);
};
