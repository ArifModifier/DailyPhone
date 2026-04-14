"use client"

import type React from "react"
import Image from "next/image"
import Script from "next/script"
import { Smartphone } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Clock,
  Shield,
  Recycle,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  Zap,
  Mail,
  Menu,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function DailyPhoneLanding() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Ensure video plays after component mounts
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.loop = true
      video.playsInline = true

      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log("Video autoplay failed:", error)
          // Add click listener for manual play
          const handleClick = async () => {
            try {
              await video.play()
              document.removeEventListener("click", handleClick)
            } catch (e) {
              console.log("Manual play failed:", e)
            }
          }
          document.addEventListener("click", handleClick, { once: true })
        }
      }

      // Try to play video when it's loaded
      if (video.readyState >= 3) {
        playVideo()
      } else {
        video.addEventListener("canplay", playVideo, { once: true })
      }

      // Intersection Observer to play video when in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && video.paused) {
              playVideo()
            }
          })
        },
        { threshold: 0.1 },
      )

      observer.observe(video)

      return () => {
        observer.disconnect()
        video.removeEventListener("canplay", playVideo)
      }
    }
  }, [])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      errors.name = "Name ist erforderlich"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name muss mindestens 2 Zeichen lang sein"
    }

    if (!formData.email.trim()) {
      errors.email = "E-Mail ist erforderlich"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Telefonnummer ist erforderlich"
    } else if (!/^[+]?[0-9\s\-()]{8,}$/.test(formData.phone.trim())) {
      errors.phone = "Bitte geben Sie eine gültige Telefonnummer ein"
    }

    if (!formData.message.trim()) {
      errors.message = "Nachricht ist erforderlich"
    } else if (formData.message.trim().length < 10) {
      errors.message = "Nachricht muss mindestens 10 Zeichen lang sein"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("https://formspree.io/f/xvgrblka", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        const errorData = await response.json()
        console.error("Formspree error:", errorData)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBrandDisplayName = (brand: string) => {
    const brandNames: { [key: string]: string } = {
      iphone: "iPhone",
      samsung: "Samsung Galaxy",
      other: "Sonstige Marken (bitte anfragen)"


    }
    return brandNames[brand] || brand
  }

  const getModelsForBrand = (brand: string) => {
    const models: { [key: string]: string[] } = {
      iphone: [
        "iPhone 15 Pro Max",
        "iPhone 15 Pro",
        "iPhone 15 Plus",
        "iPhone 14 Pro Max",
        "iPhone 14 Pro",
        "iPhone 14 Plus",
        "iPhone 14",
        "iPhone 13 Pro Max",
        "iPhone 13 Pro",
        "iPhone 13",
        "iPhone 12 Pro Max",
        "iPhone 12 Pro",
        "iPhone 12",
        "iPhone 11 Pro Max",
        "iPhone 11 Pro",
        "iPhone 11",
        "iPhone XR MAx",
        "iPhone XS",
        "iPhone XR",
        "iPhone X",
        "iPhone SE",
        "iPhone 8 Plus",
        "iPhone 8",
        "iPhone 7 Plus",
        "iPhone 7",
        "iPhone 6 Plus",
        "iPhone 6s",
        "iPhone 6",


      ],
      samsung: [
        "Galaxy S24 Ultra",
        "Galaxy S24+",
        "Galaxy S24",
        "Galaxy S23 Ultra",
        "Galaxy S23+",
        "Galaxy S23",
        "Galaxy S22 Ultra",
        "Galaxy S22+",
        "Galaxy S22",
        "Galaxy S21 Ultra",
        "Galaxy S21+",
        "Galaxy S21",
        "Galaxy Note 20 Ultra",
        "Galaxy Note 20",
      ],
      huawei: [
        "P60 Pro",
        "P60",
        "P50 Pro",
        "P50",
        "P40 Pro",
        "P40",
        "P30 Pro",
        "P30",
        "Mate 50 Pro",
        "Mate 50",
        "Mate 40 Pro",
        "Mate 40",
      ],
      xiaomi: [
        "14 Ultra",
        "14 Pro",
        "14",
        "13 Ultra",
        "13 Pro",
        "13",
        "12 Pro",
        "12",
        "11 Ultra",
        "11 Pro",
        "11",
        "Redmi Note 13 Pro",
        "Redmi Note 12 Pro",
      ],
      oppo: [
        "Find X7 Ultra",
        "Find X7",
        "Find X6 Pro",
        "Find X6",
        "Find X5 Pro",
        "Find X5",
        "Reno 11 Pro",
        "Reno 11",
        "Reno 10 Pro",
        "Reno 10",
      ],
      oneplus: ["12 Pro", "12", "11 Pro", "11", "10 Pro", "10T", "10", "9 Pro", "9", "8 Pro", "8T", "8"],
      google: [
        "Pixel 8 Pro",
        "Pixel 8",
        "Pixel 7 Pro",
        "Pixel 7",
        "Pixel 6 Pro",
        "Pixel 6",
        "Pixel 5",
        "Pixel 4 XL",
        "Pixel 4",
      ],
    }
    return models[brand] || []
  }

  const getServiceDisplayName = (service: string) => {
    const serviceNames: { [key: string]: string } = {
      display: "Display-Reparatur",
      battery: "Akku-Wechsel",
      backglass: "Rückglas-Reparatur",
      camera: "Kamera-Reparatur",
      other: "Sonstige Reparaturen (bitte anfragen)"
    }
    return serviceNames[service] || service
  }

  const getPriceForSelection = (brand: string, model: string, service: string) => {
    // Vollständiger Preisbaum für iPhone-Modelle (alle Preise bereits um 5 € reduziert)
const iphonePrices: any = {
  "SE": { prime: 69, orig: 69, battery: 49, back: 89, glas: 89, cam: 59, camglas: 49 },
  "6": { prime: 49, orig: 49, battery: 29, back: 0, glas: 0, cam: 39, camglas: 0 },
  "6 Plus": { prime: 49, orig: 49, battery: 29, back: 0, glas: 0, cam: 39, camglas: 0 },
  "6s": { prime: 49, orig: 49, battery: 29, back: 0, glas: 0, cam: 39, camglas: 0 },
  "6s Plus": { prime: 49, orig: 49, battery: 29, back: 0, glas: 0, cam: 39, camglas: 0 },
  "7": { prime: 59, orig: 59, battery: 39, back: 89, glas: 89, cam: 59, camglas: 29 },
  "7 Plus": { prime: 59, orig: 59, battery: 19, back: 39, glas: 39, cam: 39, camglas: 39 },
  "8": { prime: 59, orig: 69, battery: 19, back: 49, glas: 39, cam: 39, camglas: 39 },
  "8 Plus": { prime: 59, orig: 79, battery: 19, back: 49, glas: 39, cam: 39, camglas: 39 },
  "X": { prime: 99, orig: 119, battery: 49, back: 59, glas: 49, cam: 49, camglas: 59 },
  "Xs": { prime: 99, orig: 119, battery: 49, back: 59, glas: 49, cam: 49, camglas: 59 },
  "Xs Max": { prime: 99, orig: 129, battery: 49, back: 69, glas: 49, cam: 49, camglas: 59 },
  "XR": { prime: 89, orig: 109, battery: 49, back: 49, glas: 49, cam: 49, camglas: 49 },
  "11": { prime: 89, orig: 109, battery: 49, back: 49, glas: 49, cam: 49, camglas: 49 },
  "11 Pro": { prime: 99, orig: 139, battery: 59, back: 69, glas: 49, cam: 49, camglas: 59 },
  "11 Pro Max": { prime: 119, orig: 149, battery: 59, back: 79, glas: 59, cam: 59, camglas: 69 },
  "12 Mini": { orig: 169, battery: 69, back: 179, glas: 59, cam: 59, camglas: 59 },
  "12": { prime: 99, orig: 119, battery: 69, back: 159, glas: 109, cam: 119, camglas: 59 },
  "12 Pro": { prime: 99, orig: 119, battery: 69, back: 159, glas: 69, cam: 59, camglas: 69 },
  "12 Pro Max": { prime: 149, orig: 199, battery: 69, back: 89, glas: 69, cam: 59, camglas: 69 },
  "13 Mini": { prime: 119, orig: 159, battery: 69, back: 79, glas: 69, cam: 59, camglas: 69 },
  "13": { prime: 129, orig: 169, battery: 69, back: 89, glas: 79, cam: 69, camglas: 79 },
  "13 Pro": { prime: 179, orig: 219, battery: 79, back: 99, glas: 89, cam: 69, camglas: 89 },
  "13 Pro Max": { prime: 189, orig: 229, battery: 79, back: 99, glas: 99, cam: 69, camglas: 89 },
  "14": { prime: 129, orig: 149, battery: 79, back: 89, glas: 79, cam: 69, camglas: 79 },
  "14 Plus": { prime: 189, orig: 189, battery: 89, back: 229, glas: 129, cam: 139, camglas: 69 },
  "14 Pro": { prime: 229, orig: 299, battery: 89, back: 229, glas: 159, cam: 189, camglas: 69 },
  "14 Pro Max": { prime: 229, orig: 359, battery: 109, back: 299, glas: 99, cam: 69, camglas: 99 },
  "15": { prime: 229, orig: 269, battery: 79, back: 189, glas: 139, cam: 149, camglas: 119 },
  "15 Plus": { prime: 309, orig: 349, battery: 109, back: 229, glas: 149, cam: 149, camglas: 109 },
  "15 Pro": { prime: 269, orig: 299, battery: 109, back: 239, glas: 139, cam: 199, camglas: 139 },
  "15 Pro Max": { prime: 319, orig: 389, battery: 109, back: 269, glas: 159, cam: 199, camglas: 139 }
};

    // Mapping von UI-Modelnamen auf Preisbaum-Keys
    const modelMap: { [key: string]: string } = {
      "iPhone SE": "SE",
      "iPhone 6": "6",
      "iPhone 6 Plus": "6 Plus",
      "iPhone 6s": "6s",
      "iPhone 6s Plus": "6s Plus",
      "iPhone 7": "7",
      "iPhone 7 Plus": "7 Plus",
      "iPhone 8": "8",
      "iPhone 8 Plus": "8 Plus",
      "iPhone X": "X",
      "iPhone Xs": "Xs",
      "iPhone Xs Max": "Xs Max",
      "iPhone XR": "XR",
      "iPhone 11": "11",
      "iPhone 11 Pro": "11 Pro",
      "iPhone 11 Pro Max": "11 Pro Max",
      "iPhone 12 Mini": "12 Mini",
      "iPhone 12": "12",
      "iPhone 12 Pro": "12 Pro",
      "iPhone 12 Pro Max": "12 Pro Max",
      "iPhone 13 Mini": "13 Mini",
      "iPhone 13": "13",
      "iPhone 13 Pro": "13 Pro",
      "iPhone 13 Pro Max": "13 Pro Max",
      "iPhone 14": "14",
      "iPhone 14 Plus": "14 Plus",
      "iPhone 14 Pro": "14 Pro",
      "iPhone 14 Pro Max": "14 Pro Max",
      "iPhone 15": "15",
      "iPhone 15 Plus": "15 Plus",
      "iPhone 15 Pro": "15 Pro",
      "iPhone 15 Pro Max": "15 Pro Max"
    };

    // Mapping von UI-Service auf Preisbaum-Keys
    const serviceMap: { [key: string]: string[] } = {
      display: ["prime", "orig"], // Zeige preferiert "prime", fallback "orig"
      battery: ["battery"],
      backglass: ["back", "glas"], // preferiert "back", fallback "glas"
      camera: ["cam", "camera", "camglas"], // preferiert "cam", fallback "camglas"
    };

    if (brand === "iphone") {
      // Modellnamen normalisieren
      let mappedModel = modelMap[model] || model.replace(/^iPhone /, "");
      let priceObj = iphonePrices[mappedModel];
      if (!priceObj) return 99;
      // Service-Key(s) bestimmen
      const keys = serviceMap[service] || [];
      // Display: Zeige immer beide Preise (prime und orig) als String kombiniert
      if (service === "display") {
        return `${priceObj.prime} / ${priceObj.orig}€`;
      }
      // Akku, Backglass, Kamera
      for (const key of keys) {
        if (priceObj[key] !== undefined) return priceObj[key];
      }
      // Fallback für charging, speaker
      if (service === "charging") return 89;
      if (service === "speaker") return 79;
      // Sonst Standardpreis
      return 99;
    }

    // Restliche Logik bleibt unverändert:
    const basePrices: { [key: string]: { [key: string]: number } } = {
      samsung: {
        display: model.includes("S24")
          ? 249
          : model.includes("S23")
            ? 229
            : model.includes("S22")
              ? 219
              : model.includes("S21")
                ? 219
                : 99,
        battery: 69,
        backglass: model.includes("S24") ? 119 : model.includes("S23") ? 99 : model.includes("S22") ? 89 : 79,
        camera: model.includes("S24") ? 129 : model.includes("S23") ? 109 : 99,
        charging: 69,
        speaker: 59,
      },
      huawei: {
        display: model.includes("P60") ? 149 : model.includes("P50") ? 129 : model.includes("P40") ? 109 : 89,
        battery: 59,
        backglass: model.includes("P60") ? 99 : model.includes("P50") ? 89 : 79,
        camera: model.includes("P60") ? 109 : 99,
        charging: 59,
        speaker: 49,
      },
      xiaomi: {
        display: model.includes("14") ? 129 : model.includes("13") ? 109 : model.includes("12") ? 89 : 79,
        battery: 49,
        backglass: model.includes("14") ? 79 : model.includes("13") ? 69 : 59,
        camera: model.includes("14") ? 89 : 79,
        charging: 49,
        speaker: 39,
      },
      oppo: {
        display: model.includes("Find X7")
          ? 139
          : model.includes("Find X6")
            ? 119
            : model.includes("Reno 11")
              ? 99
              : 89,
        battery: 49,
        backglass: model.includes("Find X7") ? 89 : model.includes("Find X6") ? 79 : 69,
        camera: model.includes("Find X7") ? 99 : 89,
        charging: 49,
        speaker: 39,
      },
      oneplus: {
        display: model.includes("12") ? 139 : model.includes("11") ? 119 : model.includes("10") ? 99 : 89,
        battery: 49,
        backglass: model.includes("12") ? 89 : model.includes("11") ? 79 : 69,
        camera: model.includes("12") ? 99 : 89,
        charging: 49,
        speaker: 39,
      },
      google: {
        display: model.includes("8") ? 129 : model.includes("7") ? 109 : model.includes("6") ? 89 : 79,
        battery: 49,
        backglass: model.includes("8") ? 79 : model.includes("7") ? 69 : 59,
        camera: model.includes("8") ? 89 : 79,
        charging: 49,
        speaker: 39,
      },
    }

    return basePrices[brand]?.[service] || 99
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedModel("")
    setSelectedService("")
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Google Analytics / Ads Tag */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-0N7YNLCVJD"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0N7YNLCVJD');
          `,
        }}
      />
      <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div>
              <div
                className="relative flex items-center justify-center w-36 aspect-[3/1] rounded-full border-2 border-[#87CEEB] bg-slate-800 cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                <Image
                  src="/logoschrift.png"
                  alt="DailyPhone Logo"
                  fill
                  className="object-contain rounded-full p-1.5 scale-170 translate-y-2"
                  priority
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("preise")}
                className="text-gray-300 hover:text-[#87CEEB] transition-colors duration-200 font-medium"
              >
                Preise
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-300 hover:text-[#87CEEB] transition-colors duration-200 font-medium"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("shop")}
                className="text-gray-300 hover:text-[#87CEEB] transition-colors duration-200 font-medium"
              >
                Shop
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-300 hover:text-[#87CEEB] transition-colors duration-200 font-medium"
              >
                Kontakt
              </button>
            </nav>

            {/* Contact Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                className="hidden md:flex bg-[#87CEEB] hover:bg-[#6BB6D6] text-slate-800 font-medium px-6 py-2 rounded-full transition-all duration-200"
                onClick={() => scrollToSection("contact")}
              >
                Kontakt
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-300 hover:text-[#87CEEB] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-slate-700 border-t border-slate-600">
              <nav className="py-4 space-y-2">
                <button
                  onClick={() => scrollToSection("preise")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-[#87CEEB] hover:bg-slate-600 transition-colors duration-200"
                >
                  Preise
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-[#87CEEB] hover:bg-slate-600 transition-colors duration-200"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("shop")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-[#87CEEB] hover:bg-slate-600 transition-colors duration-200"
                >
                  Shop
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-[#87CEEB] hover:bg-slate-600 transition-colors duration-200"
                >
                  Kontakt
                </button>
                <div className="px-4 py-2">
                  <Button
                    className="w-full bg-[#87CEEB] hover:bg-[#6BB6D6] text-slate-800 font-medium py-2 rounded-full transition-all duration-200"
                    onClick={() => window.open("https://wa.me/03023320906", "_blank")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover cursor-pointer"
            style={{ filter: "brightness(1.1)" }}
            onClick={async () => {
              if (videoRef.current) {
                try {
                  if (videoRef.current.paused) {
                    await videoRef.current.play()
                  }
                } catch (error) {
                  console.log("Manual video play failed:", error)
                }
              }
            }}
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {
                  console.log("Autoplay blocked, video will play on user interaction")
                })
              }
            }}
            onError={(e) => {
              console.log("Video failed to load:", e)
            }}
          >
            <source src="/hvideo.mp4" type="video/mp4" />
            <source src="./hvideo.mp4" type="video/mp4" />
            <source src="/public/hvideo.mp4" type="video/mp4" />
          </video>

          {/* Play button overlay for when video is paused */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm border border-white/30">
              <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
            </div>
          </div>

          <div className="absolute inset-0 bg-slate-900/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 drop-shadow-2xl">
            Daily<span className="text-[#87CEEB]">Phone</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light">
            Berlins schnellster Handy-Reparaturservice ohne Termin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button

              className="bg-[#87CEEB] hover:bg-[#6BB6D6] text-slate-800 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => scrollToSection("preise")}
            >
              Preise ansehen
            </Button>
            <Button

              className="border-2 border-[#87CEEB] text-[#87CEEB] hover:bg-[#87CEEB] hover:text-slate-800 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-transparent"
              onClick={() => window.open("https://wa.me/03023320906", "_blank")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Price Section */}
      <section id="preise" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Preise berechnen</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wählen Sie Ihr Gerät und erhalten Sie sofort den Reparaturpreis
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 shadow-2xl bg-white border-0">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="brand-select" className="text-lg font-semibold mb-3 block text-slate-800">
                    1. Wählen Sie Ihre Handy-Marke
                  </Label>
                  <Select value={selectedBrand} onValueChange={handleBrandChange}>
                    <SelectTrigger className="w-full h-12 text-lg shadow-lg border-2 border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB] rounded-lg bg-white text-slate-800 placeholder:text-gray-500">
                      <SelectValue placeholder="Marke auswählen..." />
                    </SelectTrigger>
                    <SelectContent className="border-[#87CEEB] bg-white text-slate-800 shadow-xl">
  <SelectItem value="iphone" className="hover:bg-[#87CEEB]/20">iPhone</SelectItem>
 

  <div className="px-3 py-2 pl-8 text-sm text-gray-500 font-medium opacity-70 cursor-default select-none">
    Sonstige Marken (bitte telefonisch anfragen)
  </div>
                      {/* 
                      <SelectItem value="samsung" className="hover:bg-[#87CEEB]/20">Samsung Galaxy</SelectItem>
                       <SelectItem value="huawei" className="hover:bg-[#87CEEB]/20">Huawei</SelectItem>
  <SelectItem value="xiaomi" className="hover:bg-[#87CEEB]/20">Xiaomi</SelectItem>
  <SelectItem value="oppo" className="hover:bg-[#87CEEB]/20">OPPO</SelectItem>
  <SelectItem value="oneplus" className="hover:bg-[#87CEEB]/20">OnePlus</SelectItem>
  <SelectItem value="google" className="hover:bg-[#87CEEB]/20">Google Pixel</SelectItem>
  */}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBrand && (
                  <div className="animate-in slide-in-from-top-5 duration-300">
                    <Label className="text-lg font-semibold mb-4 block text-slate-800">
                      2. Wählen Sie Ihr {getBrandDisplayName(selectedBrand)} Modell und Service
                    </Label>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="model-select" className="font-medium mb-2 block text-gray-700">
                          Modell
                        </Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="w-full shadow-lg border-2 border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB] rounded-lg bg-white text-slate-800 placeholder:text-gray-500">
                            <SelectValue placeholder="Modell wählen..." />
                          </SelectTrigger>
                          <SelectContent className="border-[#87CEEB] bg-white text-slate-800 shadow-xl">
                            {getModelsForBrand(selectedBrand).map((model) => (
                              <SelectItem key={model} value={model} className="hover:bg-[#87CEEB]/20">
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="service-select" className="font-medium mb-2 block text-gray-700">
                          Reparatur-Service
                        </Label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                          <SelectTrigger className="w-full shadow-lg border-2 border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB] rounded-lg bg-white text-slate-800 placeholder:text-gray-500">
                            <SelectValue placeholder="Service wählen..." />
                          </SelectTrigger>
                          <SelectContent className="border-[#87CEEB] bg-white text-slate-800 shadow-xl">
                            <SelectItem value="display" className="hover:bg-[#87CEEB]/20">Display-Reparatur</SelectItem>
                            <SelectItem value="battery" className="hover:bg-[#87CEEB]/20">Akku-Wechsel</SelectItem>
                            <SelectItem value="backglass" className="hover:bg-[#87CEEB]/20">Rückglas-Reparatur</SelectItem>
                            <SelectItem value="camera" className="hover:bg-[#87CEEB]/20">Kamera-Reparatur</SelectItem>
                            <SelectItem value="charging" className="hover:bg-[#87CEEB]/20">Ladebuchse-Reparatur</SelectItem>
                            <SelectItem value="speaker" className="hover:bg-[#87CEEB]/20">Lautsprecher-Reparatur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedModel && selectedService && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-[#87CEEB] to-[#6BB6D6] rounded-xl text-slate-800 animate-in slide-in-from-bottom-5 duration-300 shadow-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {getServiceDisplayName(selectedService)} für {selectedModel}
                            </h3>
                            <p className="text-slate-700 mb-4">Professionelle Reparatur mit 12 Monaten Garantie</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center">
                                <Zap className="h-4 w-4 mr-1" />
                                Express möglich
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                12 Monate Garantie
                              </div>
                                <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                Ohne Termin
                              </div>
                            </div>
                          </div>
                          <div className="sm:text-right text-center sm:min-w-[160px]">
                            <div className="mb-2">
                              {(() => {
                                const price = getPriceForSelection(selectedBrand, selectedModel, selectedService);
                                // Custom display logic for Display-Reparatur with Prime/Original
                                if (
                                  selectedService === "display" &&
                                  typeof price === "string" &&
                                  price.includes("/")
                                ) {
                                  return (
                                    <>
                                      <span className="text-xl font-semibold">Prime: {price.split("/")[0].trim()}</span>
                                      <br />
                                      <span className="text-xl font-semibold">Original: {price.split("/")[1].replace("€", "").trim()}€</span>
                                    </>
                                  );
                                }
                                return <span className="text-3xl font-bold">{price}€</span>;
                              })()}
                            </div>
                            <p className="text-slate-700 text-sm">inkl. MwSt.</p>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                          <Button
                            className="bg-slate-800 text-white hover:bg-slate-700 flex-1 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                           onClick={() => window.open("https://www.google.com/maps/place/DailyPhone+-+Handyreparatur+Laden+in+Berlin/@52.4945341,13.3531479,17z/data=!3m1!4b1!4m6!3m5!1s0x47a85103ebfddd11:0x5ad98d095c58d8b3!8m2!3d52.4945309!4d13.3557282!16s%2Fg%2F11xmjx_cqt?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D", "_blank")}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Google Maps
                          </Button>
                          <Button
                            className="border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full bg-transparent"
                            onClick={() => window.location.href = "tel:03023535168"}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Anrufen
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Unsere Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Von iPhone-Reparaturen bis hin zu Express-Service – wir haben die Lösung für Ihr Handy-Problem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-[#87CEEB] to-[#6BB6D6] p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-lg">
                  <Smartphone className="h-12 w-12 text-slate-800 mx-auto" />
                </div>
                <CardTitle className="text-slate-800">iPhone Reparaturen</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">Alle iPhone Modelle</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Display: ab 89€</li>
                  <li>• Akku: ab 59€</li>
                  <li>• Rückglas: ab 79€</li>
                  <li>• Kamera: ab 99€</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-[#87CEEB] to-[#6BB6D6] p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-lg">
                  <Clock className="h-12 w-12 text-slate-800 mx-auto" />
                </div>
                <CardTitle className="text-slate-800">Express-Reparatur</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">30 Minuten Service</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Display-Tausch in 30 Min</li>
                  <li>• Akku-Wechsel sofort</li>
                  <li>• Während Sie warten</li>
                  <li>• Keine Terminbuchung nötig</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-[#87CEEB] to-[#6BB6D6] p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-lg">
                  <Shield className="h-12 w-12 text-slate-800 mx-auto" />
                </div>
                <CardTitle className="text-slate-800">Zubehör & Schutz</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">Premium Qualität</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Panzerglas ab 15€</li>
                  <li>• Hüllen & Cases</li>
                  <li>• Ladekabel & Adapter</li>
                  <li>• Kopfhörer & AirPods</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-[#87CEEB] to-[#6BB6D6] p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-lg">
                  <Recycle className="h-12 w-12 text-slate-800 mx-auto" />
                </div>
                <CardTitle className="text-slate-800">Ankauf & Tausch</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">Faire Preise</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Handy-Ankauf</li>
                  <li>• Trade-In Angebote</li>
                  <li>• Sofortige Bewertung</li>
                  <li>• Barzahlung möglich</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Buy & Sell Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kaufen <span className="text-[#87CEEB]">und</span> Verkaufen
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ihr Partner für den Kauf und Verkauf von Smartphones in Berlin
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative w-fit mx-auto">
              <img
                src="/ankauf.png"
                alt="Ankauf mit Smartphone und Geldschein"
                className="w-2/4 h-auto mx-auto rounded-2xl shadow-2xl"
              />
              <img
                src="/geld.png"
                alt="Geldstück"
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 animate-bounce drop-shadow-xl"
                style={{ zIndex: 10 }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Ankauf Description */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Ankauf</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Erstklassige Smartphones, die von unseren Experten geprüft wurden. Kaufen Sie sorgenfrei mit unserer
                  Garantie und dem DailyPhone Care-Paket in unserem Store oder Online.
                </p>
                <Button
                  className="bg-gradient-to-r from-[#87CEEB] to-[#6BB6D6] hover:from-[#6BB6D6] hover:to-[#5AA5C9] text-slate-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => scrollToSection("contact")}
                >
                  Smartphones kaufen
                </Button>
              </div>

              {/* Verkauf Description */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Verkauf</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Holen Sie das Beste aus Ihrem alten Handy heraus. Sofortiges Angebot und Cash-on-the-Spot in unserem
                  Geschäft oder zu uns senden und ein Angebot erhalten.
                </p>
                <Button
                  className="border-2 border-[#87CEEB] text-[#87CEEB] hover:bg-[#87CEEB] hover:text-slate-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                  onClick={() => window.open("https://wa.me/03023320906", "_blank")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Handy verkaufen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Information */}
      <section id="shop" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Unser Shop</h2>
            <p className="text-xl text-gray-600">Besuchen Sie uns in Berlin-Schöneberg</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="p-8 shadow-2xl bg-white border-0 hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <MapPin className="h-6 w-6 mr-3 text-[#87CEEB]" />
                  Adresse & Anfahrt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-slate-800">DailyPhone Berlin</h4>
                  <p className="text-slate-800 font-medium">
                    Pallastraße 25
                    <br />
                    10781 Berlin
                    <br />
                    Deutschland
                  </p>
                  <p className="text-sm text-[#3399CC] font-semibold mt-2">
                    Bus 204 stops directly in front of the shop.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-slate-800">Öffentliche Verkehrsmittel:</h4>
                  <p className="text-slate-800 text-sm font-medium">
                    U-Bahn: Kleistpark (U7)
                    <br />
                    Bus: M48, M85, 187, 204
                  </p>
                </div>
                <Button
                  className="w-full border-2 border-[#87CEEB] text-[#87CEEB] hover:bg-[#87CEEB] hover:text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full bg-transparent"
                  onClick={() => window.open("https://www.google.com/maps/place/DailyPhone+-+Handyreparatur+Laden+in+Berlin/@52.4945341,13.3531479,17z/data=!3m1!4b1!4m6!3m5!1s0x47a85103ebfddd11:0x5ad98d095c58d8b3!8m2!3d52.4945309!4d13.3557282!16s%2Fg%2F11xmjx_cqt?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D", "_blank")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  In Google Maps öffnen
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 shadow-2xl bg-white border-0 hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <Clock className="h-6 w-6 mr-3 text-green-600" />
                  Öffnungszeiten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
               <div className="space-y-3">
  <div className="flex justify-between">
    <span className="font-semibold text-slate-800">Montag - Samstag</span>
    <span className="text-slate-800 font-semibold">11:00 - 19:30</span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold text-slate-800">Sonntags</span>
    <span className="text-red-600 font-semibold">Geschlossen</span>
  </div>
</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Kontakt aufnehmen</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Haben Sie Fragen? Schreiben Sie uns oder kommen Sie direkt vorbei!
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <Card className="p-6 shadow-2xl bg-white border-0 h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-800 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-[#87CEEB]" />
                    Direkter Kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-[#87CEEB]/10 to-[#6BB6D6]/10 rounded-lg border border-[#87CEEB]/20">
                    <h4 className="font-semibold text-slate-800 mb-2">Telefon</h4>
                    <p className="text-lg font-bold text-slate-800">03023535168</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-600 mb-2">WhatsApp</h4>
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg rounded-full"
                      onClick={() => window.open("https://wa.me/03023320906", "_blank")}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Sofort schreiben
                    </Button>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">E-Mail</h4>
                    <p className="text-sm text-gray-600 break-words">dailyphonestore@gmail.com</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="p-8 shadow-2xl bg-white border-0">
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50/80 border border-green-200 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">
                        Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei
                        Ihnen.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="h-5 w-5 text-red-600 mr-2">⚠️</div>
                      <p className="text-red-800 font-medium">
                        Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut oder kontaktieren
                        Sie uns direkt per WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-slate-800 font-medium">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Ihr vollständiger Name"
                        className={`mt-2 shadow-lg border-2 border-gray-200 focus:border-[#87CEEB] bg-white text-slate-800 placeholder:text-gray-500 rounded-lg ${formErrors.name ? "border-red-500" : ""}`}
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-800 font-medium">
                        Telefon *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Ihre Telefonnummer"
                        className={`mt-2 shadow-lg border-2 border-gray-200 focus:border-[#87CEEB] bg-white text-slate-800 placeholder:text-gray-500 rounded-lg ${formErrors.phone ? "border-red-500" : ""}`}
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-800 font-medium">
                      E-Mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ihre.email@beispiel.de"
                      className={`mt-2 shadow-lg border-2 border-gray-200 focus:border-[#87CEEB] bg-white text-slate-800 placeholder:text-gray-500 rounded-lg ${formErrors.email ? "border-red-500" : ""}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-slate-800 font-medium">
                      Nachricht *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Beschreiben Sie Ihr Anliegen oder das Problem mit Ihrem Gerät..."
                      className={`mt-2 min-h-[120px] shadow-lg border-2 border-gray-200 focus:border-[#87CEEB] bg-white text-slate-800 placeholder:text-gray-500 rounded-lg ${formErrors.message ? "border-red-500" : ""}`}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                    {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#87CEEB] to-[#6BB6D6] hover:from-[#6BB6D6] hover:to-[#5AA5C9] text-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800 mr-2"></div>
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Nachricht senden
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/logo.png"
                  alt="DailyPhone Logo"
                  className="h-9 w-9 rounded-full border-4 border-[#87CEEB] p-3"
                />
                <span className="text-xl font-bold text-[#87CEEB]">DailyPhone</span>
              </div>
              <p className="text-gray-400 mb-4">
                Ihr zuverlässiger Partner für Handy-Reparaturen in Berlin. Schnell, professionell und günstig.
              </p>
              <div className="flex space-x-4">
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                  onClick={() => window.open("https://wa.me/03023320906", "_blank")}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#87CEEB]">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>iPhone Reparaturen</li>
                <li>Samsung Reparaturen</li>
                <li>Express-Service</li>
                <li>Zubehör & Schutz</li>
                <li>Handy-Ankauf</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#87CEEB]">Kontakt</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>Pallastraße 25, 10781 Berlin</p>
                <p>Telefon: 03023535168</p>
                <p>Mo-Sa: 10:30-18:00</p>
                <p>So: Geschlossen</p>
                <p>dailyphonestore@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-400 space-x-4">
            <a href="/impressum" className="hover:underline">Impressum</a>
            <a href="/agb" className="hover:underline">AGB</a>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} DailyPhone Berlin. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
