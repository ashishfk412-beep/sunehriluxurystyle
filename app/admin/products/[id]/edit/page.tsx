import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (!product) {
    redirect("/admin/products")
  }

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">Update product information</p>
            </div>
          </div>

          <ProductForm product={product} categories={categories || []} />
        </div>
      </div>
    </div>
  )
}
