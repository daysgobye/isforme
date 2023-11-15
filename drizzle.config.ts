import type { Config } from "drizzle-kit";

export default {
    schema: "./src/page/schema.ts",
    out: "./drizzle",
    driver: "d1"
} satisfies Config;