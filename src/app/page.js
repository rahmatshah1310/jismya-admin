'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { slides, policy, products, category, cartItems } from '@/constants/data'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useCart } from '@/context/CartContext'
import { useGetBanners, useDeleteBannerMutation } from '@/app/api/bannerApi'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState(null)
  const { addToCart } = useCart()
   const { data, isLoading } = useGetBanners()
  const deleteBanner = useDeleteBannerMutation()

  if (isLoading) return <p>Loading banners...</p>


  const slideVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };


  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 })
  }

  return (
    <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      {/* Hero Section */}
      {/* <section className="relative mx-auto mt-20 flex items-center w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="relative flex justify-center items-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
            >
              <Image
                src={slide.image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover rounded-2xl"
                priority={index === 0}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-8">
                <AnimatePresence mode="wait">
                  {currentSlide === index && (
                    <motion.div
                      key={`slide-${index}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.h2
                        variants={slideVariants}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2"
                      >
                        {slide.heading}
                      </motion.h2>
                      <motion.p
                        variants={slideVariants}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-sm sm:text-base md:text-lg mb-4"
                      >
                        {slide.description}
                      </motion.p>
                      <motion.div variants={slideVariants} transition={{ duration: 0.8, delay: 0.6 }}>
                        <Link
                          href={slide.buttonLink}
                          className="inline-block bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-md text-white text-sm"
                        >
                          {slide.buttonText}
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section> */}
      <section className='w-full'>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Banners</h1>

          <table className="w-full table-auto border text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Image</th>
                <th className="p-2">Heading</th>
                <th className="p-2">Description</th>
                <th className="p-2">Device</th>
                <th className="p-2">Status</th>
                <th className="p-2">Order</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map(banner => (
                <tr key={banner._id} className="border-t">
                  <td className="p-2">
                    <Image src={banner.imageUrl} alt="banner" width={120} height={60} className="rounded-md object-cover"   priority/>
                  </td>
                  <td className="p-2">{banner.heading}</td>
                  <td className="p-2">{banner.description}</td>
                  <td className="p-2">{banner.deviceType}</td>
                  <td className="p-2">
                    <span className={`font-semibold ${banner.isActive ? "text-green-500" : "text-red-500"}`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-2">{banner.order}</td>
                  <td className="p-2 space-x-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button
                      onClick={() => deleteBanner.mutate(banner._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="categories" className="py-10 px-2 sm:px-4 md:px-8 bg-[var(--color-white)]">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-pink-600)]">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {category.map((category) => (
              <div key={category.text} className="group relative overflow-hidden rounded-lg bg-[var(--color-gray-50)]">
                <Image
                  src={category.image}
                  alt={category.text}
                  width={300}
                  height={400}
                  className="w-full h-56 sm:h-72 md:h-80 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--color-white)] text-base sm:text-xl font-semibold bg-black/50 px-4 sm:px-6 py-2 rounded">
                  {category.text}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Policy Section */}
      <section id="return-policy" className="py-10 sm:py-16 px-2 sm:px-4 md:px-8 bg-[var(--color-gray-50)]">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-pink-600)]">Our Return Policy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {policy.map((item) => (
              <div key={item.title} className="bg-[var(--color-white)] p-6 sm:p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform">
                <i className={`fas ${item.icon} text-3xl sm:text-4xl text-[var(--color-pink-500)] mb-4`}></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-[var(--color-pink-600)]">{item.title}</h3>
                <p className="text-[var(--color-gray-600)] text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-16 px-2 sm:px-4 md:px-8 bg-[var(--color-white)]">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-pink-600)]">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {cartItems.map((product, index) => (
              <div key={index} className="bg-[var(--color-white)] rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow flex flex-col">
                <Link href={`/cart/${product.id}`}>
                  <div className="relative h-48 sm:h-64 md:h-80 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[var(--color-gray-700)]">{product.name}</h3>
                    <p className="text-[var(--color-pink-500)] font-bold mb-2 sm:mb-4 ">$ {product.price}</p>
                    <button onClick={() => handleAddToCart(product)} className="w-full bg-[var(--color-pink-500)] text-[var(--color-white)] py-2 rounded-md hover:bg-[var(--color-pink-600)] transition-colors text-sm sm:text-base">
                      Add to Cart
                    </button>
                  </div></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-8 sm:py-14 px-2 sm:px-4 md:px-8 sm:mx-5 bg-gradient-to-r from-pink-500 to-pink-600 text-[var(--color-white)] w-full md:w-[90%] rounded-2xl md:mx-auto">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Special Offer</h2>
          <p className="text-base sm:text-xl mb-4 sm:mb-8">Get 20% off on your first purchase</p>
          <Link
            href="#shop-now"
            className="inline-block bg-[var(--color-white)] text-pink-500 px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-[var(--color-gray-100)] transition-colors font-semibold text-sm sm:text-base"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-10 sm:py-16 px-2 sm:px-4 md:px-8 bg-[var(--color-white)]">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-[var(--color-pink-600)]">Subscribe to Our Newsletter</h2>
          <p className="mb-4 sm:mb-8 text-[var(--color-gray-600)] text-sm sm:text-base">Get updates on new arrivals and exclusive offers</p>
          <form className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
            />
            <Button
              type="submit"
              className="bg-[var(--color-pink-500)] text-[var(--color-white)] px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-[var(--color-pink-600)] transition-colors text-sm sm:text-base"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* WhatsApp Button */}
      <Link
        href="https://wa.me/923488597922"
        className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 bg-[var(--color-green-500)] text-[var(--color-white)] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg hover:scale-110 transition-transform z-50"
        target="_blank"
      >
        <i className="fab fa-whatsapp"></i>
      </Link>
    </main>
  )
}
