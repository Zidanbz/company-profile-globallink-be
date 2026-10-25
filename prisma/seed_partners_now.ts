import { PrismaClient } from "@prisma/client";
import { CUSTOM_PARTNERS_AND_CLIENTS } from "./seed_custom_partners";

const prisma = new PrismaClient();

async function main() {
  console.log(`Memulai migrasi ${CUSTOM_PARTNERS_AND_CLIENTS.length} logo mitra & client ke database...`);

  let inserted = 0;
  let updated = 0;

  for (const p of CUSTOM_PARTNERS_AND_CLIENTS) {
    const existing = await prisma.partnerLogo.findFirst({
      where: { name: p.name },
    });

    if (existing) {
      await prisma.partnerLogo.update({
        where: { id: existing.id },
        data: {
          category: p.category,
          logoUrl: p.logoUrl,
          sortOrder: p.sortOrder,
          isActive: p.isActive,
        },
      });
      updated++;
    } else {
      await prisma.partnerLogo.create({
        data: {
          name: p.name,
          category: p.category,
          logoUrl: p.logoUrl,
          sortOrder: p.sortOrder,
          isActive: p.isActive,
        },
      });
      inserted++;
    }
  }

  console.log(`✔ Berhasil menyimpan seluruh logo ke database! Inserted: ${inserted}, Updated: ${updated}. 0 file di disk lokal.`);
}

main()
  .catch((e) => {
    console.error("❌ Gagal migrasi logo:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
