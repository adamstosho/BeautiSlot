"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Star, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { format } from "date-fns"

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

interface Service {
  id: string
  name: string
  description?: string
  category?: string
  price: number
  durationMins: number
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookProviderPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [provider, setProvider] = useState<Provider | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<{ startTime: string; endTime: string; available: boolean }[]>([])
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  const providerId = params.providerId as string
  const preSelectedServiceId = searchParams.get("serviceId")

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "client") {
      router.push("/auth/login")
      return
    }
    if (providerId) {
      fetchProvider()
      fetchServices()
    }
  }, [user, router, providerId, loading])

  useEffect(() => {
    if (preSelectedServiceId && services.length > 0) {
      const service = services.find((s) => s.id === preSelectedServiceId)
      if (service) {
        setSelectedService(service.id)
      }
    }
  }, [preSelectedServiceId, services])

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots()
    }
  }, [selectedDate, selectedService])

  const fetchProvider = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/${providerId}`)
      if (response.ok) {
        const data = await response.json()
        setProvider(data)
      }
    } catch (error) {
      console.error("Error fetching provider:", error)
      toast({
        title: "Error",
        description: "Failed to load provider information",
        variant: "destructive",
      })
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/${providerId}/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/${providerId}/availability?date=${dateStr}&serviceId=${selectedService}`,
      )
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.slots || [])
      }
    } catch (error) {
      console.error("Error fetching available slots:", error)
      // Fallback to default slots if API fails
      const defaultSlots = [
        { startTime: "09:00", endTime: "10:00", available: true },
        { startTime: "10:00", endTime: "11:00", available: true },
        { startTime: "11:00", endTime: "12:00", available: false },
        { startTime: "12:00", endTime: "13:00", available: true },
        { startTime: "13:00", endTime: "14:00", available: false },
        { startTime: "14:00", endTime: "15:00", available: true },
        { startTime: "15:00", endTime: "16:00", available: true },
        { startTime: "16:00", endTime: "17:00", available: true },
        { startTime: "17:00", endTime: "18:00", available: false },
      ]
      setAvailableSlots(defaultSlots)
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a service, date, and time",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)
    try {
      // Find the selected service to get its duration
      const service = services.find((s) => s.id === selectedService)
      if (!service) throw new Error("Service not found")
      // Calculate endTime
      const [startHour, startMinute] = selectedSlot.startTime.split(":").map(Number)
      const startDate = new Date(0, 0, 0, startHour, startMinute)
      const endDate = new Date(startDate.getTime() + service.durationMins * 60000)
      const endHour = endDate.getHours().toString().padStart(2, "0")
      const endMinute = endDate.getMinutes().toString().padStart(2, "0")
      const endTime = `${endHour}:${endMinute}`

      const bookingData = {
        providerId,
        serviceId: selectedService,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot.startTime,
        endTime,
        notes: notes.trim(),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been successfully booked",
        })
        router.push("/client/bookings")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create booking")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6C63FF]"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#22223B] mb-2">Provider Not Found</h2>
          <p className="text-gray-600 mb-4">The provider you're looking for doesn't exist.</p>
          <Link href="/client/search">
            <Button className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">Find Other Providers</Button>
          </Link>
        </div>
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
              <Link href="/client/search" className="text-[#6C63FF] hover:text-[#5B54E6] flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Search
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#22223B]">Book Appointment</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={provider.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white text-xl">
                    {provider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#22223B] mb-1">{provider.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {provider.ratingsAverage && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{provider.ratingsAverage.toFixed(1)}</span>
                        {provider.ratingsCount && <span>({provider.ratingsCount} reviews)</span>}
                      </div>
                    )}
                    {provider.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                    )}
                  </div>
                  {provider.categories && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {provider.categories.slice(0, 3).map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-[#22223B]">Book Your Appointment</CardTitle>
              <CardDescription>Select your preferred service, date, and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service">Select Service *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-[#4ADE80] font-semibold">₦{service.price.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm">({service.durationMins}min)</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedServiceData && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#22223B]">{selectedServiceData.name}</h4>
                        {selectedServiceData.description && (
                          <p className="text-sm text-gray-600 mt-1">{selectedServiceData.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#4ADE80]">₦{selectedServiceData.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{selectedServiceData.durationMins} minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Select Date *</Label>
                <div className="border rounded-lg p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    className="rounded-md"
                  />
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && selectedService && (
                <div className="space-y-2">
                  <Label>Select Time *</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.startTime + '-' + slot.endTime}
                        variant={selectedSlot && selectedSlot.startTime === slot.startTime && selectedSlot.endTime === slot.endTime ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot({ startTime: slot.startTime, endTime: slot.endTime })}
                        className={`${
                          selectedSlot && selectedSlot.startTime === slot.startTime && selectedSlot.endTime === slot.endTime ? "bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white" : ""
                        } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {slot.startTime} – {slot.endTime}
                      </Button>
                    ))}
                  </div>
                  {availableSlots.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No available slots for this date</p>
                  )}
                </div>
              )}

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or notes for the provider..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Booking Summary */}
              {selectedService && selectedDate && selectedSlot && (
                <div className="p-4 bg-gradient-to-r from-[#6C63FF]/10 to-[#FF6584]/10 rounded-lg">
                  <h4 className="font-semibold text-[#22223B] mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Service:</span> {selectedServiceData?.name}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {selectedSlot.startTime} – {selectedSlot.endTime}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> {selectedServiceData?.durationMins} minutes
                    </p>
                    <p>
                      <span className="font-medium">Price:</span> ₦{selectedServiceData?.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                disabled={!selectedService || !selectedDate || !selectedSlot || isBooking}
                className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white py-3"
                size="lg"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
