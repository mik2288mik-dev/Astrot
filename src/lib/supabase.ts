export interface ProfileData {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export async function upsertProfile(data: ProfileData) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Supabase error: ${res.status}`);
  }

  return res.json();
}
