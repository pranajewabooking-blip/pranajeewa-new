import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import SectionHeader from "../components/SectionHeader";
import TreatmentCard from "../components/TreatmentCard";
import { fallbackTreatments } from "../data/fallbacks";

const categories = ["All", "Clinic", "Wellness Treatment", "Sport Massage Therapy", "Beauty Treatment"];

export default function Treatments() {
  const [treatments, setTreatments] = useState(fallbackTreatments);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadTreatments = async () => {
      try {
        const response = await http.get("/treatments");

        if (response.data.treatments?.length) {
          setTreatments(response.data.treatments);
        }
      } catch {
        setTreatments(fallbackTreatments);
      }
    };

    loadTreatments();
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return treatments;
    return treatments.filter((treatment) => treatment.category === activeCategory);
  }, [activeCategory, treatments]);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Treatments"
          title="Book Traditional Ayurveda Care"
          text="Choose a care path that feels aligned with your body, schedule, and wellness goals."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-bold ring-1 transition ${
                activeCategory === category
                  ? "bg-brand-red text-white ring-brand-red"
                  : "bg-white text-brand-charcoal ring-brand-gold/40 hover:bg-brand-cream"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {filtered.map((treatment, index) => (
            <TreatmentCard key={treatment._id || treatment.slug} treatment={treatment} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
