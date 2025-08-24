# Integration Examples

This document shows how to integrate the LinkParseResultDialog into different parts of your application.

## 1. Basic Page Integration

```tsx
// pages/link-parser.tsx or app/link-parser/page.tsx
import { LinkParserExample } from '@/components/link-parser/examples/LinkParserExample';

export default function LinkParserPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Link Parser</h1>
      <LinkParserExample />
    </div>
  );
}
```

## 2. Integration with Existing Form

```tsx
// components/ContentForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkParseResultDialog } from '@/components/link-parser';
import { parseUrl } from '@/lib/link-parser';

export function ContentForm() {
  const [url, setUrl] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleQuickParse = async () => {
    if (url) {
      const result = await parseUrl(url);
      setParseResult(result);
      setShowDialog(true);
    }
  };

  return (
    <form className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Content URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="button" onClick={handleQuickParse}>
          Parse
        </Button>
      </div>
      
      {/* Other form fields */}
      
      <LinkParseResultDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        data={parseResult}
        editable={true}
        onSave={async (data) => {
          // Use parsed data to populate form
          setUrl(data.basic?.url || url);
          setShowDialog(false);
        }}
      />
    </form>
  );
}
```

## 3. Modal Trigger from Button

```tsx
// components/ParseButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
import { LinkParseResultDialog } from '@/components/link-parser';
import { parseUrl } from '@/lib/link-parser';

interface ParseButtonProps {
  url: string;
  onParsed?: (data: any) => void;
}

export function ParseButton({ url, onParsed }: ParseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleParse = async () => {
    setIsLoading(true);
    try {
      const result = await parseUrl(url);
      setParseResult(result);
      setIsOpen(true);
    } catch (error) {
      console.error('Parse failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleParse}
        disabled={isLoading}
      >
        <Link className="h-4 w-4 mr-2" />
        {isLoading ? 'Parsing...' : 'Parse Link'}
      </Button>

      <LinkParseResultDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={parseResult}
        editable={false} // Read-only mode
        onSave={onParsed}
      />
    </>
  );
}
```

## 4. List Item with Parse Action

```tsx
// components/LinkList.tsx
import { ParseButton } from './ParseButton';

interface LinkItem {
  id: string;
  url: string;
  title: string;
}

export function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div key={link.id} className="flex items-center justify-between p-3 border rounded">
          <div>
            <div className="font-medium">{link.title}</div>
            <div className="text-sm text-gray-500">{link.url}</div>
          </div>
          <ParseButton 
            url={link.url}
            onParsed={(data) => {
              console.log('Parsed data for', link.id, data);
            }}
          />
        </div>
      ))}
    </div>
  );
}
```

## 5. Bulk Parse Operation

```tsx
// components/BulkParser.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LinkParseResultDialog } from '@/components/link-parser';
import { parseUrl } from '@/lib/link-parser';

export function BulkParser({ urls }: { urls: string[] }) {
  const [results, setResults] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processBatch = async () => {
    setIsProcessing(true);
    const newResults = [];
    
    for (let i = 0; i < urls.length; i++) {
      try {
        const result = await parseUrl(urls[i]);
        newResults.push(result);
        setProgress(((i + 1) / urls.length) * 100);
      } catch (error) {
        console.error(`Failed to parse ${urls[i]}:`, error);
      }
    }
    
    setResults(newResults);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={processBatch} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : `Parse ${urls.length} URLs`}
        </Button>
        {isProcessing && <Progress value={progress} className="flex-1" />}
      </div>

      {results.length > 0 && (
        <div className="grid gap-2">
          {results.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">{result.basic?.title || 'No title'}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCurrentResult(result);
                  setShowDialog(true);
                }}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      )}

      <LinkParseResultDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        data={currentResult}
        editable={true}
      />
    </div>
  );
}
```

## 6. Context Menu Integration

```tsx
// components/ContextMenu.tsx
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { LinkParseResultDialog } from '@/components/link-parser';
import { parseUrl } from '@/lib/link-parser';

export function LinkContextMenu({ children, url }: { children: React.ReactNode; url: string }) {
  const [parseResult, setParseResult] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleParse = async () => {
    try {
      const result = await parseUrl(url);
      setParseResult(result);
      setShowDialog(true);
    } catch (error) {
      console.error('Parse failed:', error);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleParse}>
            Parse Link Details
          </ContextMenuItem>
          <ContextMenuItem onClick={() => navigator.clipboard.writeText(url)}>
            Copy URL
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <LinkParseResultDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        data={parseResult}
        editable={false}
      />
    </>
  );
}
```

## 7. Hook-based Integration

```tsx
// hooks/useLinkParser.ts
import { useState, useCallback } from 'react';
import { parseUrl } from '@/lib/link-parser';
import type { ParseResponse } from '@/lib/api/api-types';

export function useLinkParser() {
  const [result, setResult] = useState<ParseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parse = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parseResult = await parseUrl(url);
      setResult(parseResult);
      return parseResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Parse failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isLoading,
    error,
    parse,
    clear
  };
}

// Usage in component:
export function MyComponent() {
  const { result, isLoading, error, parse } = useLinkParser();
  const [showDialog, setShowDialog] = useState(false);

  const handleParseClick = async (url: string) => {
    try {
      await parse(url);
      setShowDialog(true);
    } catch (err) {
      // Error is already set in the hook
    }
  };

  return (
    <>
      {/* Your UI */}
      <LinkParseResultDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        data={result}
        editable={true}
      />
    </>
  );
}
```

## Best Practices

1. **Error Handling**: Always wrap parse calls in try-catch blocks
2. **Loading States**: Show loading indicators during parsing
3. **URL Validation**: Validate URLs before parsing
4. **Memory Management**: Clear results when no longer needed
5. **Accessibility**: Ensure keyboard navigation works
6. **Performance**: Consider debouncing for real-time parsing
7. **Caching**: Cache results for frequently parsed URLs
