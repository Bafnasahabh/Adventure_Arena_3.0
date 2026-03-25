const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL ?? '');

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export type Team = {
  team_id: string;
  team_name: string | null;
  access_code: string;
  is_active: boolean;
};

export type Clue = {
  id: string;
  team_id: string;
  sequence_number: number;
  clue_text: string;
  hint_text: string;
  location_description: string | null;
  created_at?: string;
};

export type TeamProgress = {
  id: string;
  team_id: string;
  current_clue_number: number;
  is_completed: boolean;
  start_time: string | null;
  end_time: string | null;
  total_penalty_minutes: number;
  created_at?: string;
};

export type ScanLog = {
  id: string;
  team_id: string;
  qr_data: string;
  scanned_at: string;
  was_correct: boolean;
  error_type: string | null;
};
