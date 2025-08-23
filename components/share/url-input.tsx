"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Link, Sparkles } from "lucide-react"
import { linkParser, type LinkMetadata } from "@/lib/link-parser"

interface UrlInputProps {
  onParsed: (metadata: LinkMetadata) => void
}

export function UrlInput({ onParsed }: UrlInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate URL
      new URL(url)

      const metadata = await linkParser.parseUrl(url)
      onParsed(metadata)
      setUrl("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse URL")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Parse Link Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading || !url}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Parse Link
            </Button>
            <Button type="button" variant="outline" disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Parse
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
