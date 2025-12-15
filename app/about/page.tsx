import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Truck, Star } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-accent text-accent-foreground">About Us</Badge>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance">Sunehri Luxury Style</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your destination for timeless elegance and contemporary fashion. We curate the finest collection of
              traditional and modern women's wear.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded with a passion for celebrating the beauty and grace of traditional Indian fashion, Sunehri
                Luxury Style has been serving fashion-conscious women who appreciate quality, elegance, and timeless
                style.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that every woman deserves to feel confident and beautiful. Our carefully curated collection
                features everything from traditional sarees and kurtis to contemporary gowns and party wear, all
                selected with an eye for quality craftsmanship and enduring style.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-serif text-2xl font-bold">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide every woman with access to premium quality, elegant fashion that celebrates heritage
                    while embracing modern trends.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-serif text-2xl font-bold">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the most trusted name in women's ethnic and contemporary fashion, known for quality,
                    authenticity, and exceptional customer service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing an exceptional shopping experience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Curated Collection</h3>
                <p className="text-sm text-muted-foreground">Every piece is handpicked for quality and style</p>
              </CardContent>
            </Card>

            <Card className="text-center border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">100% Authentic</h3>
                <p className="text-sm text-muted-foreground">Genuine products with quality guarantee</p>
              </CardContent>
            </Card>

            <Card className="text-center border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">Quick and secure delivery across India</p>
              </CardContent>
            </Card>

            <Card className="text-center border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Customer First</h3>
                <p className="text-sm text-muted-foreground">24/7 support for your shopping needs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
