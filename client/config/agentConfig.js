// Lightweight agent configuration for faster responses
export const agentConfig = {
  maxTokens: 1500,
  temperature: 0.1,
  streaming: true,
  timeout: 30000, // 30s for Claude responses
  maxRetries: 2,
  model: "claude-sonnet-4-20250514", // Claude Sonnet 4
};
