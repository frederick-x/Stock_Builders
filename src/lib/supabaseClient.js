import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase
let isSupabaseConfigured = false

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
	isSupabaseConfigured = true
} else {
	// Provide a safe stub so the app can run without Supabase configured
	// The stub mirrors a minimal subset of the supabase client's auth API used by the app
	// and returns friendly errors when called.
	// Remember to create a `.env` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for full auth.
	// Example .env:
	// VITE_SUPABASE_URL=https://xyzcompany.supabase.co
	// VITE_SUPABASE_ANON_KEY=public-anon-key
	// eslint-disable-next-line no-console
	console.warn('Supabase not configured — falling back to stubbed client. Create .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.')

	supabase = {
		auth: {
			signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
			signUp: async () => ({ error: new Error('Supabase not configured') }),
			signOut: async () => ({}),
			getSession: async () => ({ data: { session: null } }),
			onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
		}
	}
}

export { supabase, isSupabaseConfigured }
