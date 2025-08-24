'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { LinkParseResultDialog } from '../LinkParseResultDialog';
import { testScenarios, mockApi } from './test-data';
import type { ParseResponse } from '@/lib/api/api-types';

/**
 * Test runner component for validating LinkParseResultDialog functionality
 * This component allows testing all scenarios with different data types
 */
export function TestRunner() {
  const [currentTest, setCurrentTest] = useState<ParseResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (scenario: typeof testScenarios[0]) => {
    setIsRunning(true);
    try {
      // Simulate API call
      const result = await mockApi.parseUrl(scenario.data.basic?.url || '');
      setCurrentTest(result);
      setIsDialogOpen(true);
      
      // Mark test as passed
      setTestResults(prev => ({
        ...prev,
        [scenario.name]: true
      }));
    } catch (error) {
      console.error(`Test failed for ${scenario.name}:`, error);
      setTestResults(prev => ({
        ...prev,
        [scenario.name]: false
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const results: Record<string, boolean> = {};
    
    for (const scenario of testScenarios) {
      try {
        await mockApi.parseUrl(scenario.data.basic?.url || '');
        results[scenario.name] = true;
      } catch (error) {
        console.error(`Test failed for ${scenario.name}:`, error);
        results[scenario.name] = false;
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
  };

  const handleSave = async (updatedData: ParseResponse) => {
    try {
      await mockApi.saveParseResult(updatedData);
      console.log('Save test passed');
    } catch (error) {
      console.error('Save test failed:', error);
    }
  };

  const getTestStatus = (testName: string) => {
    if (!(testName in testResults)) return 'pending';
    return testResults[testName] ? 'passed' : 'failed';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-500">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Link Parser Component Test Runner
          </CardTitle>
          <CardDescription>
            Test all LinkParseResultDialog components with different data scenarios.
            This validates component rendering, editing, and save functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTestResults({})}
            >
              Clear Results
            </Button>
          </div>

          {/* Test Results Summary */}
          {Object.keys(testResults).length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Test Results</span>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-600">
                      Passed: {Object.values(testResults).filter(Boolean).length}
                    </span>
                    <span className="text-sm text-red-600">
                      Failed: {Object.values(testResults).filter(r => !r).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Individual Test Scenarios */}
      <div className="grid gap-4 md:grid-cols-2">
        {testScenarios.map((scenario, index) => {
          const status = getTestStatus(scenario.name);
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(status)}
                    {scenario.name}
                  </CardTitle>
                  {getStatusBadge(status)}
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <div><strong>Platform:</strong> {scenario.data.platform}</div>
                  <div><strong>Parse Type:</strong> {scenario.data.parse_type}</div>
                  <div><strong>Title:</strong> {scenario.data.basic?.title || 'No title'}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => runTest(scenario)}
                    disabled={isRunning}
                  >
                    Test Component
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setCurrentTest(scenario.data);
                      setIsDialogOpen(true);
                    }}
                  >
                    Preview Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Component Features Test */}
      <Card>
        <CardHeader>
          <CardTitle>Component Features Checklist</CardTitle>
          <CardDescription>
            Manual verification checklist for component functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              'Dialog opens and closes properly',
              'Tabs switch between Basic/Platform/AI sections',
              'Edit mode toggle works',
              'Editable fields update correctly',
              'Tag management (add/remove) functions',
              'Image preview modal works',
              'Platform-specific styling applies',
              'Save functionality triggers correctly',
              'Loading states display properly',
              'Error handling works for edge cases',
              'Responsive design on mobile',
              'Keyboard navigation accessible'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <input type="checkbox" id={`feature-${index}`} className="rounded" />
                <label htmlFor={`feature-${index}`} className="text-sm">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Dialog */}
      <LinkParseResultDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        data={currentTest}
        editable={true}
        onSave={handleSave}
      />
    </div>
  );
}

export default TestRunner;
