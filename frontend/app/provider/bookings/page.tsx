"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Booking {
  id: string
  _id: string
  clientId: string
  serviceId: string
  serviceName?: string
  clientName?: string
  clientEmail?: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "unpaid" | "paid"
  price?: number
}

export default function ProviderBookingsPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (loading) return; // Wait for auth to load
    if (!user || user.role !== "provider") {
      router.push("/auth/login")
      return
    }
    fetchBookings()
  }, [user, router, loading])

  useEffect(() => {
    filterBookings()
  }, [bookings, statusFilter])

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

  const filterBookings = () => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter((booking) => booking.status === statusFilter))
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/provider/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Booking ${status} successfully`,
        })
        fetchBookings()
      } else {
        throw new Error("Failed to update booking status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
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

  if (isLoading) {
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
              <Link href="/provider/dashboard" className="text-[#6C63FF] hover:text-[#5B54E6]">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#22223B]">Manage Bookings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#22223B]">Your Bookings</h2>
            <p className="text-gray-600">Manage your client appointments</p>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
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
                            {booking.clientName?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-[#22223B]">{booking.serviceName || "Service"}</h3>
                          <p className="text-sm text-gray-600">{booking.clientName || "Client"}</p>
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
                            {booking.price && (
                              <div className="flex items-center space-x-1 text-gray-500">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">₦{booking.price.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>

                        {booking.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking._id, "confirmed")}
                              className="bg-[#4ADE80] hover:bg-[#3BC470] text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking._id, "cancelled")}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}

                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking._id, "completed")}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Mark Complete
                          </Button>
                        )}
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
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === "all" ? "You don't have any bookings yet" : `No ${statusFilter} bookings found`}
              </p>
              {statusFilter !== "all" && (
                <Button onClick={() => setStatusFilter("all")} variant="outline">
                  Show All Bookings
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
