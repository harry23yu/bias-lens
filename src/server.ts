// Local entry point. Reads ANTHROPIC_API_KEY from the environment (see src/llm/anthropic-adapter.ts).
// Run with: npm run dev

import { createApp } from "./api/app";
import { createAnthropicAdapter } from "./llm/anthropic-adapter";

// Placeholder category list. The real bias categories are not decided yet (docs/requirements.md, open question 4).
const categories = [
  {
    id: "cultural-bias",
    description: "Comments on a client's background, identity, or accent instead of the presenting concern.",
  },
];

const app = createApp({ adapter: createAnthropicAdapter(process.env), categories });
const port = Number(process.env.PORT ?? 3000);

app.listen(port, "127.0.0.1", () => {
  console.log(`Bias Lens API listening on http://127.0.0.1:${port}`);
});
