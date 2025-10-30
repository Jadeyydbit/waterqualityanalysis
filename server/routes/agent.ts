import type { RequestHandler } from "express";

// Simple streaming endpoint that simulates fast incremental responses.
// Replace this with a real LLM provider stream if needed.
export const handleAgentStream: RequestHandler = async (req, res) => {
  // Ensure chunked response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("X-Accel-Buffering", "no"); // for some proxies

  const prompt: string = (req.body && req.body.prompt) || "";
  const base = prompt?.slice(0, 200) || "Query";
  const message = `Analyzing: ${base}.\n` +
    "Key insights: water quality parameters assessed.\n" +
    "Actionable guidance follows:\n" +
    "1) Maintain pH within safe range.\n2) Monitor DO and temperature.\n3) Investigate abnormal spikes.\n" +
    "Summary: Provide targeted remediation where thresholds exceed limits.";

  const chunks = message.split(/(\s+)/).filter(Boolean);

  let i = 0;
  const interval = setInterval(() => {
    if (i >= chunks.length) {
      clearInterval(interval);
      res.end();
      return;
    }
    res.write(chunks[i]);
    i += 1;
  }, 25); // small delay for perceived streaming
};

export const handleAgent: RequestHandler = async (req, res) => {
  const prompt: string = (req.body && req.body.prompt) || "";
  // Non-streaming fallback/utility endpoint
  res.json({
    ok: true,
    prompt,
    answer:
      "Quick analysis complete. Keep pH 6.5–8.5, DO > 5 mg/L, and track temperature trends.",
  });
};
