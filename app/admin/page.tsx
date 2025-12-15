import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingBag, Users, TrendingUp, Grid3x3, LayoutDashboard } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  // Get statistics
  const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })
  const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })
  const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true })
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { data: orders } = await supabase.from("orders").select("total_amount")

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Manage your store from here.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{productCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Grid3x3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categoryCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{orderCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{userCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-4xl font-bold text-primary">
                    ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full h-20 text-lg bg-transparent hover:bg-primary/5" size="lg">
                  <Package className="mr-2 h-5 w-5" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full h-20 text-lg bg-transparent hover:bg-primary/5" size="lg">
                  <Grid3x3 className="mr-2 h-5 w-5" />
                  Categories
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full h-20 text-lg bg-transparent hover:bg-primary/5" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Orders
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-20 text-lg bg-transparent hover:bg-primary/5" size="lg">
                  <Users className="mr-2 h-5 w-5" />
                  Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          {recentOrders && recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif">Recent Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.profiles?.full_name || "Unknown"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
