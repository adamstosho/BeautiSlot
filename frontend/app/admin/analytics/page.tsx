"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, PieChart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface AnalyticsData {
  totalUsers: number
  totalProviders: number
  totalClients: number
  totalBookings: number
  totalRevenue?: number
  monthlyGrowth?: number
  // Optionally keep the other fields for future use
}

export default function AdminAnalyticsPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
      return
    }
    fetchAnalytics()
  }, [user, router, timeRange, loading])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/analytics?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Map backend fields to frontend expected fields
        setAnalytics({
          totalUsers: data.totalUsers,
          totalProviders: data.totalProviders,
          totalClients: data.totalClients,
          totalBookings: data.totalBookings,
          totalRevenue: data.totalRevenue,
          monthlyGrowth: data.monthlyGrowth,
        })
      } else {
        throw new Error("Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || loading) {
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
              <Link href="/admin/dashboard" className="text-[#6C63FF] hover:text-[#5B54E6]">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#22223B]">Analytics Report</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#22223B] mb-2">Platform Analytics</h2>
            <p className="text-gray-600">Comprehensive insights into platform performance</p>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {analytics ? (
          <>
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-[#22223B]">{analytics.totalUsers}</p>
                      <p className="text-sm text-[#4ADE80]">+{analytics.monthlyGrowth || 0}% this month</p>
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
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-[#22223B]">{analytics.totalBookings}</p>
                      <p className="text-sm text-[#4ADE80]">Active platform usage</p>
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
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-[#22223B]">
                        ₦{(analytics.totalRevenue || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-[#4ADE80]">Platform earnings</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FACC15] to-[#FF6584] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Providers</p>
                      <p className="text-2xl font-bold text-[#22223B]">{analytics.totalProviders}</p>
                      <p className="text-sm text-[#4ADE80]">Active professionals</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FF6584] to-[#6C63FF] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Distribution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="w-5 h-5 mr-2" />
                      User Distribution
                    </CardTitle>
                    <CardDescription>Breakdown of user types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-[#6C63FF]/10 rounded-lg">
                        <span className="font-medium text-[#22223B]">Providers</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-[#6C63FF] rounded-full"></div>
                          <span className="font-semibold">{analytics.totalProviders}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#4ADE80]/10 rounded-lg">
                        <span className="font-medium text-[#22223B]">Clients</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-[#4ADE80] rounded-full"></div>
                          <span className="font-semibold">{analytics.totalClients}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#FF6584]/10 rounded-lg">
                        <span className="font-medium text-[#22223B]">Total Users</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-[#FF6584] rounded-full"></div>
                          <span className="font-semibold">{analytics.totalUsers}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Platform Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Platform Statistics
                    </CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            1
                          </div>
                          <span className="font-medium text-[#22223B]">Total Bookings</span>
                        </div>
                        <span className="font-semibold text-[#4ADE80]">{analytics.totalBookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#4ADE80] to-[#6C63FF] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            2
                          </div>
                          <span className="font-medium text-[#22223B]">Active Providers</span>
                        </div>
                        <span className="font-semibold text-[#4ADE80]">{analytics.totalProviders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#FF6584] to-[#FACC15] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            3
                          </div>
                          <span className="font-medium text-[#22223B]">Registered Clients</span>
                        </div>
                        <span className="font-semibold text-[#4ADE80]">{analytics.totalClients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#FACC15] to-[#FF6584] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            4
                          </div>
                          <span className="font-medium text-[#22223B]">Platform Revenue</span>
                        </div>
                        <span className="font-semibold text-[#4ADE80]">
                          ₦{(analytics.totalRevenue || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">No Analytics Data</h3>
              <p className="text-gray-600">Unable to load analytics data at this time</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
