"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  quantity: number
  products: {
    price: number
  }
}

interface CartSummaryProps {
  items: CartItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const router = useRouter()

  const subtotal = items.reduce((acc, item) => acc + item.products.price * item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 99
  const tax = subtotal * 0.18 // 18% tax
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="lg:sticky lg:top-20 lg:self-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (18%)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>

          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Add ₹{(1000 - subtotal).toLocaleString()} more to get FREE shipping!
            </p>
          )}

          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>

          <a href="/shop/all" className="block text-center text-sm text-primary hover:underline">
            Continue Shopping
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
