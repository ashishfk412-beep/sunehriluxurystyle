import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function TaxRatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/taxes")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: taxRates } = await supabase.from("tax_rates").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Tax Rate Management</h1>
              <p className="text-muted-foreground">Manage tax rates for products and categories</p>
            </div>
            <Link href="/admin/taxes/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Tax Rate
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Tax Rates</CardTitle>
            </CardHeader>
            <CardContent>
              {!taxRates || taxRates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tax rates found. Create your first tax rate!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="py-3 px-4 font-semibold">Name</th>
                        <th className="py-3 px-4 font-semibold">Rate (%)</th>
                        <th className="py-3 px-4 font-semibold">Applies To</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxRates.map((tax: any) => (
                        <tr key={tax.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{tax.name}</td>
                          <td className="py-3 px-4">{tax.rate}%</td>
                          <td className="py-3 px-4 capitalize">{tax.applies_to}</td>
                          <td className="py-3 px-4">
                            <Badge variant={tax.is_active ? "default" : "secondary"}>
                              {tax.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <Link href={`/admin/taxes/${tax.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
