import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Camera, Globe, Video, ArrowUp, Heart } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gradient-to-br from-[#1E3A5F] via-primary-dark to-primary text-white text-white relative">
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Avir Trekkers" className="h-10 w-auto rounded" />
              <span className="text-lg font-bold font-heading">Avir Trekkers</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Trek with Purpose. Protect Forts. Educate Futures. Organizing treks across Maharashtra's forts and nature trails while making a difference.
            </p>
            <p className="text-accent text-sm font-semibold mt-3">जय शिवराय 🚩</p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-5 text-white/80">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                { name: "Upcoming Treks", path: "/treks" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "Our Work", path: "/our-work" },
                { name: "Reviews", path: "/reviews" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-primary-light hover:translate-x-1 transition-all duration-200 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-5 text-white/80">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary-light flex-shrink-0" />
                <a href="tel:+919766369007" className="hover:text-primary-light transition-colors">+91 97663 69007</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary-light flex-shrink-0" />
                <a href="mailto:contact@avirtrekkers.com" className="hover:text-primary-light transition-colors">contact@avirtrekkers.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary-light flex-shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="mt-3">
                <a href="https://wa.me/919766369007" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 hover:bg-green-500/25 px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-5 text-white/80">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: Camera, href: "https://instagram.com/avirtrekkers", label: "Instagram" },
                { icon: Globe, href: "https://facebook.com/avirtrekkers", label: "Facebook" },
                { icon: Video, href: "https://youtube.com/@avirtrekkers", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-primary/20 hover:text-primary-light hover:scale-110 transition-all duration-200"
                  aria-label={label}>
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="text-white/25 text-xs mt-5">Founded 2024</p>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-6 flex items-center justify-between text-sm text-white/30">
          <span className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} Avir Trekkers. Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> in India
          </span>
          <button onClick={scrollToTop}
            className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-all"
            aria-label="Scroll to top">
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
