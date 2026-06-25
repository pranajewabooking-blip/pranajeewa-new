import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Leaf, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http, mediaUrl } from "../api/http";
import SectionHeader from "../components/SectionHeader";
import TreatmentCard from "../components/TreatmentCard";
import { aboutAwardImage, fallbackBanners, fallbackTreatments, sliderImageUrl } from "../data/fallbacks";

function NewsCarousel({ banners }) {
  const [active, setActive] = useState(0);
  const visibleBanners = banners.length > 0 ? banners : fallbackBanners;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % visibleBanners.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [visibleBanners.length]);

  const banner = visibleBanners[active];

  return (
    <section className="bg-brand-mist py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="News"
          title="Latest From Sethsuwa"
          text="Awards, announcements, and meaningful moments from our Ayurveda community."
        />
        <div className="relative overflow-hidden rounded-lg bg-brand-leaf shadow-soft">
          <div className="aspect-[16/9] bg-brand-leaf sm:aspect-[16/7]">
            <AnimatePresence mode="wait">
              <motion.img
                key={banner._id || banner.image}
                src={mediaUrl(banner.image)}
                alt={banner.altText || banner.title || "Sethsuwa news"}
                className="h-full w-full object-contain"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-charcoal/85 to-transparent p-6 text-white md:p-8">
            <p className="max-w-3xl font-display text-2xl font-bold md:text-4xl">
              {banner.title || "Traditional Ayurveda care, thoughtfully managed"}
            </p>
          </div>
          <div className="absolute right-5 top-5 flex gap-2">
            {visibleBanners.map((item, index) => (
              <button
                key={item._id || item.image}
                type="button"
                className={`h-2.5 w-8 rounded-full transition ${index === active ? "bg-brand-gold" : "bg-white/60"}`}
                onClick={() => setActive(index)}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [banners, setBanners] = useState(fallbackBanners);
  const [treatments, setTreatments] = useState(fallbackTreatments);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [bannerResponse, treatmentResponse] = await Promise.all([
          http.get("/news-banners"),
          http.get("/treatments", { params: { featured: true } })
        ]);

        if (bannerResponse.data.banners?.length) {
          setBanners(bannerResponse.data.banners);
        }

        if (treatmentResponse.data.treatments?.length) {
          setTreatments(treatmentResponse.data.treatments);
        }
      } catch {
        setBanners(fallbackBanners);
        setTreatments(fallbackTreatments);
      }
    };

    loadHome();
  }, []);

  const previewTreatments = useMemo(() => treatments.slice(0, 4), [treatments]);

  return (
    <>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        <img
          src={sliderImageUrl}
          alt="Traditional Ayurveda ingredients"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl text-white"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
          >
            <span className="inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-bold text-brand-gold ring-1 ring-white/24 backdrop-blur">
              Traditional Sri Lankan Ayurveda
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight md:text-7xl">
              Sethsuwa Ayurveda Treatment Booking
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86">
              Experience trusted herbal care, doctor-led guidance, and premium treatment hospitality from Sethsuwa.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/treatments"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-3 font-bold text-brand-charcoal shadow-soft transition hover:bg-white"
              >
                Explore Treatments <ArrowRight size={18} />
              </Link>
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/55 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-brand-maroon"
              >
                View My Bookings <CalendarDays size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-brand-leaf py-6 text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Heritage Practice", Leaf],
            ["Secure Bookings", ShieldCheck],
            ["Award Recognition", CalendarDays]
          ].map(([label, Icon]) => (
            <div key={label} className="flex items-center gap-3 rounded-md bg-white/8 px-4 py-4">
              <Icon className="text-brand-gold" size={22} />
              <span className="font-bold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <NewsCarousel banners={banners} />

      <section className="bg-brand-sage py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            className="overflow-hidden rounded-lg shadow-soft"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75 }}
          >
            <img src={aboutAwardImage} alt="Sethsuwa award recognition" className="aspect-[4/3] w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75 }}
          >
            <span className="text-sm font-bold uppercase text-brand-leaf">About Us</span>
            <h2 className="mt-3 font-display text-4xl font-bold text-brand-charcoal md:text-5xl">
              Award-winning Ayurveda heritage
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-700">
              We, as the Setsuwa Ayurveda Hospital Company received the Best Inventor of the Year 2023 award at the award ceremony organized by the Sri Lanka Chamber of Commerce.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              It is the faith each and every one of our clients has in us. We are sincerely appreciated it. Thank you very much you all.
            </p>
            <p className="mt-5 font-display text-xl font-bold text-brand-leaf">
              Doctor Sujeeva Prasanna Withanage
            </p>
            <p className="text-sm text-slate-600">Managing Director, Setsuwa Ayurveda Hospital</p>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-brand-leaf px-5 py-3 font-bold text-white transition hover:bg-brand-red"
            >
              Read More <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Treatments"
            title="Our Treatments"
            text="Choose from clinic care, wellness, sports recovery, and herbal beauty experiences."
          />
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {previewTreatments.map((treatment, index) => (
              <TreatmentCard key={treatment._id || treatment.slug} treatment={treatment} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
