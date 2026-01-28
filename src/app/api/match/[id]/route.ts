import { NextResponse } from "next/server";
import { getMatch } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const matchId = parseInt(id, 10);
  if (isNaN(matchId)) {
    return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
  }

  const match = await getMatch(matchId);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";

  return NextResponse.json(match, {
    headers: {
      "Cache-Control": isLive
        ? "public, s-maxage=15, stale-while-revalidate=10"
        : "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
