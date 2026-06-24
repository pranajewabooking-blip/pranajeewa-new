import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, text, align = "center" }) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <motion.div
      className={`mx-auto mb-10 flex max-w-3xl flex-col ${alignment}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      {eyebrow ? (
        <span className="mb-3 text-xs font-bold uppercase text-brand-red">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-8 text-slate-600">{text}</p> : null}
    </motion.div>
  );
}
