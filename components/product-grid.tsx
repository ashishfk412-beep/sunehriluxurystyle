import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  image_url: string
  rating: number
  reviews_count: number
  is_new_arrival: boolean
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.slug}`}>
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 h-full">
            <CardContent className="p-0">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {product.original_price && (
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">Sale</Badge>
                )}
                {product.is_new_arrival && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">New</Badge>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews_count})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                  {product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
