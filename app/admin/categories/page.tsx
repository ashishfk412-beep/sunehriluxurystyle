import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { CategoriesTable } from "@/components/admin/categories-table"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/categories")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Manage Categories</h1>
              <p className="text-muted-foreground">Organize your products into categories</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/categories/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </Link>
            </div>
          </div>

          <CategoriesTable categories={categories || []} />
        </div>
      </div>
    </div>
  )
}
