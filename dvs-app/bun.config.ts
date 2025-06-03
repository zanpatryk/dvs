import { defineConfig } from "bun";

export default defineConfig({
  test: {
    environment: "happy-dom", // use HappyDOM for DOM APIs in tests
  },
});