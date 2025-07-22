"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Calendar, DollarSign, TrendingUp, Shield, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/logout-button";

interface User {
  id: string
  name: string
  email: string
  role: string
  status?: string
}

interface Analytics {
  totalUsers: number
  totalProviders: number
  totalClients: number
  totalBookings: number
  totalRevenue: number
  monthlyGrowth: number
}

export default function AdminDashboard() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalProviders: 0,
    totalClients: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
      return
    }
    fetchUsers()
    fetchAnalytics()
  }, [user, router, loading])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.slice(0, 10)) // Show first 10 users
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6C63FF]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#22223B]">BeautiSlot Admin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-[#22223B]">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#22223B] mb-2">Admin Dashboard 🛡️</h1>
          <p className="text-gray-600">Monitor and manage the BeautiSlot platform</p>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-[#22223B]">{analytics?.totalUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Providers</p>
                  <p className="text-2xl font-bold text-[#FF6584]">{analytics?.totalProviders || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6584] to-[#6C63FF] rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-[#4ADE80]">{analytics?.totalBookings || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#4ADE80] to-[#6C63FF] rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                  <p className="text-2xl font-bold text-[#FACC15]">
                    ₦{(analytics?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FACC15] to-[#FF6584] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#22223B]">Recent Users</CardTitle>
                  <Link href="/admin/users">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-[#22223B]">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === "provider" ? "default" : "secondary"}>{user.role}</Badge>
                        <Link href="/admin/users">
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-[#22223B]">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/admin/users">
                  <Button className="w-full justify-start bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/bookings">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics Report
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Platform Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
