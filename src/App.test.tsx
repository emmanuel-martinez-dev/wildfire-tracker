import { expect, it } from "vitest";
import { render, screen } from "./utils/test-utils";
import App from "./App";

it("Should return correct heading", () => {
	render(<App />);

	expect(
		screen.getByRole("heading", {
			name: "Hello Vite + React!",
			level: 1,
		}),
	).toBeDefined();
});

it("Should return a list with a wildfire", async () => {
	render(<App />);

	expect(await screen.findByRole("list")).toBeDefined();
	expect(await screen.findByText("Deer Creek Fire")).toBeDefined();
});
