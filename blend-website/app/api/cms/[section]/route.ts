import { NextResponse } from "next/server";
import { isCmsSection, readCmsSection } from "@/lib/cms-server";

type RouteContext = {
  params: Promise<{
    section: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { section } = await context.params;

  if (!isCmsSection(section)) {
    return NextResponse.json({ error: "Unknown CMS section." }, { status: 404 });
  }

  try {
    const data = await readCmsSection(section, {
      fallbackToFile: section !== "blog",
    });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: `Unable to load ${section} content from Firestore.` }, { status: 500 });
  }
}
