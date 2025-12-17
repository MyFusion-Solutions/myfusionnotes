"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { connectIntegration } from "@/lib/actions"

interface ConnectionDialogProps {
  integration: {
    id: string
    name: string
    type: string
  }
}

export function ConnectionDialog({ integration }: ConnectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Generic state for credentials
  const [domain, setDomain] = useState("")
  const [apiKey, setApiKey] = useState("")

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Basic credential bundle
      const credentials = { apiKey, domain }
      await connectIntegration(integration.id, integration.type, credentials, { domain })
      setOpen(false)
    } catch (error) {
      console.error("Failed to connect", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Connect</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect {integration.name}</DialogTitle>
          <DialogDescription>
            Enter your API credentials to enable syncing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {integration.id === 'zendesk' && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="domain" className="text-right">
                Domain
                </Label>
                <div className="col-span-3 flex items-center gap-1">
                    <Input
                        id="domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="mycompany"
                        className="text-right"
                    />
                    <span className="text-sm text-muted-foreground">.zendesk.com</span>
                </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleConnect} disabled={loading}>
            {loading ? "Connecting..." : "Save Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
