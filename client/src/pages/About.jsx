import { motion } from "framer-motion";
import { aboutAwardImage } from "../data/fallbacks";

const timeline = [
  {
    year: "Origins",
    title: "Traditional medicine from Ola leaf inscriptions",
    text: "Venerable Waga Gnanaloka Thero first treated hundreds of patients with traditional medicine passed down through generations."
  },
  {
    year: "Veda Madura",
    title: "Compassionate treatment for the community",
    text: "Hundreds gathered at Sethsuwa Ayurveda Hospital, then called Veda Madura, where an initial spoonful of Sethsuwa Pranajeewa was administered to every patient."
  },
  {
    year: "Research",
    title: "Ancient practice strengthened by medical study",
    text: "Dr. Sujeewa Vithanage, BAMS, worked extensively with the monk to research and develop the medicine."
  },
  {
    year: "Today",
    title: "Trusted in Sri Lanka and overseas",
    text: "The ancient recipe dates back over 200 years and is used by people in Sri Lanka, the United Kingdom, the USA, and other countries."
  }
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-charcoal py-24 text-white">
        <img src={aboutAwardImage} alt="Sethsuwa award ceremony" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-brand-charcoal/72" />
        <motion.div
          className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <span className="text-sm font-bold uppercase text-brand-gold">Our Heritage</span>
          <h1 className="mt-4 font-display text-5xl font-bold md:text-7xl">About Sethsuwa</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/82">
            Sethsuwa Pranajeewa medicine is the most sought after product at Sethsuwa Hospital, used both in Sri Lanka and the world over.
          </p>
        </motion.div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            className="overflow-hidden rounded-lg shadow-soft"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <img src={aboutAwardImage} alt="Sethsuwa leadership and award" className="h-full min-h-[420px] w-full object-cover" />
          </motion.div>
          <motion.div
            className="text-base leading-8 text-slate-700"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl font-bold text-brand-maroon">A medicine shaped by service</h2>
            <p className="mt-6">
              It was the Buddhist monk Venerable Waga Gnanaloka Thero who first treated his hundreds of patients with his traditional medicine, obtained from his Ola leaf inscriptions passed down from generations.
            </p>
            <p className="mt-4">
              The monk at eighty years looked forty. More important was the fact that he led a very active life, waking up at 4.30 a.m. and devoting the early hours of the morning to paying reverence for the Lord Buddha.
            </p>
            <p className="mt-4">
              The hours that followed were spent in compassionate treatment by this doctor monk. News reached far and wide all over the country of the tremendous relief that followed.
            </p>
            <p className="mt-4">
              His only understudy was Dr. Sujeewa Vithanage, a young doctor with a medical degree from the University of Colombo (BAMS), who was engaged in extensive research into the ancient system of medicine. Together they made the miraculous Sethsuwa Pranajeewa medicine.
            </p>
            <p className="mt-4">
              Many users have shared positive experiences and success stories regarding its benefits.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-4xl font-bold text-brand-charcoal md:text-5xl">
            A 200-year lineage of care
          </h2>
          <div className="mt-14 space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                className="grid gap-5 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5 md:grid-cols-[150px_1fr]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
              >
                <span className="font-display text-2xl font-bold text-brand-red">{item.year}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-brand-maroon">{item.title}</h3>
                  <p className="mt-3 leading-8 text-slate-600">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
