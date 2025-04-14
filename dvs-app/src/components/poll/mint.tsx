import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Award } from "lucide-react";

const MintNFT = () => {
	return (
		<div className="w-2/3 space-y-6">
			<h1 className="text-2xl font-bold">Poll Title</h1>
			<p className="text-muted-foreground text-sm">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
				eius, praesentium quidem et, illo voluptates dolor voluptatum
				optio temporibus quia sapiente quae explicabo quos eligendi
				consequuntur omnis? Reiciendis, doloribus eos.
			</p>
			<RadioGroup defaultValue="2">
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="1" id="1" disabled />
					<Label htmlFor="1" className="text-muted-foreground">
						Option #1
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="2" id="2" />
					<Label htmlFor="2">Option #2</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="3" id="3" disabled />
					<Label htmlFor="3" className="text-muted-foreground">
						Option #3
					</Label>
				</div>
			</RadioGroup>

			<DialogClose>
				<Button
					className="bg-green-500 hover:bg-green-600"
					onClick={() => console.log("NFT has been minted")}
				>
					<Award />
					Mint participation NFT
				</Button>
			</DialogClose>
		</div>
	);
};
export default MintNFT;
