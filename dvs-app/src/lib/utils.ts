import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("pl-PL", {
		dateStyle: "short",
		timeStyle: "short",
		timeZone: "Europe/Warsaw",
	}).format(date);
}

export const formatAddress = (address: string) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
