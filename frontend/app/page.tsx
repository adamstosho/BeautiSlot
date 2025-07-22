"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Scissors,
  Sparkles,
  Calendar,
  Star,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Heart,
  Palette,
  Crown,
  Menu,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book appointments with your favorite beauty professionals in just a few clicks",
    },
    {
      icon: Users,
      title: "Verified Professionals",
      description: "Connect with certified and experienced beauty experts in your area",
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Read authentic reviews and ratings from real customers",
    },
    {
      icon: Clock,
      title: "Real-time Availability",
      description: "See live availability and book instantly without waiting",
    },
  ]

  const services = [
    { icon: Scissors, name: "Hair Styling", color: "bg-purple-100 text-purple-600" },
    { icon: Sparkles, name: "Makeup", color: "bg-pink-100 text-pink-600" },
    { icon: Heart, name: "Nail Care", color: "bg-red-100 text-red-600" },
    { icon: Palette, name: "Spa Services", color: "bg-blue-100 text-blue-600" },
    { icon: Crown, name: "Bridal", color: "bg-yellow-100 text-yellow-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#22223B]">BeautiSlot</span>
            </motion.div>

            {/* Desktop Nav */}
            <motion.div
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="#features" className="text-[#22223B] hover:text-[#6C63FF] transition-colors">
                Features
              </Link>
              <Link href="#services" className="text-[#22223B] hover:text-[#6C63FF] transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-[#22223B] hover:text-[#6C63FF] transition-colors">
                About
              </Link>
            </motion.div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                <Menu className="w-7 h-7 text-[#6C63FF]" />
              </button>
            </div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/auth/login">
                <Button variant="ghost" className="text-[#22223B] hover:text-[#6C63FF]">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:from-[#5B54E6] hover:to-[#E55A7A] text-white">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden">
            <div className="w-3/4 max-w-xs bg-white h-full shadow-lg p-6 flex flex-col">
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="self-end mb-8 p-2 rounded-md hover:bg-gray-100"
              >
                <span className="text-2xl">&times;</span>
              </button>
              <Link href="#features" className="mb-4 text-lg text-[#22223B] hover:text-[#6C63FF]" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#services" className="mb-4 text-lg text-[#22223B] hover:text-[#6C63FF]" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
              <Link href="#about" className="mb-4 text-lg text-[#22223B] hover:text-[#6C63FF]" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <div className="mt-auto flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-[#22223B] hover:text-[#6C63FF]">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:from-[#5B54E6] hover:to-[#E55A7A] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-[#6C63FF]/10 to-[#FF6584]/10 text-[#6C63FF] border-[#6C63FF]/20">
                ✨ Your Beauty, Our Priority
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold text-[#22223B] mb-6 leading-tight">
                Book Beauty Services
                <span className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] bg-clip-text text-transparent">
                  {" "}
                  Instantly
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with top-rated beauty professionals in your area. From haircuts to makeup, nail care to spa
                treatments - book your perfect beauty experience today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/register?role=client">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:from-[#5B54E6] hover:to-[#E55A7A] text-white px-8"
                  >
                    Book Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=provider">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white px-8 bg-transparent"
                  >
                    Join as Professional
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                  <span>Secure Payments</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <Image
                  src="/image.png"
                  alt="Beauty Salon"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-full h-auto mx-auto"
                />
              </div>

              {/* Floating Cards - adjust for mobile */}
              <motion.div
                className="absolute -top-4 left-0 sm:-left-4 bg-white p-4 rounded-xl shadow-lg max-w-[90vw] sm:max-w-xs"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#22223B]">4.9/5 Rating</p>
                    <p className="text-sm text-gray-600">1000+ Reviews</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 right-0 sm:-right-4 bg-white p-4 rounded-xl shadow-lg max-w-[90vw] sm:max-w-xs"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF6584] to-[#6C63FF] rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#22223B]">500+ Bookings</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#22223B] mb-4">Popular Beauty Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of beauty and personal care services from certified professionals
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={service.name} variants={fadeInUp} className="group">
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-0">
                    <div
                      className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-[#22223B] group-hover:text-[#6C63FF] transition-colors">
                      {service.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-[#F8F9FB] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#22223B] mb-4">Why Choose BeautiSlot?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make booking beauty services simple, secure, and convenient for everyone
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={fadeInUp} className="group">
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0 bg-white">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#22223B] mb-3 group-hover:text-[#6C63FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#6C63FF] to-[#FF6584]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Beauty Experience?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust BeautiSlot for their beauty needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=client">
                <Button size="lg" className="bg-white text-[#6C63FF] hover:bg-gray-100 px-8">
                  Start Booking
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/register?role=provider">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#6C63FF] px-8 bg-transparent"
                >
                  Become a Provider
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#22223B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BeautiSlot</span>
              </div>
              <p className="text-gray-400">Your trusted platform for booking beauty and personal care services.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    Find Professionals
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register?role=client" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/register?role=provider" className="hover:text-white transition-colors">
                    Join BeautiSlot
                  </Link>
                </li>
                <li>
                  <Link href="/provider-resources" className="hover:text-white transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BeautiSlot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
