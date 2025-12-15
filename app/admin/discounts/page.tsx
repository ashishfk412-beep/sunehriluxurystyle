import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function DiscountsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/discounts")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: discounts } = await supabase
    .from("discounts")
    .select("*, categories(name), products(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Discount Management</h1>
              <p className="text-muted-foreground">Manage discount codes and promotional offers</p>
            </div>
            <Link href="/admin/discounts/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Discount
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              {!discounts || discounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No discounts found. Create your first discount!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="py-3 px-4 font-semibold">Name</th>
                        <th className="py-3 px-4 font-semibold">Type</th>
                        <th className="py-3 px-4 font-semibold">Value</th>
                        <th className="py-3 px-4 font-semibold">Applies To</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Valid Until</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discounts.map((discount: any) => (
                        <tr key={discount.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{discount.name}</td>
                          <td className="py-3 px-4 capitalize">{discount.discount_type}</td>
                          <td className="py-3 px-4">
                            {discount.discount_type === "percentage"
                              ? `${discount.discount_value}%`
                              : `₹${discount.discount_value}`}
                          </td>
                          <td className="py-3 px-4 capitalize">{discount.applies_to}</td>
                          <td className="py-3 px-4">
                            <Badge variant={discount.is_active ? "default" : "secondary"}>
                              {discount.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {discount.valid_until ? new Date(discount.valid_until).toLocaleDateString() : "No expiry"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <Link href={`/admin/discounts/${discount.id}/edit`}>
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
