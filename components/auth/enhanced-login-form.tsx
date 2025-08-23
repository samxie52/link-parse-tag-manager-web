"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/api/auth-service" // Import authService
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Mail, Lock, Phone, MessageSquare, QrCode, ArrowLeft, Eye, EyeOff } from "lucide-react"

type AuthMode = "login" | "register" | "reset"
type LoginMethod = "email" | "phone" | "wechat"

export function EnhancedLoginForm() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email")
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+86")
  const [smsCode, setSmsCode] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // SMS states
  const [smsSent, setSmsSent] = useState(false)
  const [smsCountdown, setSmsCountdown] = useState(0)

  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch - wait for both mounting and translation ready
  if (!mounted || !ready) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  // SMS countdown timer
  const startSmsCountdown = () => {
    setSmsSent(true)
    setSmsCountdown(60)
    const timer = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setSmsSent(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendSms = async () => {
    if (!phone) {
      setError(t("pleaseEnterPhone"))
      return
    }
    // Mock SMS sending
    setError("")
    setSuccess(t("smsSent"))
    startSmsCountdown()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 使用useAuth hook的login方法，这会自动更新AuthProvider状态
      await login(email, password);
      
      // 登录成功，跳转到首页
      console.log('登录成功，跳转到首页');
      router.push("/");
      
    } catch (err) {
      console.error('登录失败:', err);
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!smsCode) {
      setError(t("pleaseEnterSmsCode"))
      return
    }
    // Mock phone login
    try {
      await login(`${countryCode}${phone}`, smsCode)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loginFailed"))
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!agreeTerms) {
      setError(t("pleaseAgreeTerms"))
      return
    }

    if (loginMethod === "email" && password !== confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    if (loginMethod === "phone" && !smsCode) {
      setError(t("pleaseEnterSmsCode"))
      return
    }

    try {
      // 真实的注册API调用
      if (loginMethod === "email") {
        await authService.register({
          platformType: "web",
          registerType: "email",
          username: email.split('@')[0], // 从邮箱提取用户名
          email: email,
          password: password
        })
      } else if (loginMethod === "phone") {
        // 手机号注册逻辑
        await authService.phoneLogin(`${countryCode}${phone}`, smsCode)
      }
      
      setSuccess(t("registrationSuccess"))
      setTimeout(() => {
        setAuthMode("login")
        setSuccess("")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : t("registrationFailed"))
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (loginMethod === "email" && !email) {
      setError(t("pleaseEnterEmail"))
      return
    }

    if (loginMethod === "phone" && !phone) {
      setError(t("pleaseEnterPhone"))
      return
    }

    try {
      // 真实的密码重置API调用
      if (loginMethod === "email") {
        await authService.resetPassword(email)
      } else if (loginMethod === "phone") {
        // 手机号重置密码：先发送验证码，用户需要在后续流程中使用验证码重置
        await authService.sendVerificationCode(`${countryCode}${phone}`)
      }
      
      setSuccess(t("resetEmailSent"))
      setTimeout(() => {
        setAuthMode("login")
        setSuccess("")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : t("resetPasswordFailed"))
    }
  }

  const renderWeChatQR = () => (
    <div className="flex flex-col items-center space-y-4 py-8">
      <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <QrCode className="w-24 h-24 text-gray-400" />
      </div>
      <p className="text-sm text-muted-foreground text-center">{t("wechatScanTip")}</p>
      <Button variant="outline" onClick={() => setLoginMethod("email")}>
        {t("useOtherMethod")}
      </Button>
    </div>
  )

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="demo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {(authMode === "login" || authMode === "register") && (
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {authMode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}

      {authMode === "login" && (
        <div className="flex justify-end">
          <Button type="button" variant="link" className="px-0 text-sm" onClick={() => setAuthMode("reset")}>
            {t("forgotPassword")}
          </Button>
        </div>
      )}
    </div>
  )

  const renderPhoneForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phoneNumber")}</Label>
        <div className="flex space-x-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+86">+86</SelectItem>
              <SelectItem value="+1">+1</SelectItem>
              <SelectItem value="+44">+44</SelectItem>
              <SelectItem value="+81">+81</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="13800138000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="smsCode">{t("smsCode")}</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="smsCode"
              type="text"
              placeholder={t("enterSmsCode")}
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              className="pl-10"
              maxLength={6}
              required
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSendSms}
            disabled={smsSent || !phone}
            className="whitespace-nowrap bg-transparent"
            suppressHydrationWarning
          >
            {smsSent ? `${smsCountdown}s` : t("sendSms")}
          </Button>
        </div>
      </div>
    </div>
  )

  const getSubmitHandler = () => {
    if (authMode === "register") return handleRegister
    if (authMode === "reset") return handlePasswordReset
    if (loginMethod === "phone") return handlePhoneLogin
    return handleSubmit
  }

  const getSubmitText = () => {
    if (authMode === "register") return t("register")
    if (authMode === "reset") return t("resetPassword")
    return t("signIn")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          {authMode !== "login" && (
            <Button variant="ghost" size="sm" onClick={() => setAuthMode("login")} className="p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <CardTitle className="heading text-2xl">
              {authMode === "login" && t("welcomeBack")}
              {authMode === "register" && t("createAccount")}
              {authMode === "reset" && t("resetPassword")}
            </CardTitle>
          </div>
          <div className="w-8" />
        </div>
        <CardDescription className="body-text text-center">
          {authMode === "login" && t("signInDescription")}
          {authMode === "register" && t("registerDescription")}
          {authMode === "reset" && t("resetDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authMode === "login" && (
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as LoginMethod)} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">{t("email")}</TabsTrigger>
              <TabsTrigger value="phone">{t("phone")}</TabsTrigger>
              <TabsTrigger value="wechat">{t("wechat")}</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-4">
              <form onSubmit={getSubmitHandler()} className="space-y-4">
                {renderEmailForm()}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t("loading") : getSubmitText()}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="mt-4">
              <form onSubmit={getSubmitHandler()} className="space-y-4">
                {renderPhoneForm()}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t("loading") : getSubmitText()}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="wechat" className="mt-4">
              {renderWeChatQR()}
            </TabsContent>
          </Tabs>
        )}

        {authMode !== "login" && (
          <div className="mb-4">
            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as LoginMethod)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">{t("email")}</TabsTrigger>
                <TabsTrigger value="phone">{t("phone")}</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-4">
                <form onSubmit={getSubmitHandler()} className="space-y-4">
                  {renderEmailForm()}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? t("loading") : getSubmitText()}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="mt-4">
                <form onSubmit={getSubmitHandler()} className="space-y-4">
                  {renderPhoneForm()}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? t("loading") : getSubmitText()}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {authMode === "register" && (
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
            <Label htmlFor="terms" className="text-sm">
              {t("agreeToTerms")}{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                {t("userAgreement")}
              </Button>
            </Label>
          </div>
        )}

        {(error || success) && (
          <Alert variant={error ? "destructive" : "default"} className="mb-4" suppressHydrationWarning>
            <AlertDescription>{error || success}</AlertDescription>
          </Alert>
        )}

        {authMode === "login" && (
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setAuthMode("register")} className="text-sm">
              {t("noAccount")} {t("registerNow")}
            </Button>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">{t("demoCredentials")}</div>
      </CardContent>
    </Card>
  )
}
