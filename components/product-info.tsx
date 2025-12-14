"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface ProductInfoProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    original_price: number | null
    sizes: string[]
    colors: string[]
    stock_quantity: number
    rating: number
    reviews_count: number
    is_new_arrival: boolean
    categories: {
      name: string
    }
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const router = useRouter()

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const addToCart = async () => {
    setIsAddingToCart(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("cart_items").upsert(
        {
          user_id: user.id,
          product_id: product.id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
        { onConflict: "user_id,product_id,size,color" },
      )

      if (error) throw error

      router.push("/cart")
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
      alert("Failed to add to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const addToWishlist = async () => {
    setIsAddingToWishlist(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: product.id,
      })

      if (error) {
        if (error.code === "23505") {
          alert("This item is already in your wishlist!")
        } else {
          throw error
        }
      } else {
        alert("Added to wishlist!")
      }
    } catch (error) {
      console.error("[v0] Error adding to wishlist:", error)
      alert("Failed to add to wishlist. Please try again.")
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category & New Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline">{product.categories?.name}</Badge>
        {product.is_new_arrival && <Badge className="bg-primary text-primary-foreground">New Arrival</Badge>}
      </div>

      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-balance">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews_count} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
        {product.original_price && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              ₹{product.original_price.toLocaleString()}
            </span>
            <Badge className="bg-accent text-accent-foreground">{discount}% OFF</Badge>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">{product.description}</p>

      <div className="border-t border-border pt-6 space-y-6">
        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Size</Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex items-center justify-center px-4 py-2 border-2 border-border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50 transition-colors"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 1 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <div key={color}>
                  <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                  <Label
                    htmlFor={`color-${color}`}
                    className="flex items-center justify-center px-4 py-2 border-2 border-border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50 transition-colors"
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Quantity</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
              disabled={quantity >= product.stock_quantity}
            >
              +
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={addToCart}
          disabled={isAddingToCart || product.stock_quantity === 0}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={addToWishlist}
          disabled={isAddingToWishlist}
          className="hover:bg-primary/5 bg-transparent"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Features */}
      <div className="border-t border-border pt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <span>Free shipping on orders over ₹999</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <span>Easy 7-day returns</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span>100% authentic products</span>
        </div>
      </div>
    </div>
  )
}
