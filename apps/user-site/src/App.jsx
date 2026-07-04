import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/layout/WhatsAppButton";
import Home from "./pages/Home";

const Treks = lazy(() => import("./pages/Treks"));
const TrekDetail = lazy(() => import("./pages/TrekDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const OurWork = lazy(() => import("./pages/OurWork"));
const Contact = lazy(() => import("./pages/Contact"));
const Reviews = lazy(() => import("./pages/Reviews"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background font-body text-text">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/treks" element={<Treks />} />
              <Route path="/treks/:id" element={<TrekDetail />} />
              <Route path="/book/:id" element={<Booking />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
