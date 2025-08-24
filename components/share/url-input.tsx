"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Link, Sparkles } from "lucide-react"
import { parseUrl } from "@/lib/link-parser"
import type { ParseResponse } from "@/lib/api/api-types"

interface UrlInputProps {
  onParsed: (parseResult: ParseResponse) => void
}

export function UrlInput({ onParsed }: UrlInputProps) {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配
  if (!mounted || !ready) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate URL
      new URL(url)

      const result = await parseUrl(url)
      onParsed(result)
      setUrl("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToParseUrl"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          <span suppressHydrationWarning>{t("parseLinkContent")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" suppressHydrationWarning>{t("url")}</Label>
            <Input
              id="url"
              type="url"
              placeholder={t("urlPlaceholder")}
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
              <span suppressHydrationWarning>{t("parseLink")}</span>
            </Button>
            <Button type="button" variant="outline" disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span suppressHydrationWarning>{t("aiParse")}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
