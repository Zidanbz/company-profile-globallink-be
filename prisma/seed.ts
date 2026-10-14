/**
 * ==========================================================
 * DEVELOPMENT ONLY SEED SCRIPT
 * DO NOT USE OR RUN AGAINST PRODUCTION DATABASE
 * ==========================================================
 */

import { PrismaClient, MapLocationCategory, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Development Seed...");

  // 1. Seed Admin User
  const adminEmail = "admin@globallink.co.id";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("Admin@GlobalLink2025", salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`✔ Admin created: ${adminEmail} (password: Admin@GlobalLink2025)`);
  } else {
    console.log(`ℹ Admin already exists: ${adminEmail}`);
  }

  // 2. Seed Initial Map Locations (Indonesian Infrastructure)
  const initialLocations = [
    {
      name: "Globallink Head Office & NOC Jakarta",
      category: MapLocationCategory.OFFICE,
      latitude: -6.2088,
      longitude: 106.8456,
      description: "Pusat komando dan Network Operation Center 24/7.",
    },
    {
      name: "Tier-3 Cyber Data Center Jakarta",
      category: MapLocationCategory.DATA_CENTER,
      latitude: -6.2297,
      longitude: 106.8295,
      description: "Data center berstandar internasional dengan interkoneksi langsung ke IIX & OpenIXP.",
    },
    {
      name: "POP Surabaya Gubeng",
      category: MapLocationCategory.POP,
      latitude: -7.2654,
      longitude: 112.7521,
      description: "Point of Presence melayani Jawa Timur dan Indonesia Timur.",
    },
    {
      name: "POP Bandung Dago",
      category: MapLocationCategory.POP,
      latitude: -6.9039,
      longitude: 107.6186,
      description: "Konektivitas serat optik berkecepatan tinggi area Jawa Barat.",
    },
    {
      name: "Submarine Cable Landing Batam",
      category: MapLocationCategory.FIBER_OPTIC,
      latitude: 1.1301,
      longitude: 104.0529,
      description: "Gerbang kabel laut internasional menghubungkan Indonesia dengan Singapura & Global.",
    },
    {
      name: "POP Denpasar Bali",
      category: MapLocationCategory.POP,
      latitude: -8.6705,
      longitude: 115.2126,
      description: "Layanan konektivitas hospitality dan bisnis regional Bali & Nusa Tenggara.",
    },
    {
      name: "POP Makassar Ujung Pandang",
      category: MapLocationCategory.POP,
      latitude: -5.1477,
      longitude: 119.4327,
      description: "Hub distribusi bandwidth backbone untuk Sulawesi dan Maluku.",
    },
    {
      name: "POP Medan Petisah",
      category: MapLocationCategory.POP,
      latitude: 3.5952,
      longitude: 98.6722,
      description: "Sentra jaringan serat optik Sumatera bagian utara.",
    },
  ];

  for (const loc of initialLocations) {
    const existing = await prisma.mapLocation.findFirst({
      where: { name: loc.name },
    });
    if (!existing) {
      await prisma.mapLocation.create({ data: loc });
    }
  }
  console.log(`✔ Seeded ${initialLocations.length} map locations.`);

  // 3. Seed Initial Blog Posts
  const initialPosts = [
    {
      title: "Transformasi Digital: Mengapa Infrastruktur Jaringan yang Andal adalah Fondasi Utama",
      slug: "transformasi-digital-infrastruktur-jaringan-andal",
      excerpt: "Di era digital yang serba cepat, konektivitas stabil dan berkecepatan tinggi bukan lagi sekadar fasilitas melainkan pilar kelangsungan bisnis.",
      content: "<p>Dalam lanskap bisnis modern saat ini, kecepatan akses informasi dan keandalan sistem komunikasi menjadi pembeda utama antara bisnis yang bertahan dan yang memimpin pasar. Globallink hadir menjawab tantangan tersebut dengan infrastruktur terintegrasi yang menjangkau seluruh nusantara.</p><p>Konektivitas serat optik dan jaringan satelit kami dirancang dengan standar redundansi tinggi untuk menjamin ketersediaan layanan 99.9% tanpa henti.</p>",
      thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Mengenal Smart CCTV & AI Monitoring untuk Keamanan Korporat Modern",
      slug: "mengenal-smart-cctv-ai-monitoring-korporat",
      excerpt: "Integrasi teknologi kecerdasan buatan pada sistem CCTV memudahkan pengawasan otomatis, deteksi anomali, dan perlindungan aset berharga.",
      content: "<p>Keamanan fisik kini berevolusi dengan adanya teknologi Smart CCTV. Sistem tidak hanya merekam kejadian tetapi juga menganalisis pola pergerakan secara real-time untuk mencegah insiden keamanan sebelum terjadi.</p>",
      thumbnailUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      title: "Ekspansi Jaringan Backbone Fiber Optic Globallink Lintas Pulau",
      slug: "ekspansi-jaringan-backbone-fiber-optic-lintas-pulau",
      excerpt: "Globallink terus memperluas jangkauan rute serat optik strategis guna mempercepat koneksi antar sentra industri di Indonesia.",
      content: "<p>Untuk mendukung pertumbuhan ekonomi digital yang inklusif, perluasan jaringan infrastruktur kabel optik terus kami pacu dengan menghadirkan jalur-jalur transmisi baru dengan latensi terendah.</p>",
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 86400000 * 7),
    },
  ];

  for (const post of initialPosts) {
    const existing = await prisma.post.findUnique({
      where: { slug: post.slug },
    });
    if (!existing) {
      await prisma.post.create({ data: post });
    }
  }
  console.log(`✔ Seeded ${initialPosts.length} initial blog articles.`);

  // 4. Seed Initial Site Contents (Home, About, CTA, Contact, Settings)
  const initialContents = [
    // Hero
    { key: "hero_eyebrow", value: "CONNECTING BUSINESS TO WHAT'S NEXT", group: "hero" },
    { key: "hero_headline", value: "Lebih dari Sekadar Koneksi,", group: "hero" },
    { key: "hero_headline_highlight", value: "Ini Tentang Masa Depan.", group: "hero" },
    { key: "hero_subheadline", value: "Globallink menghadirkan solusi jaringan dan teknologi terintegrasi untuk menghubungkan bisnis Anda dengan peluang tanpa batas.", group: "hero" },
    { key: "hero_image", value: "/images/hero-buildings.jpg", group: "hero" },
    { key: "hero_cta_primary_text", value: "Jelajahi Layanan", group: "hero" },
    { key: "hero_cta_primary_link", value: "/#layanan", group: "hero" },
    { key: "hero_cta_secondary_text", value: "Konsultasi Sekarang", group: "hero" },
    { key: "hero_cta_secondary_link", value: "/#kontak", group: "hero" },

    // Services section meta
    { key: "services_eyebrow", value: "Our Services", group: "services" },
    { key: "services_title", value: "Satu Jaringan.", group: "services" },
    { key: "services_title_highlight", value: "Banyak Kemungkinan.", group: "services" },
    { key: "services_subtitle", value: "Kami menyediakan layanan teknologi dan infrastruktur terlengkap untuk mendukung pertumbuhan bisnis Anda di era digital.", group: "services" },

    // About section
    { key: "about_eyebrow", value: "TENTANG GLOBALLINK", group: "about" },
    { key: "about_title", value: "Teknologi yang Menggerakkan", group: "about" },
    { key: "about_title_highlight", value: "Bisnis ke Masa Depan.", group: "about" },
    { key: "about_description", value: "Globallink adalah penyedia solusi teknologi informasi dan infrastruktur jaringan terkemuka di Indonesia. Kami berdedikasi untuk memberikan konektivitas berkecepatan tinggi, aman, dan andal bagi korporasi, instansi pemerintah, dan penyedia layanan.", group: "about" },
    { key: "about_mission_badge", value: "MISI KAMI", group: "about" },
    { key: "about_mission_statement", value: "Menjadi mitra terpercaya dalam transformasi digital nusantara dengan menghadirkan solusi jaringan cerdas berstandar global.", group: "about" },
    { key: "about_image", value: "/images/about-buildings-bg.jpg", group: "about" },

    // CTA Banner
    { key: "cta_headline", value: "Siap Menghubungkan Bisnis Anda ke Tingkat Berikutnya?", group: "cta" },
    { key: "cta_subheadline", value: "Konsultasikan kebutuhan infrastruktur jaringan dan solusi teknologi enterprise bersama tim spesialis Globallink sekarang.", group: "cta" },
    { key: "cta_button_text", value: "Hubungi Tim Ahli Kami", group: "cta" },
    { key: "cta_button_link", value: "/#kontak", group: "cta" },
    { key: "cta_background_image", value: "/images/cta-connectivity-banner.jpg", group: "cta" },

    // Contact
    { key: "contact_title", value: "Hubungi Kami", group: "contact" },
    { key: "contact_subtitle", value: "Punya pertanyaan atau butuh konsultasi solusi jaringan? Tim ahli kami siap membantu Anda.", group: "contact" },
    { key: "contact_address", value: "Jl. TB Simatupang No. 88, Cilandak, Jakarta Selatan 12430, Indonesia", group: "contact" },
    { key: "contact_email", value: "info@globallink.co.id", group: "contact" },
    { key: "contact_phone", value: "+62 21 5088 9900", group: "contact" },
    { key: "contact_whatsapp", value: "+62 811 8899 0000", group: "contact" },
    { key: "contact_working_hours", value: "Senin - Jumat: 08:30 - 17:30 WIB (NOC 24/7/365)", group: "contact" },

    // General / Settings
    { key: "site_name", value: "Globallink", group: "settings" },
    { key: "site_tagline", value: "Smart IT Solution", group: "settings" },
    { key: "site_logo", value: "/images/globallink-logo.png", group: "settings" },
    { key: "site_favicon", value: "/favicon.ico", group: "settings" },
    { key: "seo_meta_title", value: "Globallink — Smart IT Solution & High-Speed Network Infrastructure", group: "settings" },
    { key: "seo_meta_description", value: "Penyedia infrastruktur jaringan, serat optik, internet service dedicated, smart CCTV, dan satelit terkemuka di Indonesia.", group: "settings" },
    { key: "social_instagram", value: "https://instagram.com/globallink.id", group: "settings" },
    { key: "social_linkedin", value: "https://linkedin.com/company/globallink", group: "settings" },
    { key: "social_facebook", value: "https://facebook.com/globallink.id", group: "settings" },
    { key: "copyright_text", value: "© 2025 Globallink · Hak cipta dilindungi undang-undang.", group: "settings" },

    // Footer
    { key: "footer_description", value: "Didirikan sejak tahun 2010, Globallink berkomitmen menghadirkan solusi infrastruktur jaringan dan teknologi terintegrasi untuk Indonesia. Menghubungkan bisnis dengan konektivitas tanpa batas.", group: "footer" },
    { key: "footer_address", value: "Jl. Urip Sumoharjo No. 20 – Graha Pena Lantai 3 Kav (317-318), Makassar, Sulawesi Selatan", group: "footer" },
    { key: "footer_phone", value: "+62 813 1717 1759", group: "footer" },
    { key: "footer_email", value: "info@globallink.net.id", group: "footer" },
    { key: "footer_instagram_handle", value: "@Globallink.id", group: "footer" },
    { key: "footer_instagram_url", value: "https://instagram.com/globallink.id", group: "footer" },
    { key: "footer_linkedin_url", value: "https://linkedin.com/company/globallink", group: "footer" },
    { key: "footer_facebook_url", value: "https://facebook.com/globallink.id", group: "footer" },
    { key: "footer_copyright_text", value: "© 2025 Globallink · Hak cipta dilindungi undang-undang.", group: "footer" },
    { key: "footer_privacy_url", value: "/#kontak", group: "footer" },
    { key: "footer_terms_url", value: "/#kontak", group: "footer" },
  ];

  for (const c of initialContents) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: { value: c.value, group: c.group },
      create: c,
    });
  }
  console.log(`✔ Seeded ${initialContents.length} site content key-values.`);


  // 5. Seed Initial Services
  const initialServices = [
    {
      title: "Internet Dedicated",
      slug: "internet-service",
      description: "Layanan koneksi internet simetris 1:1 berkecepatan tinggi dengan jaminan SLA 99.9% dan latensi sangat rendah untuk kelancaran operasional bisnis.",
      icon: "Network",
      badge: "Dedicated Bandwidth",
      features: JSON.stringify(["SLA Jaringan 99.9%", "Bandwidth Simetris 1:1", "Dukungan Multi-Backbone"]),
      sortOrder: 1,
    },
    {
      title: "Smart CCTV & AI Monitoring",
      slug: "smart-cctv",
      description: "Sistem pengawasan pintar terintegrasi dengan teknologi AI, deteksi objek otomatis, penyimpanan cloud aman, dan pemantauan real-time 24/7.",
      icon: "Shield",
      badge: "Smart Surveillance",
      features: JSON.stringify(["Face & Object Recognition", "Cloud & On-premise Storage", "Live Remote Monitoring 24/7"]),
      sortOrder: 2,
    },
    {
      title: "Skystar Satellite (VSAT)",
      slug: "skystar",
      description: "Solusi komunikasi satelit berkecepatan tinggi untuk lokasi terpencil, lepas pantai, perkebunan, dan area pertambangan di seluruh nusantara.",
      icon: "Radio",
      badge: "Remote Satellite 3T",
      features: JSON.stringify(["Jangkauan Seluruh Indonesia", "Anti-Cuaca Ekstrem", "Cepat Terpasang"]),
      sortOrder: 3,
    },
    {
      title: "Hardware Procurement",
      slug: "purchasing",
      description: "Penyediaan perangkat keras IT, server, switch, router, dan workstation berkualitas tinggi bergaransi resmi dengan harga kompetitif.",
      icon: "Cpu",
      badge: "Enterprise Hardware",
      features: JSON.stringify(["Hardware Resmi Bergaransi", "Server & Networking Devices", "Best Price Enterprise"]),
      sortOrder: 4,
    },
    {
      title: "IT Consulting & Security",
      slug: "it-consulting",
      description: "Layanan audit keamanan siber, perancangan arsitektur jaringan, dan konsultasi transformasi digital untuk meningkatkan efisiensi TI perusahaan.",
      icon: "Server",
      badge: "Cyber Security & Architecture",
      features: JSON.stringify(["Cyber Security Assessment", "Digital Transformation Road", "Cost Optimization"]),
      sortOrder: 5,
    },
    {
      title: "Managed Service & NOC 24/7",
      slug: "managed-service",
      description: "Pemeliharaan preventif, pengelolaan infrastruktur jaringan menyeluruh, serta dukungan teknis Network Operation Center siaga penuh 24/7.",
      icon: "Network",
      badge: "24/7 Dedicated SLA",
      features: JSON.stringify(["24/7 Dedicated NOC Team", "Preventive Maintenance", "Fast Incident Response"]),
      sortOrder: 6,
    },
  ];

  for (const s of initialServices) {
    const existing = await prisma.serviceItem.findUnique({
      where: { slug: s.slug },
    });
    if (!existing) {
      await prisma.serviceItem.create({ data: s });
    }
  }
  console.log(`✔ Seeded ${initialServices.length} initial service items.`);

  // 6. Seed Initial About Stats
  const initialStats = [
    { value: "99.9%", label: "SLA Garansi Uptime", description: "Jaminan keandalan ketersediaan koneksi dan redundansi jaringan tingkat tinggi.", sortOrder: 1 },
    { value: "100+", label: "Point of Presence (POP)", description: "Titik kehadiran strategis yang tersebar luas di seluruh kepulauan Indonesia.", sortOrder: 2 },
    { value: "24/7", label: "Dukungan NOC Standby", description: "Tim teknisi bersertifikasi siaga memantau performa jaringan tanpa henti.", sortOrder: 3 },
    { value: "10 Gbps+", label: "Kapasitas Backbone", description: "Infrastruktur serat optik berkecepatan ultra tinggi untuk skalabilitas bisnis.", sortOrder: 4 },
  ];

  for (const st of initialStats) {
    const existing = await prisma.aboutStat.findFirst({
      where: { label: st.label },
    });
    if (!existing) {
      await prisma.aboutStat.create({ data: st });
    }
  }
  console.log(`✔ Seeded ${initialStats.length} initial about statistics.`);

  // 7. Seed Initial Partner & Client Logos (100% Stored in Database as HD Vectors, 0 local disk files)
  const { HD_PARTNERS_AND_CLIENTS } = await import("./seed_hd_partners");
  for (const p of HD_PARTNERS_AND_CLIENTS) {
    const existing = await prisma.partnerLogo.findFirst({
      where: { name: p.name },
    });
    if (!existing) {
      await prisma.partnerLogo.create({ data: p });
    }
  }
  console.log(`✔ Seeded ${HD_PARTNERS_AND_CLIENTS.length} HD partner & client logos in database.`);

  console.log("🌱 Development Seed Completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

