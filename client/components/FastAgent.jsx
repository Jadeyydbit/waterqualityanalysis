import React, { useState, useCallback, useMemo } from 'react';
import { useAgentStream } from '@/hooks/useAgentStream';
import { getCachedResponse, setCachedResponse } from '@/utils/agentCache';
import { getOptimizedContext, createWaterQualityPrompt } from '@/utils/agentContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export default function FastAgent({ waterQualityData }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const { streamResponse, isStreaming, streamedResponse } = useAgentStream();

  const optimizedContext = useMemo(
    () => getOptimizedContext(waterQualityData || {}),
    [waterQualityData]
  );

  const handleAsk = useCallback(async () => {
    const q = query.trim();
    if (!q) return;

    const prompt = createWaterQualityPrompt(optimizedContext, q);

    const cached = getCachedResponse(prompt);
    if (cached) {
      setResponse(cached);
      return;
    }

    await streamResponse(prompt);
    // Let next tick capture streamedResponse value
    setTimeout(() => {
      setCachedResponse(prompt, streamedResponse);
      setResponse(streamedResponse);
    }, 0);
  }, [query, optimizedContext, streamResponse, streamedResponse]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fast Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about water quality..."
            className="flex-1 px-3 py-2 border rounded-md"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={isStreaming}>
            {isStreaming ? 'Processing…' : 'Ask'}
          </Button>
        </div>

        <div className="p-4 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
          {isStreaming ? streamedResponse : response}
        </div>
      </CardContent>
    </Card>
  );
}
