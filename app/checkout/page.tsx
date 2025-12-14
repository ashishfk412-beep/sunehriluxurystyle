import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
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
        image_url
      )
    `,
    )
    .eq("user_id", user.id)

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  let userProfile = profile

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert([{ id: user.id, full_name: "", phone: "" }])
      .select()
      .maybeSingle()

    userProfile = newProfile
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
        <CheckoutForm cartItems={cartItems} userProfile={userProfile} userId={user.id} />
      </div>
    </div>
  )
}
