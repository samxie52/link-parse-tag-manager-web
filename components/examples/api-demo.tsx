"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { contentService, authService, groupService, type Content } from "@/lib/api"

interface ApiTestResult {
  name: string
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: any
  error?: string
}

export function ApiDemo() {
  const [tests, setTests] = useState<ApiTestResult[]>([
    { name: 'GET /api/v1/protected/contents/13', status: 'idle' },
    { name: 'GET /api/v1/auth/me', status: 'idle' },
    { name: 'GET /api/v1/protected/groups', status: 'idle' },
    { name: 'POST /api/v1/protected/contents/parse', status: 'idle' },
  ])

  const updateTestStatus = (index: number, status: ApiTestResult['status'], data?: any, error?: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, data, error } : test
    ))
  }

  // 测试获取内容详情 - GET /api/v1/protected/contents/13
  const testGetContent = async () => {
    const testIndex = 0
    updateTestStatus(testIndex, 'loading')
    
    try {
      const content = await contentService.getContent(13)
      updateTestStatus(testIndex, 'success', content)
    } catch (error) {
      updateTestStatus(testIndex, 'error', null, error instanceof Error ? error.message : '未知错误')
    }
  }

  // 测试获取当前用户 - GET /api/v1/auth/me
  const testGetCurrentUser = async () => {
    const testIndex = 1
    updateTestStatus(testIndex, 'loading')
    
    try {
      const user = await authService.getCurrentUser()
      updateTestStatus(testIndex, 'success', user)
    } catch (error) {
      updateTestStatus(testIndex, 'error', null, error instanceof Error ? error.message : '未知错误')
    }
  }

  // 测试获取组列表 - GET /api/v1/protected/groups
  const testGetGroups = async () => {
    const testIndex = 2
    updateTestStatus(testIndex, 'loading')
    
    try {
      const groups = await groupService.getGroups({ page: 1, page_size: 10 })
      updateTestStatus(testIndex, 'success', groups)
    } catch (error) {
      updateTestStatus(testIndex, 'error', null, error instanceof Error ? error.message : '未知错误')
    }
  }

  // 测试解析链接 - POST /api/v1/protected/contents/parse
  const testParseUrl = async () => {
    const testIndex = 3
    updateTestStatus(testIndex, 'loading')
    
    try {
      const result = await contentService.parseUrl({
        url: 'https://www.xiaohongshu.com/explore/123456',
        group_id: 1,
        use_ai: false
      })
      updateTestStatus(testIndex, 'success', result)
    } catch (error) {
      updateTestStatus(testIndex, 'error', null, error instanceof Error ? error.message : '未知错误')
    }
  }

  // 运行所有测试
  const runAllTests = async () => {
    await testGetContent()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testGetCurrentUser()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testGetGroups()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testParseUrl()
  }

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusColor = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API集成测试</CardTitle>
          <CardDescription>
            测试前端与后端API的连接状态，确保所有接口正常工作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runAllTests} className="flex-1">
                运行所有测试
              </Button>
              <Button onClick={testGetContent} variant="outline">
                测试获取内容
              </Button>
              <Button onClick={testGetCurrentUser} variant="outline">
                测试用户认证
              </Button>
            </div>

            <div className="space-y-3">
              {tests.map((test, index) => (
                <Card key={index} className={`transition-colors ${getStatusColor(test.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          {test.status === 'loading' && (
                            <p className="text-sm text-muted-foreground">正在请求...</p>
                          )}
                          {test.status === 'success' && (
                            <p className="text-sm text-green-600">请求成功</p>
                          )}
                          {test.status === 'error' && (
                            <p className="text-sm text-red-600">请求失败: {test.error}</p>
                          )}
                        </div>
                      </div>
                      
                      {test.status === 'success' && test.data && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            console.log(`${test.name} 响应数据:`, test.data)
                            alert(`响应数据已输出到控制台`)
                          }}
                        >
                          查看数据
                        </Button>
                      )}
                    </div>

                    {test.status === 'success' && test.data && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(test.data, null, 2).slice(0, 200)}
                          {JSON.stringify(test.data, null, 2).length > 200 && '...'}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>注意：</strong> 确保后端服务运行在 <code>http://localhost:8080</code>，
          并且已经配置了正确的CORS设置以允许前端访问。如果测试失败，请检查：
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>后端服务是否正在运行</li>
            <li>API端点是否正确实现</li>
            <li>JWT token是否有效</li>
            <li>网络连接是否正常</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
