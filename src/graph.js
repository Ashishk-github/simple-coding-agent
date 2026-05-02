import { StateGraph, START, END } from "@langchain/langgraph";
import { AppState } from "./state.js";
import { planner } from "./nodes/planner.js";
import { architect } from "./nodes/architect.js";
import { coder } from "./nodes/coder.js";

/**
 * Build the LangGraph.
 */
const workflow = new StateGraph(AppState)
  .addNode("planner", planner)
  .addNode("architect", architect)
  .addNode("coder", coder)
  .addEdge(START, "planner")
  .addEdge("planner", "architect")
  .addEdge("architect", "coder")
  .addEdge("coder", END);

export const graph = workflow.compile();
