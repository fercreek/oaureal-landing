'use client';

import { useState } from 'react';
import Preloader from '@/components/ui/Preloader';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import AudioSection from '@/components/sections/AudioSection';
import Evidence from '@/components/sections/Evidence';
import QuizSection from '@/components/sections/QuizSection';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
// import Investment from '@/components/sections/Investment';
import Footer from '@/components/sections/Footer';
import StickyCTA from '@/components/sections/StickyCTA';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#a5f0fa] selection:text-black font-sans">
      <Navbar />
      <Hero />
      <About />
      <AudioSection />
      <Evidence />
      <QuizSection onResult={(result) => setQuizResult(result)} />
      <Pricing />
      <FAQ />
      {/* <Investment /> */}
      <Footer />
      <StickyCTA show={!quizResult} />
    </div>
  );
}
