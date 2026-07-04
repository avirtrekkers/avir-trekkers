import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUp, Heart } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon, WhatsappIcon } from "../BrandIcons";

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
                  <WhatsappIcon className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-5 text-white/80">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { Icon: InstagramIcon, href: "https://instagram.com/avir_trekkers", label: "Instagram", hover: "hover:bg-pink-500/20 hover:text-pink-400" },
                { Icon: FacebookIcon, href: "https://facebook.com/avirtrekkers", label: "Facebook", hover: "hover:bg-blue-500/20 hover:text-blue-400" },
                { Icon: YoutubeIcon, href: "https://youtube.com/@avirtrekkers", label: "YouTube", hover: "hover:bg-red-500/20 hover:text-red-400" },
              ].map((item) => { const { Icon, href, label, hover } = item; return (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center hover:scale-110 transition-all duration-200 ${hover}`}
                  aria-label={label}>
                  <Icon className="h-5 w-5" />
                </a>
              ); })}
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
