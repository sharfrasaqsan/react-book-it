import AboutUs from "../components/AboutUs";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Partners from "../components/Partners";
import RecentEventList from "../components/RecentEventList";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Newsletter from "../components/NewsLetter";

const Dashboard = () => {
  return (
    <>
      <Hero />
      <RecentEventList />
      <AboutUs />
      <HowItWorks />
      <Testimonials />
      <Partners />
      <CTA />
      <Newsletter />
    </>
  );
};

export default Dashboard;
