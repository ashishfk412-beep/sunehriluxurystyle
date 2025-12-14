import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"

export default async function WishlistPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get wishlist items with product details
  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select(
      `
      *,
      products (*)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const products = wishlistItems?.map((item) => item.products) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">My Wishlist</h1>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-6">Your wishlist is empty</p>
            <a
              href="/shop/all"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
