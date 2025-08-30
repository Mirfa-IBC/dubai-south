"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import RoiCalculator from "@/components/RoiCalculator"
import InvestorOnboardingForm from "@/components/InvestorOnboardingForm"
import {
  Shield,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  PenTool,
  CreditCard,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export default function DubaiInvestmentLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleApplyNow = () => {
    setIsModalOpen(true)
  }

  const portfolioProjects = [
    {
      id: 1,
      name: "G6 Dubai South",
      location: "Dubai South",
      description:
        "Exclusive investment opportunity in Dubai's fastest-growing district featuring premium residential and commercial spaces with world-class amenities.",
      irr: "20.8%",
      investment: "AED 50,000",
      timeline: "24-36 months",
      status: "Active Investment",
      statusColor: "bg-green-500",
      image: "/images/dubai-south-luxury-development-with-modern-archite.png",
      features: ["Prime Dubai South Location", "Modern Amenities", "High ROI Potential", "Limited to 20 Investors"],
    },
    {
      id: 2,
      name: "The Borough",
      location: "Jumeirah Village Circle",
      description:
        "Premium residential development in the heart of JVC featuring modern apartments with world-class amenities and strategic location benefits.",
      irr: "20.3%",
      investment: "AED 50,000",
      timeline: "24-36 months",
      status: "Investment Closed",
      statusColor: "bg-red-500",
      image: "/images/the-borough-jvc-luxury-residential-development.png",
      features: ["Prime JVC Location", "Modern Amenities", "High ROI Potential", "Proven Developer"],
    },
    {
      id: 3,
      name: "Numa Reserve",
      location: "Meydan, Dubai",
      description:
        "Exclusive luxury development in prestigious Meydan district offering unparalleled lifestyle amenities and proximity to Dubai's racing heritage.",
      irr: "30.3%",
      investment: "AED 75,000",
      timeline: "30-42 months",
      status: "Investment Closed",
      statusColor: "bg-red-500",
      image: "/images/numa-reserve-meydan-luxury-development.png",
      features: ["Meydan Prestige", "Luxury Amenities", "Racing Heritage", "Premium Location"],
    },
    {
      id: 4,
      name: "Ashton Park The Second",
      location: "Jumeirah Village Circle",
      description:
        "Second phase of the successful Ashton Park development, offering enhanced design and premium finishes in Dubai's sought-after JVC community.",
      irr: "23.6%",
      investment: "AED 60,000",
      timeline: "28-40 months",
      status: "Investment Closed",
      statusColor: "bg-red-500",
      image: "/images/ashton-park-second-jvc-modern-apartments.png",
      features: ["Phase 2 Enhancement", "Premium Finishes", "JVC Community", "Proven Success"],
    },
    {
      id: 5,
      name: "Ashton Park Residences",
      location: "Jumeirah Village Circle",
      description:
        "Flagship residential project featuring contemporary design and comprehensive amenities in one of Dubai's most vibrant communities.",
      irr: "29.4%",
      investment: "AED 55,000",
      timeline: "24-36 months",
      status: "Investment Closed",
      statusColor: "bg-red-500",
      image: "/images/ashton-park-residences-jvc-contemporary-design.png",
      features: ["Contemporary Design", "Comprehensive Amenities", "Vibrant Community", "Completed Success"],
    },
    {
      id: 6,
      name: "Ashton Park Townhouses",
      location: "Jumeirah Village Circle",
      description:
        "Exclusive townhouse development offering spacious family homes with private gardens and premium community facilities in JVC.",
      irr: "31.6%",
      investment: "AED 80,000",
      timeline: "32-44 months",
      status: "Investment Closed",
      statusColor: "bg-red-500",
      image: "/images/ashton-park-townhouses-jvc-family-homes.png",
      features: ["Spacious Family Homes", "Private Gardens", "Premium Facilities", "Exclusive Community"],
    },
    {
      id: 7,
      name: "Oak by Mirfa",
      location: "Furjan, Dubai",
      description:
        "Mirfa's inaugural UAE project featuring innovative design and sustainable living solutions in the established Furjan community.",
      irr: "49.8%",
      investment: "AED 45,000",
      timeline: "20-32 months",
      status: "Investment Closed",
      statusColor: "bg-red-500",
      image: "/images/oak-by-mirfa-furjan-sustainable-living.png",
      features: ["Inaugural Project", "Innovative Design", "Sustainable Living", "Established Community"],
    },
  ]

  const investorJourney = [
    {
      step: 1,
      title: "Apply for Investment",
      description: "Fill out our comprehensive investment application form",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      step: 2,
      title: "Receive Investor Agreement",
      description: "Review detailed terms and investment documentation",
      icon: Mail,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      step: 3,
      title: "Sign Documents",
      description: "Complete legal documentation and compliance requirements",
      icon: PenTool,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      step: 4,
      title: "Transfer Funds",
      description: "Transfer AED 50K or multiples to secure escrow account",
      icon: CreditCard,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      step: 5,
      title: "Receive Confirmation",
      description: "Get official confirmation and begin receiving updates",
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src="images/logo.png" alt="Mirfa Logo" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-white/90 text-sm font-light">
            <a href="#about" className="hover:text-white transition-colors">
              ABOUT
            </a>
            <a href="#location" className="hover:text-white transition-colors">
              LOCATION
            </a>
            <a href="#portfolio" className="hover:text-white transition-colors">
              PORTFOLIO
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              CONTACT
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            {/* <ThemeToggle /> */}
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-black transition-all bg-transparent"
              onClick={handleApplyNow}
            >
              APPLY NOW
            </Button>
          </div>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/dubai-south-skyline-with-modern-architecture-and-a.png"
            alt="Dubai South G 6 Development"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="inline-block mb-6">
              <div className="text-6xl md:text-8xl font-light mb-2">G6</div>
              <div className="text-lg md:text-xl font-light tracking-[0.2em] text-white/90">DUBAI SOUTH</div>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <p className="text-2xl md:text-xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed">
              Exclusive investment opportunity in Dubai's fastest-growing district
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm font-light">
              <div className="flex items-center space-x-2">
                <span className="text-white/70">MINIMUM INVESTMENT</span>
                <span className="text-primary font-medium">AED 50,000</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/70">TARGET IRR</span>
                <span className="text-primary font-medium">20.8%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/70">LIMITED TO</span>
                <span className="text-primary font-medium">20 INVESTORS</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-black transition-all bg-transparent"
            onClick={handleApplyNow}
          >
            SECURE YOUR INVESTMENT
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="flex flex-col items-center space-y-2"></div>
        </div>
      </section>

      <section className="py-24 bg-white" id="about">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900"> G6 Excellence Dubai South</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-16">
              G6 Dubai South  development represents a unique opportunity to invest in one of the region's most
              promising projects, backed by institutional-grade protections and transparent reporting in Dubai's
              fastest-growing district.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-gray-900">DIFC Regulated</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Fully compliant with Dubai International Financial Centre regulations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-gray-900">Escrow Protection</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Your funds are held in secure escrow until all conditions are met
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-gray-900">Quarterly Updates</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Regular progress reports delivered to your inbox
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900">Prime Location Benefits</h2>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                Strategically positioned in Dubai South, the city's fastest-growing district with unmatched connectivity
                and infrastructure
              </p>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="/dubai-south-location-map.png"
                alt="Dubai South Location Map"
                className="w-full h-[600px] md:h-[700px] object-cover"
              />
              <div className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-light text-gray-900 mb-2">5 MIN</div>
                    <div className="text-sm text-gray-600 font-light">TO AL MAKTOUM AIRPORT</div>
                    <div className="text-xs text-gray-500 mt-1">World's largest airport by 2030</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-light text-gray-900 mb-2">ADJACENT</div>
                    <div className="text-sm text-gray-600 font-light">TO EXPO CITY DUBAI</div>
                    <div className="text-xs text-gray-500 mt-1">Global business & innovation hub</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-light text-gray-900 mb-2">CONNECTED</div>
                    <div className="text-sm text-gray-600 font-light">TO METRO NETWORK</div>
                    <div className="text-xs text-gray-500 mt-1">Direct access to Dubai Metro</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-light text-gray-900 mb-2">FREE ZONE</div>
                    <div className="text-sm text-gray-600 font-light">BUSINESS ADVANTAGES</div>
                    <div className="text-xs text-gray-500 mt-1">100% foreign ownership</div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-lg font-light text-gray-900 mb-2">25 MIN TO DOWNTOWN</div>
                      <div className="text-sm text-gray-600">Direct highway access to Dubai's business district</div>
                    </div>
                    <div>
                      <div className="text-lg font-light text-gray-900 mb-2">15 MIN TO DUBAI MARINA</div>
                      <div className="text-sm text-gray-600">Quick access to luxury waterfront living</div>
                    </div>
                    <div>
                      <div className="text-lg font-light text-gray-900 mb-2">30 MIN TO PALM JUMEIRAH</div>
                      <div className="text-sm text-gray-600">Easy reach to iconic Dubai attractions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900">Investment Portfolio</h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Discover our exclusive real estate opportunities across Dubai's prime locations
            </p>
          </div>

          <div className="space-y-32">
            {portfolioProjects.map((project, index) => (
              <div
                key={project.id}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={`${project.name} development`}
                      className="w-full h-[400px] lg:h-[500px] object-cover"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-8">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">{project.name}</h3>
                    <div className="text-gray-600 font-light mb-6">{project.location}</div>
                    <p className="text-gray-600 font-light leading-relaxed text-lg">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-2xl font-light text-primary mb-1">{project.irr}</div>
                      {project.status === "Active Investment" ? (
                        <div className="text-xs text-gray-500 font-light tracking-wider">TARGET IRR</div>
                        ) : (
                          <div className="text-xs text-gray-500 font-light tracking-wider">Achived IRR</div>
                        )}
                      
                    </div>
                    <div>
                      <div className="text-lg font-light text-gray-900 mb-1">{project.investment}</div>
                      <div className="text-xs text-gray-500 font-light tracking-wider">MIN INVESTMENT</div>
                    </div>
                    <div>
                      <div className="text-lg font-light text-gray-900 mb-1">{project.timeline}</div>
                      <div className="text-xs text-gray-500 font-light tracking-wider">TIMELINE</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    {project.status === "Active Investment" ? (
                      <Button
                        variant="outline"
                        className="bg-primary hover:bg-primary/90 text-black font-medium"
                        onClick={handleApplyNow}
                      >
                        INVEST NOW
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${project.statusColor}`}
                        >
                          {project.status}
                        </span>
                        <span className="text-sm text-gray-500 font-light">No longer accepting investments</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Journey Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Investment Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, transparent process from application to confirmation
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2 hidden lg:block" />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
                {investorJourney.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div key={item.step} className="relative">
                      {/* Mobile Timeline Line */}
                      {index < investorJourney.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-primary to-accent lg:hidden" />
                      )}

                      <Card className="relative bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                        <CardContent className="pt-6 text-center">
                          {/* Step Number */}
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {item.step}
                          </div>

                          {/* Icon */}
                          <div
                            className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                          >
                            <IconComponent className={`h-8 w-8 ${item.color}`} />
                          </div>

                          {/* Content */}
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>

                          {/* Arrow for larger screens */}
                          {index < investorJourney.length - 1 && (
                            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden lg:block">
                              <ArrowRight className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8" onClick={handleApplyNow}>
                Start Your Investment Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="roi" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Investment ROI (AED 50K–1M)</h2>
            <p className="mt-3 opacity-80">
              Plan and compare returns using our real schedule. Adjust the amount; cash flows scale automatically.
            </p>
          </div>
          <div className="mt-10">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Dubai South G 6 Development?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Backed by institutional-grade protections and transparent reporting in Dubai's premier business district
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>DIFC SPV Structure</CardTitle>
                <CardDescription>
                  Regulated by Dubai International Financial Centre with full legal protection
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Escrow Protection</CardTitle>
                <CardDescription>Your funds are held in secure escrow until all conditions are met</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Quarterly Updates</CardTitle>
                <CardDescription>
                  Regular progress reports and financial updates delivered to your inbox
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Proven Track Record</CardTitle>
                <CardDescription>Our development team has delivered 15+ successful projects in Dubai</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Exclusive Access</CardTitle>
                <CardDescription>Limited to 20 sophisticated investors for personalized attention</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Prime Location</CardTitle>
                <CardDescription>
                  Strategic location near Al Maktoum International Airport and Expo City
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Get answers to common questions about the investment opportunity
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
  {[
    { v: "item-1", q: "What is the minimum investment amount?", a: "The minimum investment amount is AED 50,000..." },
    { v: "item-2", q: "How is the 20.8% IRR target calculated?", a: "The target IRR is based on conservative market projections..." },
    { v: "item-3", q: "What protections are in place for investors?", a: "We use a DIFC SPV structure, escrow accounts..." },
    { v: "item-4", q: "What is the expected investment timeline?", a: "24–36 months from initial investment to exit..." },
    { v: "item-5", q: "Can international investors participate?", a: "Yes. Our DIFC structure accommodates global participation..." },
  ].map(({ v, q, a }) => (
    <AccordionItem
      key={v}
      value={v}
      className="rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden"
    >
      <AccordionTrigger className="px-6 py-4 text-left aria-expanded:font-medium data-[state=open]:text-foreground">
        <span className="flex-1">{q}</span>
        <span className="transition-transform duration-200 data-[state=open]:rotate-180" />
      </AccordionTrigger>

      {/* animated content; keep overflow-hidden for clean rounded corners */}
      <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed overflow-hidden">
        {a}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl lg:text-4xl font-bold mb-6">
        Secure Your Dubai South G 6 Position Today
      </h2>

      <p className="text-xl text-muted-foreground mb-8">
        Only 20 investment positions available in this exclusive Dubai South G 6 development opportunity.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        {/* Primary CTA */}
        <Button
          variant="outline"
          size="lg"
          className="bg-accent hover:bg-accent/90 text-lg px-8"
          onClick={handleApplyNow}
          aria-label="Apply for investment in Dubai South G 6"
          data-analytics="cta-apply-investment"
        >
          Apply for Investment
        </Button>

        {/* Call CTA */}


        {/* WhatsApp CTA (optional but recommended) */}
        <Button
          asChild
          variant="outline"
          size="lg"
          className="text-lg px-8 bg-transparent"
        >
          <a
            href="https://wa.me/97180064732"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp at +971 800 MIRFA"
            data-analytics="cta-whatsapp"
          >
            Chat on WhatsApp
          </a>
        </Button>
      </div>

      {/* Contact strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-2">
          <Phone className="h-4 w-4" aria-hidden="true" />
          <a
            href="tel:+97180064732"
            className="hover:underline"
            aria-label="Call +971 800 MIRFA"
            data-analytics="contact-phone"
          >
            +971 800 MIRFA (64732)
          </a>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Mail className="h-4 w-4" aria-hidden="true" />
          <a
            href="mailto:invest@mirfa.com"
            className="hover:underline"
            aria-label="Email invest@mirfa.com"
            data-analytics="contact-email"
          >
            invest@mirfa.com
          </a>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <a
            href="https://www.google.com/maps/search/?api=1&query=DIFC,+Dubai,+UAE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            aria-label="Open location in Google Maps: DIFC, Dubai, UAE"
            data-analytics="contact-map"
          >
            DIFC, Dubai, UAE
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<footer className="bg-gray-900 text-white py-16">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
      
      {/* Brand */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">M</span>
          </div>
          <div className="flex items-center">
            <img src="images/logo.png" alt="Mirfa Logo" className="h-8" />
          </div>
        </div>
        <p className="text-gray-400 font-light leading-relaxed">
          G6 Dubai South development – Exclusive real estate investment
          opportunity in Dubai&apos;s premier business district.
        </p>
      </div>

      {/* Investment */}
      <div>
        <h4 className="font-medium mb-6 tracking-wider text-sm">INVESTMENT</h4>
        <ul className="space-y-3 text-gray-400 font-light text-sm">
          <li><a href="#investment" className="hover:text-white">Minimum Investment</a></li>
          <li><a href="#returns" className="hover:text-white">Target Returns</a></li>
          <li><a href="#timeline" className="hover:text-white">Investment Timeline</a></li>
          <li><a href="#risk" className="hover:text-white">Risk Factors</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="font-medium mb-6 tracking-wider text-sm">LEGAL</h4>
        <ul className="space-y-3 text-gray-400 font-light text-sm">
          <li><a href="/regulation" className="hover:text-white">DIFC Regulation</a></li>
          <li><a href="/terms" className="hover:text-white">Terms &amp; Conditions</a></li>
          <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
          <li><a href="/compliance" className="hover:text-white">Compliance</a></li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="font-medium mb-6 tracking-wider text-sm">CONTACT</h4>
        <ul className="space-y-3 text-gray-400 font-light text-sm">
          <li>
            <a href="tel:+97180064732" className="hover:text-white" aria-label="Call +971 800 MIRFA">
              +971 800 MIRFA (64732)
            </a>
          </li>
          <li>
            <a href="mailto:invest@mirfa.com" className="hover:text-white" aria-label="Email invest@mirfa.com">
              invest@mirfa.com
            </a>
          </li>
          <li>
            <a
              href="https://www.google.com/maps/search/?api=1&query=DIFC,+Dubai,+UAE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="Open DIFC Dubai UAE on Google Maps"
            >
              DIFC, Dubai, UAE
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
      <p className="text-gray-500 font-light text-sm">
        © 2025 MIRFA IBC. All rights reserved. Regulated by DIFC.
      </p>
    </div>
  </div>
</footer>


      {/* Investor Onboarding Form Modal */}
      {isModalOpen && <InvestorOnboardingForm onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}