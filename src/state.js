import { Annotation } from "@langchain/langgraph";

/**
 * Define the state for the app builder graph.
 */
export const AppState = Annotation.Root({
  /**
   * The initial user prompt.
   */
  prompt: Annotation(),
  
  /**
   * The high-level plan created by the planner node.
   */
  plan: Annotation(),
  
  /**
   * The architectural structure (file list, dependencies) created by the architect node.
   */
  architecture: Annotation(),
  
  /**
   * The generated files. A map of filename to content.
   */
  files: Annotation({
    reducer: (state, update) => ({ ...state, ...update }),
    default: () => ({}),
  }),
  
  /**
   * Status message or logs.
   */
  status: Annotation(),
});
