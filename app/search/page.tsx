import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product-grid"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""
  const supabase = await createClient()

  // Search products by name or description
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              {products && products.length > 0
                ? `Found ${products.length} results for "${query}"`
                : `No results found for "${query}"`}
            </p>
          </div>

          {products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
