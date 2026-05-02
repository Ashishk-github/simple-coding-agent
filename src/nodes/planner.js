import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import { PlannerOutputSchema } from "../schemas.js";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.3-70b-versatile", // High-performing model on Groq
});

/**
 * Planner node: Analyzes the prompt and creates a development plan.
 */
export async function planner(state) {
  console.log("--- PLANNER ---");
  const { prompt } = state;

  const systemPrompt = `You are an expert software planner. Your task is to take users prompt and create a detailed plan for development of the application.
    Your scope of work is to create a detailed description of the application including all the features, pages, forms, tables, UI/UX and everything required for the application development.
    The output should be such that the architect can understand it and create a detailed HLD for the application.
    Example:
    "build me a stylish calculator"
    Output: The user wants a calculator with a stylish interface. 
    Pages required are home page, which includes the calculator interface. 
    Forms required are none. 
    Tables required are none. 
    UI/UX should be modern and stylish.
    All basic arithmetic operations should be supported.
  `;

  const structuredModel = model.withStructuredOutput(PlannerOutputSchema);
  const response = await structuredModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  const plan = response;

  return {
    plan: plan?.description,
    status: "Plan created successfully.",
  };
}
