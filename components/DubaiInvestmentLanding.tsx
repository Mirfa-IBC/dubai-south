"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import RoiCalculator from "@/components/RoiCalculator"
import InvestorOnboardingForm from "@/components/InvestorOnboardingForm"
import { SiInstagram, SiYoutube,SiWhatsapp } from '@icons-pack/react-simple-icons'


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
  ExternalLink,
} from "lucide-react"

const WHATSAPP_LINK = "https://wa.me/97180064732?text=Hi%20MIRFA%20team%2C%20I%27m%20interested%20in%20the%20G6%20Dubai%20South%20investment.";

const SOCIAL = {
  instagram: "https://www.instagram.com/mirfaibc/",              // ← replace with your real handle
  youtube:   "https://www.youtube.com/@mirfaibc",           // ← replace with your real handle
} as const

export default function DubaiInvestmentLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleApplyNow = () => setIsModalOpen(true)

  const portfolioProjects = [
    {
      id: 1,
      name: "G6 – Dubai South",
      location: "Dubai South – Residential District",
      description:
        "Planned for delivery in October 2027. Fully furnished residential units with integrated commercial spaces in Dubai’s fastest-growing district, combining modern design with world-class connectivity.",
      irr: "20.8%",
      investment: "AED 50,000",
      timeline: "24–36 months",
      status: "Active Investment",
      statusColor: "bg-green-500",
      image: "/images/dubai-south-luxury-development-with-modern-archite.png",
      features: ["Fully Furnished Units", "Integrated Commercial", "World-Class Connectivity", "Limited to 20 Investors"],
      detailUrl: "/projects/g6-dubai-south",
    },
    {
      id: 7,
      name: "OAK – Furjan (Inaugural Project)",
      location: "Furjan, Dubai",
      description:
        "Delivered in April 2023. MIRFA’s first UAE development, defined by innovation and forward-thinking architecture within the established Furjan community.",
      irr: "49.8%",
      investment: "AED 45,000",
      timeline: "14 months",
      status: "Delivered Apr 2023",
      statusColor: "bg-red-500",
      image: "/images/oak-by-mirfa-furjan-sustainable-living.png",
      features: ["Inaugural Project", "Innovative Design", "Sustainable Living", "Established Community"],
      detailUrl: "https://www.mirfa.com/oak-by-mirfa",
    },
    {
      id: 6,
      name: "Ashton Park Townhouses – JVC",
      location: "Jumeirah Village Circle",
      description:
        "Delivered in April 2025. Spacious family living with private pools, directly opposite landscaped parks, blending contemporary design with shared community facilities.",
      irr: "31.6%",
      investment: "AED 80,000",
      timeline: "15 months",
      status: "Delivered Apr 2025",
      statusColor: "bg-red-500",
      image: "/images/ashton-park-townhouses-jvc-family-homes.png",
      features: ["Private Pools", "Opposite Parks", "Contemporary Design", "Community Facilities"],
      detailUrl: "https://www.mirfa.com/ashton-park-elegance-townhouse",
    },
    {
      id: 5,
      name: "Ashton Park Residences – JVC",
      location: "Jumeirah Village Circle",
      description:
        "Scheduled for completion in October 2025. Contemporary, fully furnished apartments, with select units featuring private plunge pools and comprehensive amenities.",
      irr: "29.4%",
      investment: "AED 50,000",
      timeline: "20 months",
      status: "Delivering Sep 2025",
      statusColor: "bg-red-500",
      image: "/images/ashton-park-residences-jvc-contemporary-design.png",
      features: ["Fully Furnished", "Plunge Pool Options", "Comprehensive Amenities", "Vibrant Community"],
      detailUrl: "https://www.mirfa.com/ashton-park-apartments",
    },
    {
      id: 4,
      name: "Ashton Park – The Second (JVC)",
      location: "Jumeirah Village Circle",
      description:
        "Expected delivery in April 2026. Fully furnished apartments with enhanced layouts and finishes, including select units with private plunge pools.",
      irr: "23.6%",
      investment: "AED 60,000",
      timeline: "21 months",
      status: "Delivering Apr 2026",
      statusColor: "bg-red-500",
      image: "/images/ashton-park-second-jvc-modern-apartments.png",
      features: ["Enhanced Layouts", "Premium Finishes", "Plunge Pool Options", "Refined Living"],
      detailUrl: "https://www.mirfa.com/ashton-park-the-second",
    },
    {
      id: 3,
      name: "NUMA Reserve – Meydan District 11 (Flagship)",
      location: "Meydan District 11, Dubai",
      description:
        "Set for delivery in April 2027. Flagship development defined by refined design, high-end finishes, and curated lifestyle amenities in one of Dubai’s most prestigious districts.",
      irr: "30.3%",
      investment: "AED 100,000",
      timeline: "18 months",
      status: "Delivering Apr 2027",
      statusColor: "bg-red-500",
      image: "/images/numa-reserve-meydan-luxury-development.png",
      features: ["Flagship Quality", "High-End Finishes", "Curated Amenities", "Prestigious Address"],
      detailUrl: "https://www.mirfa.com/numa-reserve",
    },
    {
      id: 2,
      name: "The Borough – JVC",
      location: "Jumeirah Village Circle",
      description:
        "Scheduled for delivery in November 2027. Modern community of fully furnished apartments, complemented by well-designed amenities in a central JVC location.",
      irr: "20.3%",
      investment: "AED 50,000",
      timeline: "28–30 months",
      status: "Delivering Feb 2028",
      statusColor: "bg-red-500",
      image: "/images/the-borough-jvc-luxury-residential-development.png",
      features: ["Fully Furnished", "Thoughtful Amenities", "Central JVC", "Modern Community"],
      detailUrl: "https://www.mirfa.com/the-borough",
    },
  ] as const

  const activeProjects = portfolioProjects.filter(p => p.status === "Active Investment")
  const pastProjects = portfolioProjects.filter(p => p.status !== "Active Investment")

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
            <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
            <a href="#location" className="hover:text-white transition-colors">LOCATION</a>
            <a href="#portfolio" className="hover:text-white transition-colors">PORTFOLIO</a>
            <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Social icons */}
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              data-analytics="social-instagram-header"
              title="Instagram"
            >
              <SiInstagram className="h-5 w-5 text-white" />
            </a>
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe on YouTube"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              data-analytics="social-youtube-header"
              title="YouTube"
            >
              <SiYoutube className="h-5 w-5 text-white" />
            </a>

            {/* WhatsApp (mobile icon-only) */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp at 800 MIRFA"
              data-analytics="social-whatsapp-header-mobile"
              title="WhatsApp"
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full
                        bg-[#25D366] hover:bg-[#1DA851] transition text-white"
            >
              <SiWhatsapp className="h-5 w-5" />
            </a>

            {/* WhatsApp (desktop/tablet labeled) */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp at 800 MIRFA"
              data-analytics="social-whatsapp-header"
              title="WhatsApp"
              className="hidden md:inline-flex h-9 items-center gap-2 rounded-full px-3 font-medium
                        bg-[#25D366] hover:bg-[#1DA851] transition text-white"
            >
              <SiWhatsapp className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>


            {/* Primary CTA */}
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

      {/* Hero */}
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
      </section>

      {/* About */}
      <section className="py-24 bg-white" id="about">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900"> G6 Excellence Dubai South</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-16">
              G6 Dubai South development represents a unique opportunity to invest in one of the region's most
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
                <h3 className="text-xl font-medium mb-4 text-gray-900">DIFC Account Protection</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Your funds are held in DIFC regulated account until all conditions are met
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

      {/* Location */}
      <section id="location" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900">Location – Dubai South – Residential District</h2>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Strategically located in Dubai South, the city’s fastest-growing district, this development benefits
  from unmatched connectivity and modern infrastructure. The residential district has been carefully
  planned to provide a balanced lifestyle, combining contemporary housing, green open spaces, schools,
  retail, and healthcare facilities. Its proximity to Al Maktoum International Airport, Expo City Dubai,
  and the upcoming metro network makes it one of Dubai’s most promising areas for long-term growth and
  community living.
              </p>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="/dubai-south-location-map.png"
                alt="Dubai South Location Map"
                className="w-full h-[480px] md:h-[700px] object-cover"
              />
              <div className="p-6 md:p-12">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Globe className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="text-xl md:text-2xl font-light text-gray-900 mb-1 md:mb-2">5 MIN</div>
                    <div className="text-xs md:text-sm text-gray-600 font-light">TO AL MAKTOUM AIRPORT</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">World's largest airport by 2030</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <MapPin className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="text-xl md:text-2xl font-light text-gray-900 mb-1 md:mb-2">ADJACENT</div>
                    <div className="text-xs md:text-sm text-gray-600 font-light">TO EXPO CITY DUBAI</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">Global business & innovation hub</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="text-xl md:text-2xl font-light text-gray-900 mb-1 md:mb-2">CONNECTED</div>
                    <div className="text-xs md:text-sm text-gray-600 font-light">TO METRO NETWORK</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">Direct access to Dubai Metro</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <CheckCircle className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="text-xl md:text-2xl font-light text-gray-900 mb-1 md:mb-2">FREE ZONE</div>
                    <div className="text-xs md:text-sm text-gray-600 font-light">BUSINESS ADVANTAGES</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">100% foreign ownership</div>
                  </div>
                </div>

                <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                    <div>
                      <div className="text-base md:text-lg font-light text-gray-900 mb-1">25 MIN TO DOWNTOWN</div>
                      <div className="text-sm text-gray-600">Direct highway access to Dubai's business district</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-light text-gray-900 mb-1">15 MIN TO DUBAI MARINA</div>
                      <div className="text-sm text-gray-600">Quick access to luxury waterfront living</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-light text-gray-900 mb-1">30 MIN TO PALM JUMEIRAH</div>
                      <div className="text-sm text-gray-600">Easy reach to iconic Dubai attractions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900">Investment Portfolio</h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Over the past several years, MIRFA has established a track record of delivering thoughtfully designed
            communities across Dubai’s prime districts. From our inaugural project in Furjan to flagship
            developments in Meydan and growth opportunities in Dubai South, each project reflects our commitment
            to refined design, enduring value, and investor confidence. The portfolio below highlights completed
            and upcoming developments that continue to shape MIRFA’s presence in Dubai’s most sought-after
            locations.
            </p>
          </div>

          {/* Open for Investment */}
          {activeProjects.length > 0 && (
            <div className="space-y-12 mb-24">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 text-center">Open for Investment</h3>
              <div className="mt-10 space-y-24">
                {activeProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}
                  >
                    <div className="w-full lg:w-1/2">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={`${project.name} development`}
                          className="w-full h-[320px] md:h-[420px] lg:h-[500px] object-cover"
                        />
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
                      <div>
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-green-600">
                            {project.status}
                          </span>
                        </div>
                        <h4 className="text-3xl md:text-4xl font-light mb-3 text-gray-900">{project.name}</h4>
                        <div className="text-gray-600 font-light mb-4">{project.location}</div>
                        <p className="text-gray-600 font-light leading-relaxed text-base md:text-lg">
                          {project.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 md:gap-8">
                        <div>
                          <div className="text-2xl font-light text-primary mb-1">{project.irr}</div>
                          <div className="text-[11px] md:text-xs text-gray-500 font-light tracking-wider">TARGET IRR</div>
                        </div>
                        <div>
                          <div className="text-lg font-light text-gray-900 mb-1">{project.investment}</div>
                          <div className="text-[11px] md:text-xs text-gray-500 font-light tracking-wider">MIN INVESTMENT</div>
                        </div>
                        <div>
                          <div className="text-lg font-light text-gray-900 mb-1">{project.timeline}</div>
                          <div className="text-[11px] md:text-xs text-gray-500 font-light tracking-wider">DEVELOPMENT TIMELINE</div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="bg-primary hover:bg-primary/90 text-black font-medium"
                          onClick={handleApplyNow}
                        >
                          INVEST NOW
                        </Button>
                        {/* <Button asChild variant="outline" className="bg-transparent">
                          <a
                            href={project.detailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View details for ${project.name}`}
                          >
                            View Details <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Projects */}
          <div className="space-y-12">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 text-center">Past Projects</h3>
            <div className="mt-10 space-y-24">
              {pastProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}
                >
                  <div className="w-full lg:w-1/2">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={`${project.name} development`}
                        className="w-full h-[320px] md:h-[420px] lg:h-[500px] object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${project.statusColor}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <h4 className="text-3xl md:text-4xl font-light mb-3 text-gray-900">{project.name}</h4>
                      <div className="text-gray-600 font-light mb-4">{project.location}</div>
                      <p className="text-gray-600 font-light leading-relaxed text-base md:text-lg">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 md:gap-8">
                      <div>
                        <div className="text-2xl font-light text-primary mb-1">{project.irr}</div>
                        <div className="text-[11px] md:text-xs text-gray-500 font-light tracking-wider">ACHIEVED IRR</div>
                      </div>
                      <div>
                        <div className="text-lg font-light text-gray-900 mb-1">{project.investment}</div>
                        <div className="text-[11px] md:text-xs text-gray-500 font-light tracking-wider">MIN INVESTMENT</div>
                      </div>
                      <div>
                        <div className="text-lg font-light text-gray-900 mb-1">{project.timeline}</div>
                        <div className="text-[11px] md:text-xs text-gray-500 font-light tracking-wider">DEVELOPMENT TIMELINE</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-sm text-gray-500 font-light">No longer accepting investments</span>
                      <Button asChild variant="outline" className="bg-transparent">
                        <a
                          href={project.detailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View details for ${project.name}`}
                        >
                          View Details <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Investor Journey */}
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
                      {index < investorJourney.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-primary to-accent lg:hidden" />
                      )}

                      <Card className="relative bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20"
                        onClick={handleApplyNow}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleApplyNow()
                          }
                        }}
                        tabIndex={0}
                        data-analytics={`investor-journey-step-${item.step}`}
                        >
                        <CardContent className="pt-6 text-center">
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {item.step}
                          </div>

                          <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <IconComponent className={`h-8 w-8 ${item.color}`} />
                          </div>

                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>

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

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8" onClick={handleApplyNow}>
                Start Your Investment Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section id="investment" className="relative py-20">
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

      

      {/* Features */}
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
                <CardTitle>DIFC Regulated Account Protection</CardTitle>
                <CardDescription>Your funds are held in a DIFC-regulated account until all conditions are met.</CardDescription>
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
                <CardDescription>Our development team has delivered 5+ successful projects in Dubai</CardDescription>
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

      {/* FAQ */}
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
                { v: "item-1", q: "What is the minimum investment amount?", a: "The minimum investment amount is AED 50,000" },
                { v: "item-2", q: "How is the 20.8% IRR target calculated?", a: "The target IRR is based on conservative market projections" },
                { v: "item-3", q: "What protections are in place for investors?", a: "We use a DIFC SPV structure, escrow accounts" },
                { v: "item-4", q: "What is the expected investment timeline?", a: "24–36 months from initial investment to exit" },
                { v: "item-5", q: "Can international investors participate?", a: "Yes. Our DIFC structure accommodates global participation" },
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
      <section className="py-20 bg-muted/30" id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Secure Your Dubai South G 6 Position Today
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Only 20 investment positions available in this exclusive Dubai South G 6 development opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

              <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-[#25D366] hover:bg-[#1DA851] text-white"
            >
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp at 800 MIRFA"
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
                  aria-label="Call 800 MIRFA"
                  data-analytics="contact-phone"
                >
                  800 MIRFA (64732)
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

      <div className="border-t border-gray-800 mt-12 pt-6 text-center">
  <p className="text-gray-500 text-xs max-w-3xl mx-auto leading-relaxed">
    Disclaimer: This material is provided for informational purposes only and does not constitute a public 
    offer, solicitation, or recommendation to invest. Participation is available exclusively to invited 
    sophisticated investors in accordance with DIFC regulations.
  </p>
</div>
      {/* Footer */}
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
                  <a href="tel:+97180064732" className="hover:text-white" aria-label="Call  800 MIRFA">
                    800 MIRFA (64732)
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

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500 font-light text-sm">
              © 2025 MIRFA IBC. All rights reserved. Regulated by DIFC.
            </p>
          </div>
        </div>
      </footer>
      <a
  href={WHATSAPP_LINK}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="WhatsApp quick chat"
  data-analytics="fab-whatsapp"
  className="fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full h-14 w-14
             bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg md:hidden"
>
  <SiWhatsapp className="h-6 w-6" />
</a>

      {/* Investor Onboarding Form Modal */}
      {isModalOpen && <InvestorOnboardingForm onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
