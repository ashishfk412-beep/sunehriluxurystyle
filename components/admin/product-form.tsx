"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

type Category = {
  id: string
  name: string
}

type Product = {
  id?: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  category_id: string
  image_url: string
  sizes: string[]
  colors: string[]
  stock_quantity: number
  is_featured: boolean
  is_new_arrival: boolean
}

export function ProductForm({
  product,
  categories,
}: {
  product?: Product
  categories: Category[]
}) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    sizes: product?.sizes?.join(", ") || "XS, S, M, L, XL",
    colors: product?.colors?.join(", ") || "Default",
    stock_quantity: product?.stock_quantity || 0,
    is_featured: product?.is_featured || false,
    is_new_arrival: product?.is_new_arrival || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const sizesArray = formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const colorsArray = formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        category_id: formData.category_id || null,
        image_url: formData.image_url,
        sizes: sizesArray,
        colors: colorsArray,
        stock_quantity: Number(formData.stock_quantity),
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
        updated_at: new Date().toISOString(),
      }

      let error

      if (product?.id) {
        // Update existing product
        const result = await supabase.from("products").update(productData).eq("id", product.id)
        error = result.error
      } else {
        // Create new product
        const result = await supabase.from("products").insert([productData])
        error = result.error
      }

      if (error) throw error

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData({ ...formData, slug })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes (comma-separated)</Label>
              <Input
                id="sizes"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                placeholder="XS, S, M, L, XL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Colors (comma-separated)</Label>
              <Input
                id="colors"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="Red, Blue, Green"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_new_arrival"
                checked={formData.is_new_arrival}
                onCheckedChange={(checked) => setFormData({ ...formData, is_new_arrival: checked as boolean })}
              />
              <Label htmlFor="is_new_arrival" className="cursor-pointer">
                New Arrival
              </Label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : product?.id ? "Update Product" : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
