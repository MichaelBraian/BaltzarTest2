"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Instagram, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InstagramPost {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  date: string
  handle: string
}

interface InstagramFeedProps {
  locale: string
  title?: string
  subtitle?: string
  instagramUsername?: string
}

export function InstagramFeed({
  locale,
  title = locale === "sv" ? "Följ oss på Instagram" : "Follow us on Instagram",
  subtitle = locale === "sv"
    ? "Se de senaste uppdateringarna från vår klinik och våra tandläkare"
    : "See the latest updates from our clinic and our dentists",
  instagramUsername = "baltzartandvard",
}: InstagramFeedProps) {
  // Mock Instagram posts data
  const [posts] = useState<InstagramPost[]>([
    {
      id: "1",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption:
        locale === "sv"
          ? "Vår nya 3D-scanner gör avtryck snabbare och bekvämare än någonsin!"
          : "Our new 3D scanner makes impressions faster and more comfortable than ever!",
      likes: 48,
      comments: 5,
      date: "2023-12-15",
      handle: "@baltzartandvard",
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption:
        locale === "sv"
          ? "Före och efter: Estetisk tandvård kan göra underverk för ditt leende!"
          : "Before and after: Aesthetic dentistry can do wonders for your smile!",
      likes: 72,
      comments: 8,
      date: "2023-12-10",
      handle: "@doc.aameri",
    },
    {
      id: "3",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption:
        locale === "sv"
          ? "Tips för att hålla dina tänder friska under vintern"
          : "Tips for keeping your teeth healthy during winter",
      likes: 36,
      comments: 3,
      date: "2023-12-05",
      handle: "@dr.filip.rebelo",
    },
    {
      id: "4",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption:
        locale === "sv"
          ? "Digital precision i praktiken - 3D-printade kirurgiska guider för implantatplacering"
          : "Digital precision in practice - 3D printed surgical guides for implant placement",
      likes: 54,
      comments: 7,
      date: "2023-11-28",
      handle: "@drbraian",
    },
    {
      id: "5",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption:
        locale === "sv"
          ? "Invisalign: Den osynliga vägen till ett rakare leende"
          : "Invisalign: The invisible way to a straighter smile",
      likes: 63,
      comments: 4,
      date: "2023-11-20",
      handle: "@baltzartandvard",
    },
    {
      id: "6",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption:
        locale === "sv"
          ? "Vår digitala arbetsprocess för tandtekniska arbeten #digitalworkflow #cadcam"
          : "Our digital workflow for dental technical work #digitalworkflow #cadcam",
      likes: 41,
      comments: 2,
      date: "2023-11-15",
      handle: "@swecadd",
    },
  ])

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">{title}</h2>
            <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
          </div>
          <Link
            href={`https://instagram.com/${instagramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 md:mt-0"
          >
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Instagram className="mr-2 h-5 w-5" />
              <span>{locale === "sv" ? "Följ oss" : "Follow us"}</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            >
              <div className="p-3 flex items-center border-b border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {post.handle.charAt(1).toUpperCase()}
                </div>
                <span className="ml-2 text-white font-medium text-sm">{post.handle}</span>
              </div>
              <div className="relative aspect-square">
                <Image src={post.imageUrl || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm line-clamp-3">{post.caption}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`h-5 w-5 mr-1 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                    </button>
                    <div className="flex items-center text-gray-300">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <Link
                    href={`https://instagram.com/${post.handle.substring(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(post.date).toLocaleDateString(locale === "sv" ? "sv-SE" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {["baltzartandvard", "drbraian", "doc.aameri", "dr.filip.rebelo", "swecadd"].map((handle) => (
            <Link
              key={handle}
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:border-orange-500 transition-colors"
            >
              <Instagram className="h-4 w-4 mr-2 text-orange-500" />
              <span className="text-white">@{handle}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
