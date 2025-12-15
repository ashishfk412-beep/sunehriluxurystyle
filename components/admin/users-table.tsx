"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldCheck } from "lucide-react"

type Profile = {
  id: string
  full_name?: string
  phone?: string
  is_admin: boolean
  created_at: string
}

export function UsersTable({ users }: { users: Profile[] }) {
  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No users yet</p>
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
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                <TableCell>{user.phone || "—"}</TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <Badge variant="default" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Customer</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
