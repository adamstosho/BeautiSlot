"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Clock, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface TimeSlot {
  startTime: string
  endTime: string
}

interface Availability {
  id: string
  dayOfWeek: string
  slots: TimeSlot[]
}

export default function AvailabilityPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null)
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    slots: [{ startTime: "", endTime: "" }],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  useEffect(() => {
    if (!user || user.role !== "provider") {
      router.push("/auth/login")
      return
    }
    fetchAvailabilities()
  }, [user, router])

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/availability`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAvailabilities(data)
      }
    } catch (error) {
      console.error("Error fetching availabilities:", error)
      toast({
        title: "Error",
        description: "Failed to fetch availability",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const availabilityData = {
        dayOfWeek: formData.dayOfWeek,
        slots: formData.slots.filter((slot) => slot.startTime && slot.endTime),
      }

      const url = editingAvailability
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/availability/${editingAvailability.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/availability`

      const method = editingAvailability ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(availabilityData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Availability ${editingAvailability ? "updated" : "created"} successfully`,
        })
        fetchAvailabilities()
        resetForm()
        setIsDialogOpen(false)
      } else {
        throw new Error("Failed to save availability")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save availability",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (availability: Availability) => {
    setEditingAvailability(availability)
    setFormData({
      dayOfWeek: availability.dayOfWeek,
      slots: availability.slots.length > 0 ? availability.slots : [{ startTime: "", endTime: "" }],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (availabilityId: string) => {
    if (!confirm("Are you sure you want to delete this availability?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/availability/${availabilityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Availability deleted successfully",
        })
        fetchAvailabilities()
      } else {
        throw new Error("Failed to delete availability")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete availability",
        variant: "destructive",
      })
    }
  }

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      slots: [...formData.slots, { startTime: "", endTime: "" }],
    })
  }

  const removeTimeSlot = (index: number) => {
    setFormData({
      ...formData,
      slots: formData.slots.filter((_, i) => i !== index),
    })
  }

  const updateTimeSlot = (index: number, field: "startTime" | "endTime", value: string) => {
    const updatedSlots = formData.slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    setFormData({ ...formData, slots: updatedSlots })
  }

  const resetForm = () => {
    setFormData({
      dayOfWeek: "",
      slots: [{ startTime: "", endTime: "" }],
    })
    setEditingAvailability(null)
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
            <h1 className="text-2xl font-bold text-[#22223B]">Manage Availability</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#22223B]">Your Availability</h2>
            <p className="text-gray-600">Set your working hours for each day of the week</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white" onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Availability
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingAvailability ? "Edit Availability" : "Add Availability"}</DialogTitle>
                <DialogDescription>Set your working hours for a specific day</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week *</Label>
                  <Select
                    value={formData.dayOfWeek}
                    onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Time Slots</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>

                  {formData.slots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, "startTime", e.target.value)}
                        placeholder="Start time"
                        required
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, "endTime", e.target.value)}
                        placeholder="End time"
                        required
                      />
                      {formData.slots.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white"
                  >
                    {isSubmitting ? "Saving..." : editingAvailability ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {availabilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availabilities.map((availability) => (
              <motion.div
                key={availability.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-[#22223B] flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          {availability.dayOfWeek}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(availability)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(availability.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {availability.slots.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </div>
                      ))}
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
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">No Availability Set</h3>
              <p className="text-gray-600 mb-6">Start by setting your working hours</p>
              <Button
                className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Set Your First Availability
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
