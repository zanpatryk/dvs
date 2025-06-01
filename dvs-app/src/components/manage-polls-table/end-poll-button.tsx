import { Button } from "@/components/ui/button";
import { useEndPollMutation } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const EndPollButton = ({
	pollId,
	children,
}: React.PropsWithChildren & { pollId: string }) => {
	const mutation = useEndPollMutation(pollId);

	return (
		<Button
			className="bg-red-500 hover:bg-red-600"
			onClick={() => mutation.mutate()}
		>
			{mutation.isPending ? (
				<Loader2 className="animate-spin" />
			) : (
				children
			)}
		</Button>
	);
};
