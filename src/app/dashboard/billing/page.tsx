import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your billing and plan preferences.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:max-w-4xl">
         {/* Free Plan */}
         <Card>
            <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For testing and small teams.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500"/> 50 Syncs / Month
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500"/> Connect 1 CRM
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" disabled>Current Plan</Button>
            </CardFooter>
         </Card>

         {/* Pro Plan */}
         <Card className="border-primary shadow-md">
             <CardHeader>
                <CardTitle>Pro</CardTitle>
                 <CardDescription>Unlimited power for growing support teams.</CardDescription>
            </CardHeader>
             <CardContent>
                <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary"/> Unlimited Syncs
                    </div>
                     <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary"/> AI Summaries & Sentiment
                    </div>
                     <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary"/> Priority Email Support
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <form action="/api/stripe/checkout" method="POST" className="w-full">
                    <Button className="w-full" type="submit">Upgrade to Pro</Button>
                 </form>
            </CardFooter>
         </Card>
      </div>
    </div>
  )
}
