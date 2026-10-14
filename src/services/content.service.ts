import { prisma } from "../config/database";

export class ContentService {
  /**
   * Get all site contents formatted as a key-value dictionary and by group
   */
  async getAllContents() {
    const contents = await prisma.siteContent.findMany();
    const dictionary: Record<string, string> = {};
    const groups: Record<string, Record<string, string>> = {};

    for (const item of contents) {
      dictionary[item.key] = item.value;
      if (!groups[item.group]) {
        groups[item.group] = {};
      }
      groups[item.group][item.key] = item.value;
    }

    return {
      dictionary,
      groups,
      items: contents,
    };
  }

  /**
   * Get site contents for a specific group
   */
  async getContentsByGroup(group: string) {
    const contents = await prisma.siteContent.findMany({
      where: { group },
    });
    const dictionary: Record<string, string> = {};
    for (const item of contents) {
      dictionary[item.key] = item.value;
    }
    return dictionary;
  }

  /**
   * Bulk update or insert site contents
   */
  async bulkUpdateContents(
    items: Array<{ key: string; value: string; group?: string }>
  ) {
    const results = await prisma.$transaction(
      items.map((item) =>
        prisma.siteContent.upsert({
          where: { key: item.key },
          update: {
            value: item.value,
            ...(item.group ? { group: item.group } : {}),
          },
          create: {
            key: item.key,
            value: item.value,
            group: item.group || "general",
          },
        })
      )
    );
    return results;
  }
}

export const contentService = new ContentService();
