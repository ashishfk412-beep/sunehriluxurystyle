import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
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

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (
        full_name,
        phone,
        address
      )
    `)
    .eq("id", params.id)
    .single()

  if (!order) {
    redirect("/admin/orders")
  }

  const { data: orderItems } = await supabase.from("order_items").select("*").eq("order_id", order.id)

  const shippingAddress = order.shipping_address as any
  const billingAddress = order.billing_address as any

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12 max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Order #{order.order_number}</h1>
              <p className="text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="capitalize">
              {order.status}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems?.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{Number(item.price).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{shippingAddress?.name}</p>
                    <p className="text-sm text-muted-foreground">{shippingAddress?.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">{shippingAddress?.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">{order.profiles?.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{order.profiles?.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Method:</span>
                      <span className="text-sm font-medium">{order.payment_method || "COD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge variant="secondary">{order.payment_status}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-lg">₹{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
