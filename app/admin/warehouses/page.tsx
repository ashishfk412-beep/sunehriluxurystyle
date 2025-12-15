import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Pencil, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function WarehousesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/warehouses")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: warehouses } = await supabase.from("warehouses").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Warehouse Management</h1>
              <p className="text-muted-foreground">Manage warehouses and inventory locations</p>
            </div>
            <Link href="/admin/warehouses/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Warehouse
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses?.map((warehouse: any) => (
              <Card key={warehouse.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Code: {warehouse.code}</p>
                      </div>
                    </div>
                    <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                      {warehouse.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="text-sm">
                      {warehouse.address.street}, {warehouse.address.city}
                    </p>
                    <p className="text-sm">
                      {warehouse.address.state} - {warehouse.address.pincode}
                    </p>
                  </div>
                  {warehouse.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm">{warehouse.phone}</p>
                    </div>
                  )}
                  {warehouse.email && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="text-sm">{warehouse.email}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/warehouses/${warehouse.id}/inventory`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Inventory
                      </Button>
                    </Link>
                    <Link href={`/admin/warehouses/${warehouse.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!warehouses || warehouses.length === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No warehouses found. Create your first warehouse!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
