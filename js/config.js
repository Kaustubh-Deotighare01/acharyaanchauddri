/* ═══════════════════════════════════════════════════════
   VASTU MAGICKS WORLD — SITE CONFIGURATION
   Edit this file to update all site-wide settings.
   No need to touch any HTML or other JS files.
═══════════════════════════════════════════════════════ */

const CONFIG = {

  /* ── BRANDING ── */
  siteName:    "Vastu Magicks World",
  founderName: "Acharya AN Chauddri",
  tagline:     "Align Your Space, Transform Your Life",
  subTagline:  "Ancient Vastu Shastra wisdom, expertly applied to modern living & working spaces — over 19 years of transforming homes, offices & lives.",

  /* ── CONTACT ── */
  phone1:      "9156713356",
  phone2:      "9311103311",
  address:     "102 Sadashiv Enclave, Sadashiv Nagar, Wathoda, Nagpur 440008, Maharashtra, India",
  paymentLink: "https://rzp.io/rzp/GUwdw44",

  /* ── SOCIAL MEDIA ── */
  facebook:    "https://www.facebook.com/anil.chouudhary.3",
  instagram:   "https://www.instagram.com/acharya_an_chauddri",
  youtube:     "https://youtube.com/@anchauddri",

  /* ── WHATSAPP GROUPS ── */
  whatsappEN:  "https://chat.whatsapp.com/LThlK2ksUdGKeg6zpuevX4",
  whatsappHI:  "https://chat.whatsapp.com/Byr7jigLXBJDmmdvGPcnP1",

  /* ── EMAIL FORM (EmailJS — free at emailjs.com)
     1. Sign up at https://emailjs.com
     2. Add your Gmail/Outlook under Email Services
     3. Create a Template — use these variables in it:
          {{user_name}}, {{user_phone}}, {{user_email}},
          {{user_city}}, {{service_type}}, {{call_time}}, {{message}}
     4. Paste your keys below
  ── */
  emailjsPublicKey:  "YOUR_PUBLIC_KEY",    // Account → API Keys
  emailjsServiceId:  "YOUR_SERVICE_ID",    // Email Services → Service ID
  emailjsTemplateId: "YOUR_TEMPLATE_ID",   // Email Templates → Template ID
  recipientEmail:    "your@email.com",     // Where enquiries will arrive

  /* ── HOME PAGE STATS ── */
  stats: [
    { number: "19+",   label: "Years of Practice"    },
    { number: "5000+", label: "Happy Clients"         },
    { number: "11",    label: "Specialist Courses"    },
    { number: "100%",  label: "Authentic Methods"     }
  ],

  /* ── TESTIMONIALS (shown on home page) ── */
  testimonials: [
    { img: "images/testi-1.jpg", quote: "The site visit changed our fortunes completely.",         name: "Rahul & Neeta",  city: "Nagpur"    },
    { img: "images/testi-2.jpg", quote: "Business doubled in 6 months after Vastu remedies.",     name: "Rajesh Kumar",   city: "Nagpur"    },
    { img: "images/testi-3.jpg", quote: "Health and harmony restored in our home.",               name: "Priya Sharma",   city: "Pune"      },
    { img: "images/testi-4.jpg", quote: "The Advance Vastu course transformed my practice.",      name: "Amit Mishra",    city: "Mumbai"    },
    { img: "images/testi-1.jpg", quote: "Acharya ji's guidance is truly life-changing.",          name: "Sunita Rao",     city: "Hyderabad" },
    { img: "images/testi-2.jpg", quote: "Our factory's productivity improved significantly.",     name: "Vikas Gupta",    city: "Delhi"     }
  ]
};
