import { Button } from "@/components/ui/button";
import { useEndPollMutation } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const EndPollButton = ({ pollId }: { pollId: string }) => {
	const mutation = useEndPollMutation(pollId);

	return (
		<Button
			className="bg-red-500 hover:bg-red-600 w-20"
			onClick={() => mutation.mutate()}
		>
			{mutation.isPending ? (
				<Loader2 className="animate-spin" />
			) : (
				"Confirm"
			)}
		</Button>
	);
};
