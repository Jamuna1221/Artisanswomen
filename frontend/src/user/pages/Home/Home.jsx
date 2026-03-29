import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import Categories from '../../components/Categories/Categories'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'
import ArtisanStory from '../../components/ArtisanStory/ArtisanStory'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import CategoryBar from '../../components/CategoryBar/CategoryBar'

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <CategoryBar />
      <Hero />
      <FeaturedProducts />
      <ArtisanStory />
      <WhyChooseUs />
    </div>
  )
}