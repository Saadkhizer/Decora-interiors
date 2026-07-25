import Hero from '../components/home/Hero.jsx';
import CategoryStrip from '../components/home/CategoryStrip.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import WhyUs from '../components/home/WhyUs.jsx';
import ProcessSteps from '../components/home/ProcessSteps.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import CTASection from '../components/home/CTASection.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <CategoryStrip />
      <FeaturedProducts />
      <ProcessSteps />
      <Testimonials />
      <CTASection />
    </>
  );
}
