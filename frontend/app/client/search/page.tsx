"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Star, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

export default function SearchPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("")

  const categories = [
    "Hair Styling",
    "Hair Coloring",
    "Makeup",
    "Nail Care",
    "Spa Services",
    "Massage",
    "Facial",
    "Eyebrow & Lashes",
    "Bridal Services",
    "Men's Grooming",
  ]

  useEffect(() => {
    if (!user || user.role !== "client") {
      router.push("/auth/login")
      return
    }
    fetchProviders()
  }, [user, router])

  useEffect(() => {
    filterProviders()
  }, [providers, searchQuery, selectedCategory, selectedLocation])

  const fetchProviders = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (selectedLocation) params.append("location", selectedLocation)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers?${params}`)
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

  const filterProviders = () => {
    let filtered = providers

    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.categories?.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((provider) => provider.categories?.includes(selectedCategory))
    }

    if (selectedLocation) {
      filtered = filtered.filter((provider) =>
        provider.location?.toLowerCase().includes(selectedLocation.toLowerCase()),
      )
    }

    setFilteredProviders(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLocation("")
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
              <Link href="/client/dashboard" className="text-[#6C63FF] hover:text-[#5B54E6]">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#22223B]">Find Professionals</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Filter
              </CardTitle>
              <CardDescription>Find the perfect beauty professional for your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Location..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />

                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#22223B]">
            {filteredProviders.length} Professional{filteredProviders.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={provider.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                          {provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-[#22223B] truncate">{provider.name}</CardTitle>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {provider.ratingsAverage?.toFixed(1) || "New"}
                            {provider.ratingsCount && ` (${provider.ratingsCount})`}
                          </span>
                        </div>
                        {provider.location && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 truncate">{provider.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {provider.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.bio}</p>}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {provider.categories?.slice(0, 3).map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {provider.categories && provider.categories.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{provider.categories.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/client/providers/${provider.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/client/book/${provider.id}`}>
                        <Button variant="outline">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">No Professionals Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or clear filters</p>
              <Button onClick={clearFilters} className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
