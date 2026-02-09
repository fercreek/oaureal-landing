'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/ui/Preloader';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import AudioSection from '@/components/sections/AudioSection';
import BeforeAfter from '@/components/sections/BeforeAfter';
import HowItWorks from '@/components/sections/HowItWorks';
import Evidence from '@/components/sections/Evidence';
import Testimonials from '@/components/sections/Testimonials';
import QuizSection from '@/components/sections/QuizSection';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';
import StickyCTA from '@/components/sections/StickyCTA';
import ColorPicker from '@/components/ui/ColorPicker';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bg text-text font-body">
      <ColorPicker compact={true} position="fixed" />
      <Navbar />
      <Hero />
      <About />
      <AudioSection />
      <BeforeAfter />
      <HowItWorks />
      <Evidence />
      <QuizSection onResult={(result) => setQuizResult(result)} />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
      <StickyCTA show={!quizResult} />
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
