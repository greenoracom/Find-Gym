import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const gymsData = [
  {
    id: 1,
    name: "HIIT & Cardio Blast",
    rating: 4.9,
    reviews: 1420,
    price: "₹499/class",
    location: "Interactive Zoom Class",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    tags: ["Live Coached", "Weight Loss", "No Gym Needed"]
  },
  {
    id: 2,
    name: "Vinyasa Yoga Flow",
    rating: 4.9,
    reviews: 980,
    price: "₹399/class",
    location: "Live Stream (Zoom)",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    tags: ["Mindfulness", "Flexibility", "Stretching"]
  },
  {
    id: 3,
    name: "Power Strength & Tone",
    rating: 4.8,
    reviews: 750,
    price: "₹599/class",
    location: "Interactive Zoom Class",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    tags: ["Dumbbells", "Strength Training", "Bodyweight"]
  },
  {
    id: 4,
    name: "Zumba Dance Fitness",
    rating: 4.7,
    reviews: 530,
    price: "₹299/class",
    location: "Live Stream (Zoom)",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    tags: ["Dance", "Cardio Fun", "All Levels"]
  },
  {
    id: 5,
    name: "Kickboxing & MMA Basics",
    rating: 4.9,
    reviews: 1120,
    price: "₹699/class",
    location: "Interactive Zoom Class",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop",
    tags: ["Self Defense", "Core Strength", "HIIT"]
  }
];

const FeaturedGyms = () => {
  return (
    <div className="py-24 bg-[#000000] relative overflow-hidden font-sans border-b border-gray-800">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF7A00]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161B26] border border-[#FF7A00]/20 text-gray-300 text-xs font-bold tracking-[0.15em] mb-6 shadow-[0_0_15px_rgba(255,122,0,0.1)]"
          >
            🔥 FEATURED EXPERIENCES
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Explore <span className="text-[#FF7A00] drop-shadow-[0_0_15px_rgba(255,122,0,0.3)]">Online Fitness Classes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg font-light max-w-xl"
          >
            Premium fitness centers, world-class equipment, and top-tier training facilities tailored to your goals.
          </motion.p>
        </div>

        {/* Swiper Slider */}
        <div className="gym-swiper-container">
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40
              }
            }}
            className="pb-16"
          >
            {gymsData.map((gym) => (
              <SwiperSlide key={gym.id} className="max-w-[380px] w-full">
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-[#000000] border border-gray-800 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:border-[#FF7A00]/40 transition-colors duration-300 group flex flex-col h-[485px]"
                >
                  {/* Image Container with overlay */}
                  <div className="relative h-[220px] overflow-hidden">
                    <img 
                      src={gym.image} 
                      alt={gym.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent"></div>
                    
                    {/* Location Badge */}
                    <span className="absolute top-4 left-4 bg-[#161B26]/80 backdrop-blur-md text-xs font-semibold text-white px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                      💻 Online
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                        {gym.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500 font-semibold text-sm bg-yellow-500/10 px-2 py-0.5 rounded-md">
                        ★ {gym.rating}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      {gym.location} • ({gym.reviews} reviews)
                    </p>

                    {/* Facility Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {gym.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-semibold text-gray-400 bg-[#161B26] border border-gray-800 px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action Footer */}
                    <div className="mt-auto pt-4 border-t border-gray-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider">Starting from</p>
                        <p className="text-white font-bold text-lg">{gym.price}<span className="text-xs font-normal text-gray-500">/mo</span></p>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-[0_4px_15px_rgba(255,122,0,0.3)] hover:shadow-[0_4px_25px_rgba(255,122,0,0.5)]"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>

      {/* Injecting Swiper style tweaks */}
      <style>{`
        .gym-swiper-container .swiper-pagination-bullet {
          background: #4B5563 !important;
          opacity: 0.6;
        }
        .gym-swiper-container .swiper-pagination-bullet-active {
          background: #FF7A00 !important;
          opacity: 1;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
};

export default FeaturedGyms;
