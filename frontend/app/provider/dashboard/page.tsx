"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, DollarSign, Clock, Plus, Settings, ImageIcon, Briefcase } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/logout-button";

interface Service {
  id: string
  name: string
  description?: string
  category?: string
  price: number
  durationMins: number
}

interface Booking {
  id: string
  clientId: string
  serviceId: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "unpaid" | "paid"
}

export default function ProviderDashboard() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "provider") {
      router.push("/auth/login")
      return
    }
    fetchServices()
    fetchBookings()
  }, [user, router, loading])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/provider/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data)

        // Calculate stats
        const totalBookings = data.length
        const pendingBookings = data.filter((b: Booking) => b.status === "pending").length
        const completedBookings = data.filter((b: Booking) => b.status === "completed").length
        const totalRevenue = data
          .filter((b: Booking) => b.status === "completed")
          .reduce((sum: number, booking: Booking) => {
            const service = services.find((s) => s.id === booking.serviceId)
            return sum + (service?.price || 0)
          }, 0)

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalRevenue,
        })
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#4ADE80] text-white"
      case "pending":
        return "bg-[#FACC15] text-white"
      case "completed":
        return "bg-blue-500 text-white"
      case "cancelled":
        return "bg-[#F87171] text-white"
      default:
        return "bg-gray-500 text-white"
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
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#22223B]">BeautiSlot Pro</span>
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
                <p className="text-xs text-gray-500">Provider</p>
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
          <h1 className="text-3xl font-bold text-[#22223B] mb-2">Welcome back, {user?.name?.split(" ")[0]}! 💼</h1>
          <p className="text-gray-600">Manage your beauty business and grow your client base</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-[#22223B]">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-[#FACC15]">{stats.pendingBookings}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FACC15] to-[#FF6584] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-[#4ADE80]">{stats.completedBookings}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#4ADE80] to-[#6C63FF] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-[#22223B]">₦{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#4ADE80] to-[#FACC15] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Link href="/provider/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-2">View Bookings</h3>
                <p className="text-sm text-gray-600">Manage all bookings from the client</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/provider/availability">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6584] to-[#6C63FF] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-2">Set Availability</h3>
                <p className="text-sm text-gray-600">Manage your schedule</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/provider/portfolio">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4ADE80] to-[#6C63FF] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-2">Portfolio</h3>
                <p className="text-sm text-gray-600">Showcase your work</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/provider/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FACC15] to-[#FF6584] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-2">Profile Settings</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#22223B]">Your Services</CardTitle>
                  <Link href="/provider/services">
                    <Button size="sm" className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                </div>
                <CardDescription>Manage your service offerings and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#22223B]">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">₦{service.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">{service.durationMins} mins</span>
                            {service.category && <Badge variant="secondary">{service.category}</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href="/provider/services">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Link href="/provider/services">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Delete
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No services added yet</p>
                      <Link href="/provider/services">
                        <Button className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Service
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-[#22223B]">Recent Bookings</CardTitle>
                <CardDescription>Latest appointment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 5).length > 0 ? (
                    bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[#22223B] text-sm">
                            {services.find((s) => s.id === booking.serviceId)?.name || "Service"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.date} at {booking.startTime}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No bookings yet</p>
                      <p className="text-xs text-gray-400">Bookings will appear here when clients book your services</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
