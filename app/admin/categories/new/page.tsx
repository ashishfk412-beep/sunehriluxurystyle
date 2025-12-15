import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CategoryForm } from "@/components/admin/category-form"

export default async function NewCategoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/categories/new")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/categories">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Add New Category</h1>
              <p className="text-muted-foreground">Create a new product category</p>
            </div>
          </div>

          <CategoryForm />
        </div>
      </div>
    </div>
  )
}
