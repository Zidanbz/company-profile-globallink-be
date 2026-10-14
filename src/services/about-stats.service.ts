import { prisma } from "../config/database";

export interface AboutStatDTO {
  id?: number;
  value: string;
  label: string;
  description?: string | null;
  sortOrder?: number;
}

export class AboutStatsService {
  async getAll() {
    return prisma.aboutStat.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async bulkSave(stats: AboutStatDTO[]) {
    // Delete existing and re-insert in order or upsert
    await prisma.aboutStat.deleteMany();
    const created = await prisma.$transaction(
      stats.map((stat, idx) =>
        prisma.aboutStat.create({
          data: {
            value: stat.value,
            label: stat.label,
            description: stat.description || null,
            sortOrder: stat.sortOrder ?? idx + 1,
          },
        })
      )
    );
    return created;
  }
}

export const aboutStatsService = new AboutStatsService();
