import { ethers } from "ethers";

let providerInstance: ethers.BrowserProvider | null = null;

export async function getEthereumProvider(): Promise<ethers.BrowserProvider | null> {
	try {
		if (typeof window === "undefined" || !window.ethereum) {
			console.warn("Ethereum provider not available");
			return null;
		}

		if (providerInstance) {
			return providerInstance;
		}

		providerInstance = new ethers.BrowserProvider(window.ethereum);

		return providerInstance;
	} catch (error) {
		console.error("Failed to get Ethereum provider:", error);
		return null;
	}
}
