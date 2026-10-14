import crypto from "crypto";
import { prisma } from "../config/database";

export interface RecordVisitDTO {
  path: string;
  visitorId?: string;
  userAgent?: string;
  ip?: string;
  referrer?: string;
  duration?: number;
}

export interface AnalyticsQueryDTO {
  period?: "today" | "7d" | "30d";
}

function parseUserAgent(ua: string = ""): {
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
} {
  const uaLower = ua.toLowerCase();

  // Device
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(uaLower)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(uaLower)) {
    deviceType = "mobile";
  }

  // Browser
  let browser = "Lainnya";
  if (/edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  // OS
  let os = "Lainnya";
  if (/windows/i.test(ua)) {
    os = "Windows";
  } else if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad/i.test(ua)) {
    os = "macOS";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  return { deviceType, browser, os };
}

function parseReferrer(ref: string = ""): string {
  if (!ref || ref.trim() === "") return "Langsung (Direct)";
  const refLower = ref.toLowerCase();
  if (refLower.includes("google.")) return "Google Search";
  if (refLower.includes("instagram.")) return "Instagram";
  if (refLower.includes("facebook.") || refLower.includes("fb.")) return "Facebook";
  if (refLower.includes("linkedin.")) return "LinkedIn";
  if (refLower.includes("t.co") || refLower.includes("twitter.") || refLower.includes("x.com")) return "X / Twitter";
  if (refLower.includes("globallink")) return "Internal Web";
  return "Tautan Eksternal";
}

export class AnalyticsService {
  async recordVisit(data: RecordVisitDTO) {
    // Ignore internal admin routes
    if (data.path && data.path.startsWith("/admin")) {
      return null;
    }

    const visitorId = data.visitorId || crypto.randomUUID();
    const ipHash = data.ip
      ? crypto.createHash("sha256").update(data.ip).digest("hex").slice(0, 32)
      : null;

    const { deviceType, browser, os } = parseUserAgent(data.userAgent || "");
    const cleanReferrer = parseReferrer(data.referrer);

    return prisma.visitorLog.create({
      data: {
        visitorId,
        path: data.path || "/",
        ipHash,
        userAgent: data.userAgent?.slice(0, 500) || null,
        deviceType,
        browser,
        os,
        referrer: cleanReferrer,
        duration: data.duration ?? 0,
      },
    });
  }

  async getAnalytics(period: "today" | "7d" | "30d" = "7d") {
    const now = new Date();
    let startDate: Date;

    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (period === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      // 7d default
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Queries in parallel
    const [periodLogs, todayLogs, totalAllTime] = await Promise.all([
      prisma.visitorLog.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.visitorLog.findMany({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.visitorLog.count(),
    ]);

    const totalViews = periodLogs.length;
    const uniqueVisitorIds = new Set(periodLogs.map((l) => l.visitorId));
    const uniqueVisitors = uniqueVisitorIds.size;

    const todayViews = todayLogs.length;
    const todayUnique = new Set(todayLogs.map((l) => l.visitorId)).size;

    // Average duration
    const totalDuration = periodLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 75; // default in seconds

    // Bounce Rate calculation (visitors with only 1 log in period)
    const visitorFreq: Record<string, number> = {};
    for (const l of periodLogs) {
      visitorFreq[l.visitorId] = (visitorFreq[l.visitorId] || 0) + 1;
    }
    const singleVisits = Object.values(visitorFreq).filter((cnt) => cnt === 1).length;
    const bounceRate = uniqueVisitors > 0 ? Math.round((singleVisits / uniqueVisitors) * 100) : 34;

    // Daily Stats for line / bar chart
    const dailyMap: Record<string, { pageViews: number; uniqueVisitorsSet: Set<string>; label: string }> = {};
    const daysCount = period === "today" ? 1 : period === "30d" ? 30 : 7;

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("id-ID", {
        weekday: daysCount <= 7 ? "short" : undefined,
        day: "numeric",
        month: "short",
      });
      dailyMap[key] = { pageViews: 0, uniqueVisitorsSet: new Set(), label };
    }

    for (const l of periodLogs) {
      const key = l.createdAt.toISOString().slice(0, 10);
      if (dailyMap[key]) {
        dailyMap[key].pageViews += 1;
        dailyMap[key].uniqueVisitorsSet.add(l.visitorId);
      }
    }

    const dailyStats = Object.entries(dailyMap).map(([date, val]) => ({
      date,
      label: val.label,
      pageViews: val.pageViews,
      uniqueVisitors: val.uniqueVisitorsSet.size,
    }));

    // Top Pages
    const pageMap: Record<string, number> = {};
    for (const l of periodLogs) {
      const p = l.path || "/";
      pageMap[p] = (pageMap[p] || 0) + 1;
    }
    const topPages = Object.entries(pageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, views]) => ({
        path,
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
      }));

    // Device Stats
    const deviceMap: Record<string, number> = {};
    for (const l of periodLogs) {
      const dev = l.deviceType ? l.deviceType.charAt(0).toUpperCase() + l.deviceType.slice(1) : "Desktop";
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;
    }
    const deviceStats = Object.entries(deviceMap).map(([device, count]) => ({
      device,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }));

    // Browser Stats
    const browserMap: Record<string, number> = {};
    for (const l of periodLogs) {
      const br = l.browser || "Lainnya";
      browserMap[br] = (browserMap[br] || 0) + 1;
    }
    const browserStats = Object.entries(browserMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }));

    // Referrer Stats
    const refMap: Record<string, number> = {};
    for (const l of periodLogs) {
      const ref = l.referrer || "Langsung (Direct)";
      refMap[ref] = (refMap[ref] || 0) + 1;
    }
    const referrerStats = Object.entries(refMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }));

    // Recent Logs (latest 15)
    const recentLogs = periodLogs.slice(0, 15).map((l) => ({
      id: l.id,
      path: l.path,
      deviceType: l.deviceType,
      browser: l.browser,
      os: l.os,
      referrer: l.referrer,
      createdAt: l.createdAt,
    }));

    return {
      summary: {
        totalViews,
        totalAllTime,
        uniqueVisitors,
        todayViews,
        todayUnique,
        avgDuration,
        bounceRate,
      },
      dailyStats,
      topPages,
      deviceStats,
      browserStats,
      referrerStats,
      recentLogs,
    };
  }
}

export const analyticsService = new AnalyticsService();
