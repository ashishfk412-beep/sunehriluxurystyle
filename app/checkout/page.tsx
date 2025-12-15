import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (profile?.is_admin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-destructive/50">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <ShieldAlert className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="font-serif text-2xl font-bold">Admin Account Restriction</h1>
                <p className="text-muted-foreground">
                  Admin accounts cannot place orders. Please create a separate customer account to make purchases.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Link href="/admin">
                    <Button>Go to Admin Dashboard</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Get cart items
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      products (
        id,
        name,
        price,
        image_url,
        category_id
      )
    `,
    )
    .eq("user_id", user.id)

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  let userProfile = profile

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert([{ id: user.id, full_name: "", phone: "" }])
      .select()
      .maybeSingle()

    userProfile = newProfile
  }

  const { data: discounts } = await supabase.from("discounts").select("*").eq("is_active", true)

  const { data: taxRates } = await supabase.from("tax_rates").select("*").eq("is_active", true)

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
        <CheckoutForm
          cartItems={cartItems}
          userProfile={userProfile}
          userId={user.id}
          discounts={discounts || []}
          taxRates={taxRates || []}
        />
      </div>
    </div>
  )
}
