import { test, expect, beforeEach } from "bun:test";
import { render, waitFor } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../src/components/theme-provider";
import { Window } from "happy-dom";
import React from "react";

beforeEach(() => {
	const window = new Window();
	globalThis.window = window as any;
	globalThis.document = window.document;
	globalThis.localStorage = window.localStorage;
	globalThis.matchMedia = window.matchMedia.bind(window);
});

function TestComponent() {
	const { theme, setTheme } = useTheme();

	return (
		<div>
			<span data-testid="theme">{theme}</span>
			<button onClick={() => setTheme("dark")}>Set Dark</button>
		</div>
	);
}

test("uses default theme and changes theme", async () => {
	const { getByTestId, getByText } = render(
		<ThemeProvider defaultTheme="light">
			<TestComponent />
		</ThemeProvider>
	);

	const themeDisplay = getByTestId("theme");
	expect(themeDisplay.textContent).toBe("light");

	// Simulate theme change
	getByText("Set Dark").click();

	// Wait for the re-render
	await waitFor(() => {
		expect(themeDisplay.textContent).toBe("dark");
	});

	// Also verify localStorage and document class
	expect(localStorage.getItem("vite-ui-theme")).toBe("dark");
	expect(document.documentElement.classList.contains("dark")).toBe(true);
});