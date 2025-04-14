import { Button } from "@/components/ui/button";
import { PollsData } from "@/dummy/data";
import { Upload } from "lucide-react";

const ViewResults = ({ pollId }: { pollId: string }) => {
    const poll = PollsData.find((poll) => poll.id === pollId);

    if (!poll) {
        return <div>Poll not found</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{poll.title}</h1>
            <p className="text-muted-foreground text-sm">
                {poll.description}
            </p>
            <h2 className="text-xl font-bold">To view the results please upload the NFT</h2>
            <Button>
                <Upload />
                Choose File
            </Button>
        </div>
    );
};

export default ViewResults;