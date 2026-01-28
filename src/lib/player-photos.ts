const CHELSEA_FPL_TEAM_ID = 7;

interface FPLElement {
  first_name: string;
  second_name: string;
  web_name: string;
  photo: string;
  team: number;
}

interface FPLResponse {
  elements: FPLElement[];
}

export type PlayerPhotoMap = Record<string, string>;

function normalize(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildPhotoUrl(photo: string): string {
  const id = photo.replace(".jpg", "");
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${id}.png`;
}

export async function getPlayerPhotos(): Promise<PlayerPhotoMap> {
  try {
    const res = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return {};

    const data: FPLResponse = await res.json();
    const players = data.elements.filter(
      (p) => p.team === CHELSEA_FPL_TEAM_ID
    );

    const photoMap: PlayerPhotoMap = {};
    for (const p of players) {
      const url = buildPhotoUrl(p.photo);
      const fullName = normalize(`${p.first_name} ${p.second_name}`);
      const lastName = normalize(p.second_name);
      const webName = normalize(p.web_name);

      photoMap[fullName] = url;
      photoMap[lastName] = url;
      photoMap[webName] = url;
    }

    return photoMap;
  } catch {
    return {};
  }
}

export function findPlayerPhoto(
  playerName: string,
  photos: PlayerPhotoMap
): string | null {
  const name = normalize(playerName);

  // Exact full name match
  if (photos[name]) return photos[name];

  // Last name only
  const parts = name.split(" ");
  const lastName = parts[parts.length - 1];
  if (photos[lastName]) return photos[lastName];

  // First + last (skip middle names)
  if (parts.length > 2) {
    const firstLast = `${parts[0]} ${parts[parts.length - 1]}`;
    if (photos[firstLast]) return photos[firstLast];
  }

  // Partial: check if any key contains the name or vice versa
  for (const [key, url] of Object.entries(photos)) {
    if (name.includes(key) || key.includes(name)) return url;
  }

  return null;
}
