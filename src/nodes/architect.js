import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import { ArchitectOutputSchema } from "../schemas.js";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.3-70b-versatile",
});

/**
 * Architect node: Defines the file structure and technology stack based on the plan.
 */
export async function architect(state) {
  console.log("--- ARCHITECT ---");
  const { plan } = state;

const systemPrompt = `
You are a software architect.

Generate a file structure for a simple HTML/CSS/JavaScript web app based on the user's plan.

Rules:
- Output must be a JSON array.
- Each item must contain:
  - filename
  - content
- No markdown
- No explanation
- No XML tags
- No extra text

Example:
{
files:[
  {
    "filename": "index.html",
    "content": "Main entry page linked to style.css and script.js"
  }
]
}
`;

  const structuredModel = model.withStructuredOutput(ArchitectOutputSchema);
  const response = await structuredModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(plan),
  ]);

  const fileList = response;

  return {
    architecture: fileList?.files,
    status: "Architecture defined.",
  };
}
