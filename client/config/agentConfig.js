// Lightweight agent configuration for faster responses
export const agentConfig = {
  maxTokens: 1500,
  temperature: 0.1,
  streaming: true,
  timeout: 10000,
  maxRetries: 2,
  model: "fast-local", // placeholder model label; replace with your provider key if needed
};
