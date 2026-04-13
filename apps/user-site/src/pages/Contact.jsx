import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
  CheckCircle,
  Camera,
  Globe,
  Video,
} from "lucide-react";

const CONTACT_INFO = {
  phone: "+91 97663 69007",
  whatsapp: "+91 97663 69007",
  email: "contact@avirtrekkers.com",
  address: "Mumbai, Maharashtra, India",
};

const SOCIAL_LINKS = [
  { icon: Camera, label: "Instagram", url: "https://instagram.com/avirtrekkers" },
  { icon: Globe, label: "Facebook", url: "https://facebook.com/avirtrekkers" },
  { icon: Video, label: "YouTube", url: "https://youtube.com/@avirtrekkers" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // Mock submission — no API endpoint for contact yet
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold font-heading mb-4"
          >
            Contact Us
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out and we'll
            respond as soon as we can.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
            >
              <h2 className="text-2xl font-heading font-bold text-text mb-6">
                Send us a Message
              </h2>

              {submitted && (
                <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-semibold">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="What is this about?"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    placeholder="Type your message here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-lg font-heading font-bold text-text mb-4">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-3 text-text-light hover:text-primary transition-colors group"
                >
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-primary">
                      Phone
                    </p>
                    <p className="text-sm">{CONTACT_INFO.phone}</p>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-text-light hover:text-green-600 transition-colors group"
                >
                  <MessageCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-green-600">
                      WhatsApp
                    </p>
                    <p className="text-sm">{CONTACT_INFO.whatsapp}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-start gap-3 text-text-light hover:text-primary transition-colors group"
                >
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-primary">
                      Email
                    </p>
                    <p className="text-sm">{CONTACT_INFO.email}</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-text-light">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text">Location</p>
                    <p className="text-sm">{CONTACT_INFO.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-lg font-heading font-bold text-text mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center text-primary transition-colors"
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-muted rounded-2xl p-6"
            >
              <h3 className="text-lg font-heading font-bold text-text mb-2">
                Quick Response
              </h3>
              <p className="text-sm text-text-light">
                For trek-related queries and quick responses, reach out to us on
                WhatsApp. We typically respond within a few hours.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
