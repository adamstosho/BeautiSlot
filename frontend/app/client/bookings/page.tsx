"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Star, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Booking {
  id: string
  providerId: string
  serviceId: string
  serviceName?: string
  providerName?: string
  providerLocation?: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "unpaid" | "paid"
  price?: number
}

export default function ClientBookingsPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "client") {
      router.push("/auth/login")
      return
    }
    fetchBookings()
  }, [user, router, loading])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        })
        fetchBookings()
      } else {
        throw new Error("Failed to cancel booking")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      })
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

  const canCancel = (booking: Booking) => {
    return booking.status === "pending" || booking.status === "confirmed"
  }

  const canReview = (booking: Booking) => {
    return booking.status === "completed"
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
              <Link href="/client/dashboard" className="text-[#6C63FF] hover:text-[#5B54E6]">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#22223B]">My Bookings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#22223B] mb-2">Your Appointments</h2>
          <p className="text-gray-600">Manage your beauty appointments</p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                            {booking.providerName?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-[#22223B]">{booking.serviceName || "Service"}</h3>
                          <p className="text-sm text-gray-600">{booking.providerName || "Provider"}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{booking.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                            {booking.providerLocation && (
                              <div className="flex items-center space-x-1 text-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{booking.providerLocation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>

                        <div className="flex space-x-2">
                          {canReview(booking) && (
                            <Link href={`/client/reviews/new?appointmentId=${booking.id}`}>
                              <Button size="sm" className="bg-[#FACC15] hover:bg-[#E6B800] text-white">
                                <Star className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </Link>
                          )}

                          {canCancel(booking) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelBooking(booking.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any appointments yet</p>
              <Link href="/client/search">
                <Button className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">Find Professionals</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
