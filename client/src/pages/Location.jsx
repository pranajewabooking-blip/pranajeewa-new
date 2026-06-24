import { motion } from "framer-motion";
import { Accessibility, Car, Clock3, MapPin, Phone, Route } from "lucide-react";

const mapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.316239741433!2d79.958075!3d6.971967699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae257ce81120163%3A0x86586a76f93c2165!2sSethsuwa%20Ayurweda%20Hospital!5e0!3m2!1sen!2slk!4v1782335603507!5m2!1sen!2slk";

const facilities = [
  "Free Spacious Parking Available",
  "Wheelchair Accessible Entrance",
  "Comfortable Waiting Area"
];

export default function Location() {
  return (
    <>
      <section className="bg-brand-leaf px-4 py-20 text-white sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="text-sm font-bold uppercase text-brand-gold">Visit Us</span>
          <h1 className="mt-4 font-display text-5xl font-bold md:text-7xl">Sethsuwa Location</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/76">
            Find Sethsuwa Ayurweda Hospital in Makola South with clear directions, opening hours, and visitor facilities.
          </p>
        </motion.div>
      </section>

      <section className="bg-brand-sage py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <motion.div
            className="overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-black/5"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <iframe
              src={mapSrc}
              title="Sethsuwa Ayurweda Hospital Google Map"
              className="h-[450px] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <article className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-mist text-brand-leaf">
                  <MapPin size={22} />
                </span>
                <h2 className="font-display text-2xl font-bold text-brand-leaf">Our Address</h2>
              </div>
              <p className="mt-5 font-bold text-brand-charcoal">Sethsuwa Ayurweda Hospital</p>
              <p className="mt-2 text-slate-700">Makola South</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Landmark: No.258/19, Vihara Mawatha, Batalanda Road, Makola South, Makola, Kiribathgoda.
              </p>
            </article>

            <article className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-lotus text-brand-red">
                  <Clock3 size={22} />
                </span>
                <h2 className="font-display text-2xl font-bold text-brand-indigo">Opening Hours</h2>
              </div>
              <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700">
                <div className="flex justify-between rounded-md bg-brand-sage px-4 py-3">
                  <span>Everyday</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between rounded-md bg-brand-lotus px-4 py-3">
                  <span>Poya Days</span>
                  <span>Closed</span>
                </div>
                <div className="flex justify-between rounded-md bg-brand-mist px-4 py-3">
                  <span>Holidays</span>
                  <span>Closed</span>
                </div>
              </div>
            </article>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.article
            className="rounded-lg bg-brand-indigo p-6 text-white shadow-soft"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-brand-gold">
                <Car size={22} />
              </span>
              <h2 className="font-display text-2xl font-bold text-brand-gold">Hospital Facilities</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {facilities.map((facility) => (
                <div key={facility} className="flex items-center gap-3 rounded-md bg-white/8 px-4 py-3">
                  {facility.includes("Wheelchair") ? <Accessibility size={18} /> : <Route size={18} />}
                  <span className="font-semibold">{facility}</span>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="rounded-lg bg-brand-red p-6 text-white shadow-soft"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-brand-gold">
                <Phone size={22} />
              </span>
              <h2 className="font-display text-2xl font-bold text-brand-gold">Need Directions?</h2>
            </div>
            <p className="mt-5 leading-8 text-white/78">
              If you're having trouble finding us, call our reception desk directly:
            </p>
            <a
              href="tel:+94781020385"
              className="mt-5 inline-flex rounded-md bg-brand-gold px-5 py-3 font-bold text-brand-charcoal transition hover:bg-white"
            >
              +94 78 102 0385
            </a>
          </motion.article>
        </div>
      </section>
    </>
  );
}
