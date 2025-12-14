"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CartItem {
  id: string
  quantity: number
  size: string
  color: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    image_url: string
    stock_quantity: number
  }
}

interface CartItemsProps {
  items: CartItem[]
}

export function CartItems({ items }: CartItemsProps) {
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const router = useRouter()

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId))
    const supabase = createClient()

    try {
      const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating quantity:", error)
      alert("Failed to update quantity. Please try again.")
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId))
    const supabase = createClient()

    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error removing item:", error)
      alert("Failed to remove item. Please try again.")
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isUpdating = updatingItems.has(item.id)
        const subtotal = item.products.price * item.quantity

        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Link href={`/product/${item.products.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-32 bg-muted rounded-md overflow-hidden">
                    <img
                      src={item.products.image_url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/product/${item.products.slug}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                          {item.products.name}
                        </h3>
                      </Link>
                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{subtotal.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₹{item.products.price.toLocaleString()} each</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() =>
                          updateQuantity(item.id, Math.min(item.products.stock_quantity, item.quantity + 1))
                        }
                        disabled={isUpdating || item.quantity >= item.products.stock_quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} disabled={isUpdating}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
