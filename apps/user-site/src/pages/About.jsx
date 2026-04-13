import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mountain,
  Heart,
  Target,
  Eye,
  Users,
  ArrowRight,
  MapPin,
  Shield,
} from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Founder",
    role: "Lead Trek Organizer",
    description:
      "Passionate trekker with years of experience exploring Maharashtra's forts and trails.",
  },
  {
    name: "Co-Founder",
    role: "Social Impact Lead",
    description:
      "Drives our charity initiatives including school support and cycle donation programs.",
  },
  {
    name: "Trek Guide",
    role: "Senior Trek Guide",
    description:
      "Certified mountaineer ensuring safe and memorable trekking experiences.",
  },
  {
    name: "Community Manager",
    role: "Community & Outreach",
    description:
      "Builds and nurtures our growing community of trekkers and volunteers.",
  },
];

const VALUES = [
  {
    icon: Mountain,
    title: "Adventure",
    description:
      "We curate treks that challenge, inspire, and bring you closer to nature's wonders.",
  },
  {
    icon: Heart,
    title: "Social Impact",
    description:
      "Every trek contributes to community welfare — from school supplies to cycle donations.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Experienced guides, proper gear, and thorough planning ensure every trekker's safety.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We build lasting friendships and a supportive community of like-minded adventurers.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1E3A5F] via-primary-dark to-primary text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-bold font-heading mb-6"
          >
            About Avir Trekkers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto"
          >
            We are a group of passionate trekkers from Maharashtra who believe
            that exploring nature should go hand in hand with giving back to
            communities. Founded with a simple mission — trek, explore, and
            make a difference.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text mb-4">
                Our Mission
              </h2>
              <p className="text-text-light leading-relaxed">
                To make trekking accessible to everyone while creating a
                positive impact on rural communities across Maharashtra. We
                organize safe, well-planned treks to historic forts and scenic
                trails, and channel our passion for adventure into meaningful
                social work — supporting schools, donating cycles to students,
                and uplifting underprivileged communities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text mb-4">
                Our Vision
              </h2>
              <p className="text-text-light leading-relaxed">
                To build Maharashtra's most impactful trekking community — one
                that not only explores the beauty of our state's forts and
                nature but also drives real change in the lives of those who
                need it most. We envision a future where every trek creates
                ripples of positive change, inspiring more people to adventure
                with purpose.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-2">
              What We Stand For
            </h2>
            <p className="text-text-light">
              The values that drive everything we do
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text mb-2">
                  {title}
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-2">
              Meet the Team
            </h2>
            <p className="text-text-light">
              The people behind Avir Trekkers
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="font-heading font-semibold text-text mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-text-light leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to Trek with Us?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join our community of adventurers and be part of something
            meaningful. Every trek is an opportunity to explore, connect, and
            give back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/treks"
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-light text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              <MapPin className="h-5 w-5" />
              Explore Treks
            </Link>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-colors border border-white/20"
            >
              <Heart className="h-5 w-5" />
              Our Social Work
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
