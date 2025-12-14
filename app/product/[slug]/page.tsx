import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductGrid } from "@/components/product-grid"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get product details
  const { data: product } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single()

  if (!product) notFound()

  // Get related products from the same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

  return (
    <div className="min-h-screen">
      {/* Product Details */}
      <div className="container px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <ProductImageGallery images={[product.image_url, ...(product.additional_images || [])]} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="bg-muted/30 py-12 md:py-16 border-t border-border">
          <div className="container px-4">
            <h2 className="font-serif text-3xl font-bold mb-8">You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      )}
    </div>
  )
}
