import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export function AdminInstructions() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5 text-primary" />
          Admin Access - Quick Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-semibold mb-2 text-primary">Option 1: Use Default Admin Email</p>
          <div className="bg-background p-3 rounded-md mb-2">
            <p className="font-mono text-xs mb-1">Email: admin@elegantthreads.com</p>
            <p className="font-mono text-xs">Password: Admin@123456</p>
          </div>
          <p className="text-muted-foreground text-xs">
            Click "Sign Up" (not Login), create an account with this email, and you'll automatically become admin.
          </p>
        </div>

        <div className="border-t pt-3">
          <p className="font-semibold mb-2">Option 2: First User Auto-Admin</p>
          <p className="text-muted-foreground text-xs">
            The first person who signs up will automatically get admin privileges. You can change your password after
            logging in.
          </p>
        </div>

        <div className="border-t pt-3">
          <p className="font-semibold mb-1">After Setup:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
            <li>
              Visit <span className="font-mono">/admin</span> to access the dashboard
            </li>
            <li>
              Change your password in <span className="font-mono">/account/profile</span>
            </li>
            <li>Manage products, orders, and categories</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
