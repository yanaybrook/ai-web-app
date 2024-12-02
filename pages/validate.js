import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ValidatePage = () => {
  const [apiKey, setApiKey] = useState('')
  const [isValidated, setIsValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateKey = async () => {
    if (!apiKey.startsWith('sk-')) {
      setError('API key must start with "sk-"')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsValidated(true)
        setError('')
      } else {
        setError(data.error || 'Invalid API key')
        setIsValidated(false)
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setIsValidated(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Card className="max-w-md mx-auto p-6">
        {!isValidated ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Enter Your Anthropic API Key</h3>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button 
              onClick={validateKey} 
              disabled={loading || !apiKey}
              className="w-full"
            >
              {loading ? 'Validating...' : 'Validate Key'}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-500 font-medium">✓ API Key Validated</div>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsValidated(false)
                setApiKey('')
              }}
            >
              Enter Different Key
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ValidatePage