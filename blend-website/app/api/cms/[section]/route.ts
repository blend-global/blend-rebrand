import { NextResponse } from "next/server";
import { isCmsSection, readCmsSection, writeCmsSection } from "@/lib/cms-server";

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

  const data = await readCmsSection(section);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: RouteContext) {
  const { section } = await context.params;

  if (!isCmsSection(section)) {
    return NextResponse.json({ error: "Unknown CMS section." }, { status: 404 });
  }

  try {
    const body = await request.json();
    await writeCmsSection(section, body.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
