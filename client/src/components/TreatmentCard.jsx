import { motion } from "framer-motion";
import { ArrowRight, Clock3, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { mediaUrl } from "../api/http";

export default function TreatmentCard({ treatment, index = 0 }) {
  const destination = `/treatments/${treatment.slug || treatment._id}`;

  return (
    <motion.article
      className="group overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-black/5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link to={destination} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-brand-cream">
          <img
            src={mediaUrl(treatment.image)}
            alt={treatment.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <span className="text-xs font-bold uppercase text-brand-gold">
            {treatment.category}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold text-brand-maroon">{treatment.name}</h3>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-brand-charcoal">
            {treatment.duration ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-cream px-3 py-1.5">
                <Clock3 size={14} /> {treatment.duration}
              </span>
            ) : null}
            {treatment.price ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-cream px-3 py-1.5">
                <Wallet size={14} /> {treatment.price}
              </span>
            ) : null}
          </div>
          <p className="mt-3 min-h-24 text-sm leading-7 text-slate-600">{treatment.shortDescription}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-red">
            Learn more
            <ArrowRight size={17} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
