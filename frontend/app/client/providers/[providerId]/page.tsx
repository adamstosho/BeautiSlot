"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Instagram, MessageCircle, Facebook } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface Provider {
  id: string
  name: string
  avatarUrl?: string
  bio?: string
  location?: string
  categories?: string[]
  experienceYears?: number
  socialLinks?: {
    instagram?: string
    whatsapp?: string
    facebook?: string
  }
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

interface PortfolioItem {
  _id: string
  imageUrl: string
  caption?: string
  uploadedAt: string
}

interface Review {
  id: string
  clientName?: string
  rating: number
  review: string
  createdAt: string
}

export default function ProviderProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const providerId = params.providerId as string

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "client") {
      router.push("/auth/login")
      return
    }
    if (providerId) {
      fetchProvider()
      fetchServices()
      fetchPortfolio()
      fetchReviews()
    }
  }, [user, router, providerId, loading])

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
        description: "Failed to load provider profile",
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
    }
  }

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/${providerId}/portfolio`)
      if (response.ok) {
        const data = await response.json()
        setPortfolio(data.slice(0, 6)) // Show first 6 images
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/${providerId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.slice(0, 5)) // Show first 5 reviews
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

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
              <Link href="/client/search" className="text-[#6C63FF] hover:text-[#5B54E6]">
                ← Back to Search
              </Link>
            </div>
            <Link href={`/client/book/${providerId}`}>
              <Button className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="w-24 h-24 mx-auto sm:mx-0">
                  <AvatarImage src={provider.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white text-3xl">
                    {provider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-[#22223B] mb-2">{provider.name}</h1>
                  <div className="flex items-center justify-center sm:justify-start space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{provider.ratingsAverage?.toFixed(1) || "New"}</span>
                      {provider.ratingsCount && (
                        <span className="text-gray-500">({provider.ratingsCount} reviews)</span>
                      )}
                    </div>
                    {provider.location && (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                    )}
                  </div>
                  {provider.bio && <p className="text-gray-600 mb-4">{provider.bio}</p>}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                    {provider.categories?.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  {provider.experienceYears && (
                    <p className="text-sm text-gray-500 mb-4">{provider.experienceYears} years of experience</p>
                  )}
                  {provider.socialLinks && (
                    <div className="flex items-center justify-center sm:justify-start space-x-4">
                      {provider.socialLinks.instagram && (
                        <a
                          href={`https://instagram.com/${provider.socialLinks.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {provider.socialLinks.whatsapp && (
                        <a
                          href={`https://wa.me/${provider.socialLinks.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-600"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}
                      {provider.socialLinks.facebook && (
                        <a
                          href={provider.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#22223B]">Services</CardTitle>
                <CardDescription>Available services and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-[#22223B]">{service.name}</h3>
                          <div className="text-right">
                            <p className="font-semibold text-[#4ADE80]">₦{service.price.toLocaleString()}</p>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{service.durationMins} mins</span>
                            </div>
                          </div>
                        </div>
                        {service.description && <p className="text-sm text-gray-600 mb-2">{service.description}</p>}
                        {service.category && (
                          <Badge variant="secondary" className="mb-3">
                            {service.category}
                          </Badge>
                        )}
                        <Link href={`/client/book/${providerId}?serviceId=${service.id}`}>
                          <Button className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white" size="sm">
                            Book This Service
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No services available</p>
                )}
              </CardContent>
            </Card>

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#22223B]">Portfolio</CardTitle>
                  <CardDescription>Recent work showcase</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolio.map((item) => (
                      <div key={item._id} className="aspect-square relative rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.caption || "Portfolio image"}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-[#22223B]">Reviews</CardTitle>
                <CardDescription>What clients are saying</CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#22223B] text-sm">{review.clientName || "Anonymous"}</span>
                          <div className="flex space-x-1">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.review}</p>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
