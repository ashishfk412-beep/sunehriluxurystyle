import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase.from("products").select("*").eq("is_featured", true).limit(4)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch new arrivals
  const { data: newArrivals } = await supabase.from("products").select("*").eq("is_new_arrival", true).limit(4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 md:py-32">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent text-accent-foreground">New Collection 2025</Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance leading-tight">
                Elegance in Every Thread
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover our curated collection of timeless dresses that celebrate femininity and grace. From
                traditional sarees to contemporary gowns.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop/all">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/shop/new-arrivals">
                  <Button size="lg" variant="outline">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src="/elegant-woman-in-traditional-indian-saree.jpg"
                alt="Elegant woman in traditional dress"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection tailored for every occasion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories?.map((category) => (
              <Link key={category.id} href={`/shop/${category.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Handpicked favorites from our latest collection</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
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
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
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

          <div className="text-center mt-12">
            <Link href="/shop/all">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Just In</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">New Arrivals</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Fresh styles just added to our collection</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 h-full">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">New</Badge>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
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
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-serif text-primary">10K+</div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-serif text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Premium Designs</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-serif text-primary">100%</div>
              <p className="text-sm text-muted-foreground">Authentic Products</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-serif text-primary">24/7</div>
              <p className="text-sm text-muted-foreground">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
