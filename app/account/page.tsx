import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, ShoppingBag, Heart, LogOut } from "lucide-react"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert([{ id: user.id, full_name: "", phone: "" }])
      .select()
      .maybeSingle()
  }

  // Get order count
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Get wishlist count
  const { count: wishlistCount } = await supabase
    .from("wishlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 rounded-lg p-6 md:p-8 border border-border/50">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">{profile?.full_name || user.email}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orderCount || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  <p className="text-2xl font-bold">{wishlistCount || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif">Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/account/orders">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  My Orders
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Heart className="mr-3 h-5 w-5" />
                  My Wishlist
                </Button>
              </Link>
              <Link href="/account/profile">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <User className="mr-3 h-5 w-5" />
                  Edit Profile
                </Button>
              </Link>
              <form action="/auth/logout" method="post">
                <Button type="submit" variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
