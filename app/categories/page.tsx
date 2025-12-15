import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Fetch all categories with product count
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Get product count for each category
  const categoriesWithCount = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      return { ...category, productCount: count || 0 }
    }),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">All Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of elegant dresses organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesWithCount.map((category) => (
            <Link key={category.id} href={`/shop/${category.slug}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 h-full">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={category.image_url || "/placeholder.svg?height=400&width=600"}
                      alt={category.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    {category.productCount > 0 && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        {category.productCount} Items
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!categories || categories.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
