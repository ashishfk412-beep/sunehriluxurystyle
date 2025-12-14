import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"

interface PageProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    minPrice?: string
    maxPrice?: string
    size?: string
    color?: string
    sort?: string
  }>
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params
  const filters = await searchParams
  const supabase = await createClient()

  // Get category info
  let categoryData = null
  let query = supabase.from("products").select("*")

  if (category !== "all" && category !== "new-arrivals") {
    const { data } = await supabase.from("categories").select("*").eq("slug", category).single()
    if (!data) notFound()
    categoryData = data
    query = query.eq("category_id", data.id)
  }

  if (category === "new-arrivals") {
    query = query.eq("is_new_arrival", true)
  }

  // Apply filters
  if (filters.minPrice) {
    query = query.gte("price", Number.parseFloat(filters.minPrice))
  }
  if (filters.maxPrice) {
    query = query.lte("price", Number.parseFloat(filters.maxPrice))
  }
  if (filters.size) {
    query = query.contains("sizes", [filters.size])
  }
  if (filters.color) {
    query = query.contains("colors", [filters.color])
  }

  // Apply sorting
  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "rating":
      query = query.order("rating", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  // Get all sizes and colors for filters
  const { data: allProducts } = await supabase.from("products").select("sizes, colors")
  const allSizes = [...new Set(allProducts?.flatMap((p) => p.sizes) || [])]
  const allColors = [...new Set(allProducts?.flatMap((p) => p.colors) || [])]

  const title = category === "all" ? "All Products" : category === "new-arrivals" ? "New Arrivals" : categoryData?.name
  const description =
    category === "all"
      ? "Browse our complete collection"
      : category === "new-arrivals"
        ? "Discover our latest additions"
        : categoryData?.description

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-12 md:py-16 border-b border-border">
        <div className="container px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 text-balance">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ProductFilters availableSizes={allSizes} availableColors={allColors} />
          </aside>

          {/* Products Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{products?.length || 0} products found</p>
            </div>
            <ProductGrid products={products || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
