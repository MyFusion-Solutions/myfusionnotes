import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConnectionDialog } from "@/components/connection-dialog"

const integrations = [
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Connect your Zendesk Support account to sync tickets.",
    type: "SUPPORT",
    status: "disconnected",
    logo: "https://logo.clearbit.com/zendesk.com",
  },
  {
    id: "keap",
    name: "Keap (Infusionsoft)",
    description: "Sync contacts and notes to your Keap CRM.",
    type: "CRM",
    status: "disconnected",
    logo: "https://logo.clearbit.com/keap.com",
  },
]

export default function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your support desk and CRM to start syncing data.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                {integration.name}
              </CardTitle>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={integration.logo}
                alt={integration.name}
                className="h-8 w-8 rounded-full"
              />
            </CardHeader>
            <CardContent>
               <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Badge variant="outline">{integration.type}</Badge>
               </div>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </CardContent>
            <CardFooter>
              {integration.status === 'connected' ? (
                  <Button className="w-full" variant="outline">Manage</Button>
              ) : (
                  <ConnectionDialog integration={integration} />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
