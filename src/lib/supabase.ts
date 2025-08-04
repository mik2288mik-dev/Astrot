import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ProfileData {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
}

export async function upsertProfile(data: ProfileData) {
  const { data: result, error } = await supabase
    .from('profiles')
    .upsert(data, { onConflict: 'id' });

  if (error) {
    throw error;
  }

  return result;
}
