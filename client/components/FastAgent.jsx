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
        <CardTitle className="text-lg font-semibold">💬 Fast Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about water quality..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleAsk()}
            disabled={isStreaming}
          />
          <Button 
            onClick={handleAsk} 
            disabled={isStreaming || !query.trim()}
            className="px-6 py-2 whitespace-nowrap"
          >
            {isStreaming ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚙️</span>
                Processing…
              </span>
            ) : (
              'Ask Agent'
            )}
          </Button>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg min-h-[150px] max-h-[400px] overflow-y-auto">
          {isStreaming || response || streamedResponse ? (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {isStreaming ? streamedResponse : response}
              </div>
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1"></span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Ask a question about water quality to get AI-powered insights...
            </div>
          )}
        </div>

        {(response || streamedResponse) && !isStreaming && (
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>✓ Response received</span>
            <button
              onClick={() => { setResponse(''); setQuery(''); }}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
