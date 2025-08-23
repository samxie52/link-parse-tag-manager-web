import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Translation resources
const resources = {
  en: {
    translation: {
      // App Title
      appTitle: "WeChat Link Manager",
      appDescription: "Professional social media content management",

      // Login Page
      welcomeBack: "Welcome Back",
      signInDescription: "Sign in to your WeChat Link Manager account",
      createAccount: "Create Account",
      registerDescription: "Create your WeChat Link Manager account",
      resetPassword: "Reset Password",
      resetDescription: "Enter your email to reset your password",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      phoneNumber: "Phone Number",
      smsCode: "SMS Code",
      enterSmsCode: "Enter SMS code",
      signIn: "Sign In",
      register: "Register",
      phone: "Phone",
      wechat: "WeChat",
      sendSms: "Send SMS",
      forgotPassword: "Forgot password?",
      loginFailed: "Login failed",
      pleaseEnterPhone: "Please enter phone number",
      pleaseEnterEmail: "Please enter email address",
      pleaseEnterSmsCode: "Please enter SMS code",
      pleaseAgreeTerms: "Please agree to the terms",
      passwordMismatch: "Passwords do not match",
      registrationSuccess: "Registration successful!",
      resetEmailSent: "Reset email sent!",
      smsSent: "SMS code sent!",
      wechatScanTip: "Use WeChat to scan the QR code above",
      useOtherMethod: "Use other login method",
      agreeToTerms: "I agree to the",
      userAgreement: "User Agreement",
      noAccount: "Don't have an account?",
      registerNow: "Register now",
      demoCredentials: "Demo credentials: demo@example.com / password",

      // Navigation
      dashboard: "Dashboard",
      share: "Share",
      groups: "Groups",
      profile: "Profile",
      subscription: "Subscription",
      logout: "Logout",

      // Common
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      search: "Search",
      filter: "Filter",
      all: "All",

      // Language
      language: "Language",
      english: "English",
      chinese: "中文",

      // Dashboard
      contentTimeline: "Content Timeline",
      contentTimelineDescription: "Manage your content and track performance in real-time",
      filters: "Filters",
      newContent: "New Content",
      totalLinks: "Total Links",
      aiEnhanced: "AI Enhanced",
      teamMembers: "Team Members",
      activeToday: "Active Today",
      monthlyGrowth: "{{percent}} from last month",
      newThisMonth: "{{count}} new this month",
      dailyGrowth: "{{percent}} from yesterday",
    },
  },
  zh: {
    translation: {
      // App Title
      appTitle: "微信链接管理器",
      appDescription: "专业的社交媒体内容管理平台",

      // Login Page
      welcomeBack: "欢迎回来",
      signInDescription: "登录您的微信链接管理器账户",
      createAccount: "创建账户",
      registerDescription: "创建您的微信链接管理器账户",
      resetPassword: "重置密码",
      resetDescription: "输入您的邮箱来重置密码",
      email: "邮箱",
      password: "密码",
      confirmPassword: "确认密码",
      phoneNumber: "手机号码",
      smsCode: "短信验证码",
      enterSmsCode: "输入短信验证码",
      signIn: "登录",
      register: "注册",
      phone: "手机",
      wechat: "微信",
      sendSms: "发送验证码",
      forgotPassword: "忘记密码？",
      loginFailed: "登录失败",
      pleaseEnterPhone: "请输入手机号码",
      pleaseEnterEmail: "请输入邮箱地址",
      pleaseEnterSmsCode: "请输入短信验证码",
      pleaseAgreeTerms: "请同意用户协议",
      passwordMismatch: "密码不匹配",
      registrationSuccess: "注册成功！",
      resetEmailSent: "重置邮件已发送！",
      smsSent: "验证码已发送！",
      wechatScanTip: "使用微信扫描上方二维码",
      useOtherMethod: "使用其他登录方式",
      agreeToTerms: "我同意",
      userAgreement: "用户协议",
      noAccount: "还没有账户？",
      registerNow: "立即注册",
      demoCredentials: "演示账户：demo@example.com / password",

      // Navigation
      dashboard: "仪表板",
      share: "分享",
      groups: "群组",
      profile: "个人资料",
      subscription: "订阅",
      logout: "退出登录",

      // Common
      loading: "加载中...",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      create: "创建",
      search: "搜索",
      filter: "筛选",
      all: "全部",

      // Language
      language: "语言",
      english: "English",
      chinese: "中文",

      // Dashboard
      contentTimeline: "内容时间线",
      contentTimelineDescription: "管理您的内容并实时跟踪性能",
      filters: "过滤器",
      newContent: "新内容",
      totalLinks: "总链接数",
      aiEnhanced: "AI增强",
      teamMembers: "团队成员",
      activeToday: "今日活跃",
      monthlyGrowth: "{{percent}} 从上个月",
      newThisMonth: "{{count}} 本月新增",
      dailyGrowth: "{{percent}} 从昨天",
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  })

export default i18n
