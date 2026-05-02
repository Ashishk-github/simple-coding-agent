import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { graph } from "./graph.js";

dotenv.config();
import fsPromise from "fs/promises";
import prettier from "prettier";

async function formatFile(path) {
  const code = await fsPromise.readFile(path, "utf8");

  const formatted = await prettier.format(code, {
    filepath: path, // detects parser by extension
  });

  await fs.writeFile(path, formatted);
}
/**
 * Main function to run the app builder.
 */
async function main() {
  const prompt = process.argv.slice(2).join(" ") || "build me a stylish calculator";
  
  console.log(`Starting app builder with prompt: "${prompt}"`);

  if (!process.env.GROQ_API_KEY) {
    console.error("Error: GROQ_API_KEY is not set in .env file.");
    process.exit(1);
  }

  const initialState = {
    prompt: prompt,
    files: {},
  };

  try {
    const finalState = await graph.invoke(initialState);
    
    console.log("\n--- BUILD COMPLETE ---");
    console.log(finalState.status);

    const outputDir = path.join(process.cwd(), "output");
    await fs.ensureDir(outputDir);

    for (const [filename, content] of Object.entries(finalState.files)) {
      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, content?.code || "");
      try {
        await formatFile(filePath);
      } catch (error) {
        console.error(`Error formatting ${filename}:`, error);
      }
      console.log(`Saved ${filename} to ${filePath}`);
    }

    console.log(`\nSuccessfully built the app in: ${outputDir}`);
  } catch (error) {
    console.error("An error occurred during the build process:", error);
  }
}

main();
