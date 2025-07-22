"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Search, MapPin, Star, Clock, Sparkles, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/logout-button";

interface Provider {
  id: string
  name: string
  avatarUrl?: string
  bio?: string
  location?: string
  categories?: string[]
  ratingsAverage?: number
  ratingsCount?: number
}

interface Booking {
  id: string
  providerId: string
  serviceId: string
  serviceName?: string
  providerName?: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "unpaid" | "paid"
}

export default function ClientDashboard() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "client") {
      router.push("/auth/login")
      return
    }
    fetchProviders()
    fetchBookings()
  }, [user, router, loading])

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers`)
      if (response.ok) {
        const data = await response.json()
        setProviders(data.slice(0, 6)) // Show first 6 providers
      }
    } catch (error) {
      console.error("Error fetching providers:", error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data.slice(0, 3)) // Show recent 3 bookings
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
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#22223B]">BeautiSlot</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[#22223B]">{user?.name}</p>
                <p className="text-xs text-gray-500">Client</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#22223B] mb-2">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600">Ready to book your next beauty appointment?</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          <Link href="/client/search">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-1 sm:mb-2 text-sm sm:text-base">Find Professionals</h3>
                <p className="text-xs sm:text-sm text-gray-600">Discover top-rated beauty experts</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/book">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6584] to-[#6C63FF] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-1 sm:mb-2 text-sm sm:text-base">Book Appointment</h3>
                <p className="text-xs sm:text-sm text-gray-600">Schedule your beauty session</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#4ADE80] to-[#6C63FF] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-1 sm:mb-2 text-sm sm:text-base">My Bookings</h3>
                <p className="text-xs sm:text-sm text-gray-600">View your appointments</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/reviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FACC15] to-[#FF6584] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#22223B] mb-1 sm:mb-2 text-sm sm:text-base">Leave Reviews</h3>
                <p className="text-xs sm:text-sm text-gray-600">Share your experience</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Providers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#22223B]">Featured Professionals</CardTitle>
                  <Link href="/client/search">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <CardDescription>Top-rated beauty professionals in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providers.map((provider) => (
                    <Card key={provider.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage src={provider.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                              {provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#22223B] truncate">{provider.name}</h4>
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                              <span className="text-sm text-gray-600">
                                {provider.ratingsAverage?.toFixed(1) || "New"}
                                {provider.ratingsCount && ` (${provider.ratingsCount})`}
                              </span>
                            </div>
                            {provider.location && (
                              <div className="flex items-center space-x-1 mb-2">
                                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-500 truncate">{provider.location}</span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {provider.categories?.slice(0, 2).map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link href={`/client/providers/${provider.id}`}>
                          <Button
                            className="w-full mt-3 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:from-[#5B54E6] hover:to-[#E55A7A] text-white"
                            size="sm"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-[#22223B]">Recent Bookings</CardTitle>
                <CardDescription>Your latest appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#22223B] text-sm truncate">
                            {booking.serviceName || "Service"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {booking.date} at {booking.startTime}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} flex-shrink-0 ml-2`}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No bookings yet</p>
                      <Link href="/client/book">
                        <Button size="sm" className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                      </Link>
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
