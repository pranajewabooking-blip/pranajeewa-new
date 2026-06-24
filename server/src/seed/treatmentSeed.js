import { connectDB } from "../config/db.js";
import { assertEnv } from "../config/env.js";
import { Treatment } from "../models/Treatment.js";
import { slugify } from "../utils/slug.js";

const treatments = [
  {
    name: "Full Package",
    category: "Wellness Treatment",
    duration: "180 Mins",
    price: "Rs. 6,500",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80"
    ],
    shortDescription: "A complete rejuvenation therapy with Ayurvedic massage, herbal steam, herbal scrub, and herbal bath.",
    description: "A complete rejuvenation therapy that includes a full body Ayurvedic massage, herbal steam, herbal scrub, and herbal bath. This luxurious treatment deeply cleanses and exfoliates the skin, removes dead cells, improves blood circulation, promotes detoxification, and restores energy and vitality. We use our own specially formulated herbal oils and natural herbal preparations, carefully selected according to each client's body constitution, skin condition, and health concerns for maximum therapeutic benefit.",
    keyFeatures: [
      "Full body Ayurvedic oil massage",
      "Herbal steam therapy",
      "Natural herbal body scrub",
      "Refreshing herbal bath",
      "Deep skin cleansing and exfoliation",
      "Improves blood circulation",
      "Supports detoxification",
      "Restores energy and vitality"
    ],
    includedTreatments: [
      {
        name: "Ayurvedic Massage",
        description: "Full body Ayurvedic oil massage using specially formulated herbal oils selected according to your body constitution to relax muscles, improve circulation, and nourish the skin."
      },
      {
        name: "Herbal Steam Therapy",
        description: "Therapeutic herbal steam that opens pores, promotes sweating, and helps remove deep-seated toxins from the body while easing muscle tension."
      },
      {
        name: "Herbal Body Scrub",
        description: "Natural herbal exfoliation that removes dead skin cells, deeply cleanses the skin, and leaves it smooth, soft, and rejuvenated."
      },
      {
        name: "Herbal Bath",
        description: "A refreshing herbal bath infused with natural Ayurvedic herbs that soothes the body, relaxes the mind, and completes the detoxification process."
      }
    ],
    keyBenefits: [
      "Complete body transformation",
      "Soft and rejuvenated skin",
      "Intense relaxation and detoxification",
      "Improved metabolic function"
    ],
    suitability: "Ideal for stress relief, fatigue, dull skin, poor circulation, toxin accumulation, body stiffness, and those seeking a complete wellness and rejuvenation experience.",
    process: "Ayurvedic Consultation -> Personalized Herbal Oil Selection -> Full Body Massage -> Herbal Steam Therapy -> Herbal Scrub Application -> Herbal Bath -> Post-Treatment Relaxation",
    videos: ["https://www.youtube.com/embed/ZjyzUibvXxE?si=v2x3NAsSV1t03OPD"]
  },
  {
    name: "Full Body Massage with Steam",
    category: "Wellness Treatment",
    duration: "75 Mins",
    price: "Rs. 6,500",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
    ],
    shortDescription: "A full body Ayurvedic massage paired with herbal steam for relaxation, circulation, and detoxification support.",
    description: "This treatment combines a full body Ayurvedic massage with herbal steam therapy. The steam opens the pores, promotes sweating, and helps remove toxins from the body while reducing stiffness, easing muscle tension, and improving circulation. It provides deep relaxation and supports the body's natural detoxification process.",
    keyFeatures: [
      "Full body Ayurvedic oil massage",
      "Herbal steam therapy",
      "Opens pores and promotes detoxification",
      "Relieves muscle stiffness and tension",
      "Improves blood circulation",
      "Enhances relaxation and wellbeing"
    ],
    keyBenefits: [
      "Effective removal of deep-seated toxins",
      "Reduces localized muscle pain",
      "Boosts lymphatic system",
      "Promotes clear and healthy pores"
    ],
    suitability: "Recommended for muscle stiffness, body aches, poor circulation, stress, fatigue, and individuals seeking detoxification and relaxation.",
    process: "Ayurvedic Consultation -> Personalized Herbal Oil Selection -> Full Body Massage -> Herbal Steam Therapy -> Post-Treatment Relaxation"
  },
  {
    name: "Full Body Massage (Abhyanga)",
    category: "Wellness Treatment",
    duration: "90 Mins",
    price: "Rs. 2,500",
    image: "https://drvijayskeralaayurveda.in/wp-content/uploads/2023/04/abhyangam.jpg",
    galleryImages: [
      "https://drvijayskeralaayurveda.in/wp-content/uploads/2023/04/abhyangam.jpg",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
    ],
    shortDescription: "A traditional full body oil massage to relax the body, nourish the skin, and support physical and mental balance.",
    description: "A traditional Ayurvedic full body oil massage designed to relax the body, improve blood circulation, relieve muscle tension, and nourish the skin. This therapy reduces stress, fatigue, and body aches while promoting overall physical and mental wellbeing. Specially prepared herbal oils are selected according to each client's body constitution (Prakriti), health condition, and specific therapeutic needs.",
    keyFeatures: [
      "Personalized herbal oil selection",
      "Deep muscle relaxation",
      "Improves blood circulation",
      "Reduces stress and anxiety",
      "Nourishes skin and body tissues",
      "Supports overall wellbeing"
    ],
    keyBenefits: [
      "Relaxes the entire body",
      "Relieves muscle tension and stiffness",
      "Improves blood circulation",
      "Nourishes and moisturizes the skin",
      "Helps reduce stress and anxiety",
      "Eases fatigue and tiredness",
      "Alleviates body aches and discomfort",
      "Promotes deep relaxation",
      "Supports overall wellbeing and rejuvenation",
      "Enhances physical and mental balance"
    ],
    suitability: "Ideal for stress and anxiety relief, muscle tension and stiffness, body aches, fatigue, poor circulation, long sitting or standing hours, post-exercise recovery, deep relaxation, overall wellbeing, and skin nourishment.",
    process: "Ayurvedic Consultation -> Prakriti Assessment -> Customized Herbal Oil Selection -> Full Body Abhyanga Massage -> Post-Treatment Relaxation",
    videos: ["https://www.youtube.com/embed/6kw1JBy1wdk?si=IKUQIXevMhkEyiZG"],
    videoUrl: "https://www.youtube.com/embed/6kw1JBy1wdk?si=IKUQIXevMhkEyiZG"
  },
  {
    name: "Shirodhara",
    category: "Wellness Treatment",
    duration: "60 Mins",
    price: "Rs. 8,000",
    image: "https://drpalikuttysayurveda.com/uploads/topics/17048886341916.JPG",
    galleryImages: [
      "https://drpalikuttysayurveda.com/uploads/topics/17048886341916.JPG",
      "https://www.kottakkalayurveda.ae/uploads/thumb/232-288-1651216967.jpg"
    ],
    shortDescription: "A classical Ayurvedic oil streaming therapy that calms the nervous system and supports deep mental relaxation.",
    description: "Shirodhara is a classical Ayurvedic treatment where a steady, rhythmic stream of warm herbal oil or medicated liquid is gently poured over the third eye area at the center of the forehead. This deeply relaxing therapy calms the nervous system, reduces stress and anxiety, improves sleep quality, relieves chronic headaches, and promotes mental clarity, emotional balance, and overall wellbeing.",
    keyFeatures: [
      "Deep relaxation and mental calmness",
      "Reduces stress and anxiety",
      "Improves sleep quality and helps with insomnia",
      "Relieves tension headaches and migraines",
      "Enhances focus and mental clarity",
      "Supports nervous system health",
      "Promotes emotional balance",
      "Stimulates vital Marma points"
    ],
    keyBenefits: [
      "Deep state of meditative relaxation",
      "Balances the autonomic nervous system",
      "Reduces hair fall due to stress",
      "Improves cognitive function"
    ],
    suitability: "Recommended for stress, anxiety, insomnia, mental fatigue, chronic headaches, migraines, emotional imbalance, and individuals seeking deep mental relaxation and rejuvenation.",
    process: "Ayurvedic Consultation -> Selection of Medicated Herbal Oil -> Gentle Forehead Oil Streaming (Shirodhara) -> Relaxation Therapy -> Post-Treatment Rest"
  },
  {
    name: "Nasya Karma (Nasal Therapy)",
    category: "Wellness Treatment",
    duration: "45 Mins",
    price: "Rs. 6,500",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80",
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
    ],
    shortDescription: "A Panchakarma nasal therapy that supports sinus, head, neck, respiratory, and nervous system wellbeing.",
    description: "Nasya Karma is one of the five principal detoxification therapies of Panchakarma. This specialized Ayurvedic treatment involves the administration of medicated oils, ghee, herbal juices, or powders through the nasal passages. Known as the gateway to the head, the nose provides a direct pathway to the brain and sensory organs. Nasya helps eliminate accumulated toxins, nourish the nervous system, balance Vata and Kapha doshas, and support the health of the head, neck, and respiratory system.",
    keyFeatures: [
      "Detoxifies the head and sinus passages",
      "Relieves sinus congestion and nasal blockage",
      "Supports healthy breathing and respiratory function",
      "Reduces headaches and migraines",
      "Enhances memory and concentration",
      "Nourishes the brain and nervous system",
      "Promotes emotional balance and relaxation",
      "Supports healthy hair growth and scalp health"
    ],
    keyBenefits: [
      "Clearer sinuses and improved breathing",
      "Sharper sensory perception",
      "Reduction in recurring headaches",
      "Better concentration and focus"
    ],
    suitability: "Recommended for chronic sinusitis, allergic rhinitis, migraines, recurrent headaches, nasal congestion, anxiety, stress-related disorders, sleep disturbances, hair fall, premature greying, and certain neurological conditions affecting the head and neck.",
    process: "Ayurvedic Consultation -> Facial and Head Preparation -> Gentle Herbal Steam -> Administration of Medicated Herbal Oil Through Nasal Passages -> Therapeutic Massage -> Post-Treatment Relaxation"
  },
  {
    name: "Jalaukavacharana (Leech Therapy)",
    category: "Sport Massage Therapy",
    duration: "45 Mins",
    price: "Rs. 8,500",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80"
    ],
    shortDescription: "A specialized Ayurvedic blood purification therapy for inflammation, pain, swelling, and tissue healing support.",
    description: "Jalaukavacharana is a specialized Ayurvedic bloodletting therapy (Raktamokshana) that utilizes medicinal leeches to remove impure or stagnant blood from affected areas. This traditional treatment is highly effective in reducing localized inflammation, pain, swelling, and congestion while helping to balance aggravated Pitta and Rakta doshas. The bioactive substances naturally released by medicinal leeches support improved circulation, detoxification, and tissue healing.",
    keyFeatures: [
      "Traditional Ayurvedic blood purification therapy",
      "Reduces inflammation and swelling",
      "Relieves localized pain and congestion",
      "Improves blood circulation and microcirculation",
      "Promotes wound and tissue healing",
      "Supports detoxification of affected areas",
      "Balances Pitta and Rakta doshas",
      "Uses hygienically maintained medicinal leeches"
    ],
    keyBenefits: [
      "Rapid reduction of localized inflammation",
      "Accelerated healing of chronic skin lesions",
      "Improvement in blood flow to damaged tissues",
      "Natural pain relief"
    ],
    suitability: "Recommended for psoriasis, eczema, acne, varicose veins, chronic skin disorders, localized circulatory disturbances, non-healing ulcers, abscesses, inflammatory conditions, and certain joint disorders.",
    process: "Ayurvedic Consultation -> Assessment of Condition -> Preparation of Treatment Area -> Application of Medicinal Leech -> Controlled Bloodletting Therapy -> Wound Care and Post-Treatment Monitoring"
  },
  {
    name: "Agni Karma (Therapeutic Heat Cauterization)",
    category: "Wellness Treatment",
    duration: "30 Mins",
    price: "Rs. 7,500",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80"
    ],
    shortDescription: "A classical Ayurvedic heat therapy for chronic pain, stiffness, corns, plantar fasciitis, and musculoskeletal concerns.",
    description: "Agni Karma is a classical Ayurvedic para-surgical procedure in which controlled therapeutic heat is applied to specific points of the body using a heated metallic instrument (Shalaka). This specialized treatment is highly effective for chronic pain, musculoskeletal disorders, corns, plantar fasciitis, and conditions associated with aggravated Vata and Kapha doshas. By delivering targeted heat to affected tissues, Agni Karma helps relieve pain, reduce stiffness, improve circulation, and stimulate the body's natural healing process.",
    keyFeatures: [
      "Provides rapid and long-lasting pain relief",
      "Reduces inflammation and swelling",
      "Improves local blood circulation",
      "Relieves stiffness and tenderness",
      "Promotes natural tissue healing",
      "Effective for corns and plantar fasciitis",
      "Helps prevent recurrence of chronic conditions",
      "Minimally invasive Ayurvedic para-surgical therapy"
    ],
    keyBenefits: [
      "Immediate relief from chronic joint pain",
      "Correction of musculoskeletal stiffness",
      "Effective treatment for corns",
      "Prevention of recurring pain"
    ],
    suitability: "Recommended for corns (Kadhara), plantar fasciitis, heel pain, calcaneal spur, osteoarthritis, sciatica, frozen shoulder, tennis elbow, cervical spondylosis, lumbar spondylosis, and chronic musculoskeletal pain conditions.",
    process: "Ayurvedic Consultation -> Assessment of Affected Area -> Cleansing and Marking -> Controlled Therapeutic Heat Application (Agni Karma) -> Herbal Dressing -> Post-Treatment Care and Follow-Up"
  },
  {
    name: "Facial Treatment",
    category: "Beauty Treatment",
    duration: "75 Mins",
    price: "Rs. 6,000",
    image: "https://ik.imagekit.io/ddaq6yarh/image(2).png",
    galleryImages: [
      "https://themedermatology.com/wp-content/uploads/2024/08/dfb.png",
      "https://ik.imagekit.io/ddaq6yarh/image(2).png",
      "https://www.byrdie.com/thmb/w8OFLrEJZWEF-maFGrBkOUv-09M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/facialsocial-b0bf6073e908414a9630ae86ab345510.png"
    ],
    shortDescription: "A natural Ayurvedic skincare ritual with herbal cleansing, exfoliation, steam, massage, and nourishing masks.",
    description: "An Ayurvedic Facial Treatment is a natural and holistic skincare therapy based on the principles of Ayurveda. Designed to enhance both outer beauty and inner wellbeing, this treatment combines herbal cleansing, exfoliation, steam therapy, facial massage, and nourishing herbal masks to rejuvenate the skin naturally. Customized according to each individual's Dosha (Vata, Pitta, or Kapha), the treatment helps restore balance, improve skin health, promote relaxation, and reveal a radiant natural glow.",
    keyFeatures: [
      "Personalized according to Dosha type",
      "Deep herbal cleansing and detoxification",
      "Gentle natural exfoliation",
      "Herbal steam therapy for pore purification",
      "Relaxing Ayurvedic facial massage",
      "Customized herbal face mask",
      "Natural toning and moisturizing",
      "Promotes healthy, radiant skin"
    ],
    keyBenefits: [
      "Natural, chemical-free glow",
      "Balanced skin oil production",
      "Reduced signs of skin aging",
      "Deeply hydrated and supple skin"
    ],
    suitability: "Suitable for dry skin, oily skin, sensitive skin, dull complexion, uneven skin texture, stress-related skin concerns, and individuals seeking natural skin rejuvenation and relaxation.",
    process: "Skin Assessment and Dosha Analysis -> Herbal Cleansing -> Natural Exfoliation -> Herbal Steam Therapy -> Ayurvedic Facial Massage -> Customized Herbal Face Mask -> Toning and Moisturizing -> Relaxation"
  },
  {
    name: "Pedicure Treatment",
    category: "Beauty Treatment",
    duration: "75 Mins",
    price: "Rs. 5,500",
    image: "https://ik.imagekit.io/ddaq6yarh/image.png",
    galleryImages: [
      "https://ik.imagekit.io/ddaq6yarh/image.png",
      "https://www.bodycraft.co.in/hubfs/Imported_Blog_Media/spa-treatment-product-female-feet-hand-spa-1-1.jpg",
      "https://beyondbeautybognor.co.uk/wp-content/uploads/2025/08/What-Is-a-Pedicure-%E2%80%93-Professional-Nail-and-Foot-Care-Treatment-1080x675.jpg"
    ],
    shortDescription: "A therapeutic Ayurvedic foot care ritual that cleanses, softens, nourishes, and revitalizes the feet.",
    description: "An Ayurvedic Pedicure Treatment is a therapeutic foot care ritual inspired by the ancient healing principles of Ayurveda. More than a cosmetic treatment, it is a holistic wellness therapy that cleanses, softens, nourishes, and revitalizes the feet while promoting relaxation and restoring inner balance. Using herbal soaks, natural exfoliation, medicinal oils, and therapeutic massage techniques, this treatment improves circulation, relieves foot fatigue, and supports overall wellbeing.",
    keyFeatures: [
      "Relaxing herbal foot soak",
      "Natural exfoliation for rough skin and heels",
      "Professional nail and cuticle care",
      "Ayurvedic foot massage with herbal oils",
      "Hydrating herbal mask or foot pack",
      "Improves circulation and foot comfort",
      "Relieves fatigue and tension",
      "Deeply nourishes and softens the skin"
    ],
    keyBenefits: [
      "Soft, smooth heels and feet",
      "Reduced swelling and foot fatigue",
      "Improved blood circulation in lower limbs",
      "Complete stress relief through feet"
    ],
    suitability: "Suitable for dry or cracked heels, tired feet, poor circulation, foot fatigue, rough skin, stress-related tension, and individuals seeking relaxation and natural foot care.",
    process: "Foot Assessment -> Herbal Foot Soak -> Natural Exfoliation -> Nail and Cuticle Care -> Ayurvedic Foot Massage -> Herbal Foot Mask -> Moisturizing and Finishing Treatment"
  },
  {
    name: "Fat Burning Therapy",
    category: "Beauty Treatment",
    duration: "45 Mins",
    price: "Rs. 7,000",
    image: "https://d2i00yqiugujny.cloudfront.net/solution_small_thumbnail/jpeg-optimizer_closeup-man-getting-back-massage-with-detox-herbal-balls.jpg",
    galleryImages: [
      "https://www.ayurmana-uae.com/wp-content/uploads/2024/04/5549.jpg",
      "https://d2i00yqiugujny.cloudfront.net/solution_small_thumbnail/jpeg-optimizer_closeup-man-getting-back-massage-with-detox-herbal-balls.jpg",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80"
    ],
    shortDescription: "A herbal abdominal fat reduction therapy designed to support natural body contouring and metabolic balance.",
    description: "Rooted in the timeless wisdom of Ayurveda, our Abdominal Fat Reduction Therapy is thoughtfully designed to support natural body contouring and metabolic balance. This specialized treatment utilizes a unique blend of potent herbal powders enriched with Lekhana Guna, the Ayurvedic scraping property known for its ability to break down and eliminate accumulated fat and toxins from the body. Through carefully selected herbs and therapeutic application techniques, the treatment targets excess subcutaneous abdominal fat while stimulating circulation and enhancing the body's natural detoxification process. In Ayurveda, Lekhana Guna is renowned for its capacity to reduce Meda Dhatu (adipose tissue), balance aggravated Kapha Dosha, and cleanse blocked bodily channels.",
    keyFeatures: [
      "Uses potent herbal powders with Lekhana Guna",
      "Targets excess subcutaneous abdominal fat",
      "Balances aggravated Kapha Dosha",
      "Cleanses blocked bodily channels",
      "Stimulates healthy metabolic rate",
      "Promotes natural body contouring"
    ],
    keyBenefits: [
      "Supports reduction of abdominal fat deposits",
      "Helps improve body contour and firmness",
      "Assists in removing accumulated toxins (Ama)",
      "Encourages healthy metabolism and circulation",
      "Promotes lightness and vitality"
    ],
    suitability: "Recommended for individuals seeking natural weight management, abdominal fat reduction, metabolic balancing, and detoxification.",
    process: "Ayurvedic Consultation -> Dosha and Meda Dhatu Assessment -> Application of Herbal Lekhana Powders -> Therapeutic Scraping Massage -> Post-Treatment Relaxation"
  },
  {
    name: "Online Free Consultation",
    category: "Clinic",
    duration: "30 Mins",
    price: "Free",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80"
    ],
    shortDescription: "A free online Ayurveda consultation for personalized guidance from the comfort of your home.",
    description: "Get professional Ayurvedic guidance from the comfort of your home. Our online consultation service allows you to discuss your health concerns with experienced practitioners and receive personalized treatment recommendations free of charge.",
    keyFeatures: [
      "Free initial consultation with no charges for your first session",
      "Expert Ayurvedic advice from experienced practitioners",
      "Personalized guidance tailored to your health concerns",
      "Convenient online access from anywhere, anytime",
      "No travel required, saving time and energy"
    ],
    keyBenefits: [
      "Free initial consultation",
      "Expert Ayurvedic advice",
      "Personalized guidance",
      "Convenient online access",
      "No travel required"
    ],
    suitability: "Ideal for individuals seeking professional Ayurvedic guidance from the comfort of their home, those with busy schedules, remote clients worldwide, first-time Ayurveda users, and anyone looking for expert health advice without the need to travel.",
    process: "Online Registration -> Schedule Your Appointment -> Video or Phone Consultation with Ayurvedic Practitioner -> Personalized Treatment Recommendations -> Follow-up Support and Guidance",
    buttonLabel: "Appointment for Doctor"
  },
  {
    name: "Ayurvedic Consultation",
    category: "Clinic",
    duration: "60 Mins",
    price: "Rs. 7,000",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
    ],
    shortDescription: "A comprehensive Ayurveda consultation with constitution assessment, pulse diagnosis, and a personalized care plan.",
    description: "A comprehensive Ayurvedic consultation with our experienced practitioners. During this session, we assess your unique body constitution (Prakriti), identify any dosha imbalances (Vikriti), and create a personalized treatment plan tailored to your specific health concerns and wellness goals. This in-depth consultation includes pulse diagnosis (Nadi Pariksha), lifestyle recommendations, dietary guidance, and herbal treatment suggestions.",
    keyFeatures: [
      "Detailed health history assessment",
      "Pulse diagnosis (Nadi Pariksha)",
      "Body constitution (Prakriti) analysis",
      "Dosha imbalance (Vikriti) assessment",
      "Personalized treatment plan",
      "Dietary and lifestyle recommendations",
      "Herbal medicine prescription",
      "Follow-up care guidance"
    ],
    keyBenefits: [
      "Personalized treatment approach",
      "Understanding of your unique body type",
      "Targeted health solutions",
      "Natural and holistic healing guidance"
    ],
    suitability: "Recommended for new patients seeking Ayurvedic treatment, individuals with chronic health conditions, those wanting to understand their body constitution, and anyone looking for a holistic approach to health and wellness.",
    process: "Registration and Health History -> Pulse Diagnosis (Nadi Pariksha) -> Prakriti and Vikriti Assessment -> Personalized Consultation -> Treatment Plan and Recommendations"
  }
];

const seedTreatments = async () => {
  assertEnv();
  await connectDB();

  for (const treatment of treatments) {
    const slug = slugify(treatment.name);
    await Treatment.findOneAndUpdate(
      { slug },
      {
        ...treatment,
        slug,
        isFeatured: true
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );
  }

  console.log(`Seeded ${treatments.length} treatments`);
  process.exit(0);
};

seedTreatments().catch((error) => {
  console.error(error);
  process.exit(1);
});
