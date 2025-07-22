"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Star, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Provider {
  id: string
  name: string
  avatarUrl?: string
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

export default function BookPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "client") {
      router.push("/auth/login")
      return
    }
    fetchProviders()
  }, [user, router, loading])

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers`)
      if (response.ok) {
        const data = await response.json()
        setProviders(data)
      }
    } catch (error) {
      console.error("Error fetching providers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async (providerId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/${providerId}/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setSelectedService(null)
    fetchServices(provider.id)
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    // Navigate to booking details page
    router.push(`/client/book/${selectedProvider?.id}?serviceId=${service.id}`)
  }

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.categories?.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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
            <h1 className="text-2xl font-bold text-[#22223B]">Book Appointment</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Provider Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#22223B]">Select Professional</CardTitle>
                <CardDescription>Choose a beauty professional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search professionals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredProviders.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedProvider?.id === provider.id
                            ? "border-[#6C63FF] bg-[#6C63FF]/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={provider.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                              {provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#22223B]">{provider.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {provider.ratingsAverage?.toFixed(1) || "New"}
                                </span>
                              </div>
                              {provider.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{provider.location}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {provider.categories?.slice(0, 2).map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#22223B]">Select Service</CardTitle>
                <CardDescription>
                  {selectedProvider ? `Services by ${selectedProvider.name}` : "Choose a professional first"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProvider ? (
                  <div className="space-y-3">
                    {services.length > 0 ? (
                      services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceSelect(service)}
                          className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-[#22223B]">{service.name}</h3>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              )}
                              {service.category && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#4ADE80]">₦{service.price.toLocaleString()}</p>
                              <div className="flex items-center space-x-1 text-gray-500 mt-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{service.durationMins} mins</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No services available</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Select a professional to view their services</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
