"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// ZAF Client Type Definition (Simplified)
interface ZAFClient {
  on: (event: string, callback: any) => void
  invoke: (action: string, ...args: any[]) => Promise<any>
  get: (path: string) => Promise<any>
}

import { syncTicketToCrm } from "@/lib/sync"
import { Badge } from "@/components/ui/badge"

export default function ZendeskSidebar() {
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js"
    script.async = true
    script.onload = () => {
      // @ts-ignore
      const client = ZAFClient.init()
      client.on('app.registered', () => {
        client.invoke('resize', { width: '100%', height: '400px' })
        
        // Fetch full ticket details
        client.get(['ticket.id', 'ticket.subject', 'ticket.description', 'ticket.requester']).then((data: any) => {
          setTicket({
             id: data['ticket.id'],
             subject: data['ticket.subject'],
             description: data['ticket.description'],
             requesterEmail: data['ticket.requester']?.email || 'unknown@example.com'
          })
          setLoading(false)
        })
      })
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const handleSync = async () => {
      if (!ticket) return;
      setSyncing(true);
      setResult(null);
      
      try {
          // Pass mock data if we are outside of ZAF for testing visual
          const payload = ticket.id ? ticket : {
              id: '123',
              subject: 'Test Ticket',
              description: 'Customer cannot login.',
              requesterEmail: 'test@example.com'
          };
          
          const res = await syncTicketToCrm(payload);
          if (res.success) {
              setResult("✅ Synced: " + res.summary)
          } else {
              setResult("❌ Error: " + res.message)
          }
      } catch (err) {
          setResult("❌ Sync Failed")
      } finally {
          setSyncing(false);
      }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-2">
      <Card className="border-none shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium flex justify-between items-center">
             MyFusion AI
             {result?.startsWith('✅') && <Badge variant="default" className="bg-green-500 text-[10px]">Synced</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-xs text-muted-foreground mb-4 space-y-1">
            <p>Ticket ID: <span className="font-mono text-foreground">{ticket?.id}</span></p>
            <p className="truncate">Subject: <span className="text-foreground">{ticket?.subject}</span></p>
          </div>
          
          {result && (
              <div className="p-2 bg-muted rounded-md text-xs mb-4 max-h-32 overflow-y-auto">
                  {result}
              </div>
          )}
          
          {!result && (
             <p className="text-sm">
                Ready to sync this ticket to Keap?
             </p>
          )}

        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button size="sm" className="w-full" onClick={handleSync} disabled={syncing}>
            {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {syncing ? "Generating AI Summary..." : "Sync to CRM"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
