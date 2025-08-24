'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Link, AlertCircle } from 'lucide-react';
import { LinkParseResultDialog } from '../LinkParseResultDialog';
import { parseUrl } from '@/lib/link-parser';
import type { ParseResponse } from '@/lib/api/api-types';

/**
 * Example component demonstrating how to use LinkParseResultDialog
 * This shows a complete integration including:
 * - URL input and validation
 * - Loading states
 * - Error handling
 * - Save functionality
 * - Different parse types (basic vs AI-enhanced)
 */
export function LinkParserExample() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Example URLs for testing
  const exampleUrls = [
    {
      label: 'XiaoHongShu Note',
      url: 'https://www.xiaohongshu.com/explore/123456',
      description: 'Test with a XiaoHongShu note link'
    },
    {
      label: 'AMAP Location',
      url: 'https://ditu.amap.com/place/B000A83M9D',
      description: 'Test with an AMAP location link'
    },
    {
      label: 'Generic URL',
      url: 'https://example.com/article',
      description: 'Test with a generic web page'
    }
  ];

  const handleParseUrl = async (urlToParse?: string) => {
    const targetUrl = urlToParse || url;
    if (!targetUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(targetUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseUrl(targetUrl);
      setParseResult(result);
      setIsDialogOpen(true);
      setUrl(targetUrl); // Update input with the parsed URL
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedData: ParseResponse) => {
    setIsSaving(true);
    try {
      // Simulate API call to save the updated data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with saved data
      setParseResult(updatedData);
      
      // In a real app, you would call your save API here:
      // await contentService.updateParseResult(updatedData.id, updatedData);
      
      console.log('Saved parse result:', updatedData);
    } catch (err) {
      console.error('Failed to save:', err);
      throw err; // Re-throw to let the dialog handle the error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Optionally clear the result after closing
    // setParseResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Parser Demo
          </CardTitle>
          <CardDescription>
            Enter a URL to parse and display the results in an interactive dialog.
            Supports XiaoHongShu, AMAP, and generic web pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to parse (e.g., https://www.xiaohongshu.com/explore/123456)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleParseUrl();
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={() => handleParseUrl()} 
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Parsing...
                </>
              ) : (
                'Parse URL'
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Example URLs */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Try these examples:</h4>
            <div className="grid gap-2 md:grid-cols-3">
              {exampleUrls.map((example, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent 
                    className="p-3"
                    onClick={() => handleParseUrl(example.url)}
                  >
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      {example.label}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {example.description}
                    </div>
                    <div className="text-xs text-gray-400 font-mono truncate">
                      {example.url}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Current Result Summary */}
          {parseResult && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      Last Parsed Result
                    </div>
                    <div className="text-xs text-green-600">
                      Platform: {parseResult.platform} | 
                      Type: {parseResult.parse_type} |
                      Title: {parseResult.basic?.title || 'No title'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Link Parse Result Dialog */}
      <LinkParseResultDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        data={parseResult}
        editable={true}
        onSave={handleSave}
        loading={isSaving}
      />
    </div>
  );
}

export default LinkParserExample;
