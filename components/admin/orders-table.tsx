"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Order = {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  profiles?: {
    full_name?: string
    phone?: string
  } | null
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", variant: "secondary" as const },
  { value: "processing", label: "Processing", variant: "default" as const },
  { value: "shipped", label: "Shipped", variant: "default" as const },
  { value: "delivered", label: "Delivered", variant: "default" as const },
  { value: "cancelled", label: "Cancelled", variant: "destructive" as const },
]

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    } finally {
      setUpdatingId(null)
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusOption = STATUS_OPTIONS.find((opt) => opt.value === order.status)
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.profiles?.full_name || "Unknown"}</p>
                      {order.profiles?.phone && <p className="text-xs text-muted-foreground">{order.profiles.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-semibold">₹{Number(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={updatingId === order.id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge variant={statusOption?.variant}>{statusOption?.label}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
