import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import Categories from '../../components/Categories/Categories'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'
import ArtisanStory from '../../components/ArtisanStory/ArtisanStory'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import Footer from '../../components/Footer/Footer'

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ArtisanStory />
      <WhyChooseUs />
      <Footer />
    </div>
  )
}