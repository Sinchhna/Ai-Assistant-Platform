import { supabaseConfig } from '@/config/supabase';

export interface AuthUser {
	id: string;
	email: string | null;
	fullName?: string | null;
}

const getClient = () => {
	const client = supabaseConfig.getClient();
	if (!client) throw new Error('Supabase is not configured');
	return client;
};

export const signUp = async (email: string, password: string, fullName?: string) => {
	const supabase = getClient();
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: fullName ? { full_name: fullName } : undefined,
			emailRedirectTo: undefined,
		},
	});
	if (error) throw error;
	// create profile row (optional, safe to ignore if table missing)
	try {
		if (data.user) {
			await supabase.from('profiles').upsert({
				id: data.user.id,
				full_name: fullName ?? null,
			});
		}
	} catch (e) {
		// ignore if profiles table does not exist yet
	}

	// Attempt immediate sign-in for dev convenience if session not established
	if (!data.session) {
		try {
			const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
			if (signInErr) {
				// If email confirmation is required, surface a meaningful error
				throw new Error(signInErr.message || 'Sign-in required. Check email confirmation settings.');
			}
			return signInData.user;
		} catch (e) {
			throw e;
		}
	}

	return data.user;
};

export const signIn = async (email: string, password: string) => {
	const supabase = getClient();
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
	return data.user;
};

export const signOut = async () => {
	const supabase = getClient();
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
	const supabase = getClient();
	const { data } = await supabase.auth.getUser();
	if (!data.user) return null;
	return {
		id: data.user.id,
		email: data.user.email,
		fullName: (data.user.user_metadata as any)?.full_name ?? null,
	};
};

export const onAuthStateChange = (
	callback: (event: string, user: AuthUser | null) => void
) => {
	const supabase = getClient();
	return supabase.auth.onAuthStateChange((_event, session) => {
		const usr = session?.user
			? ({ id: session.user.id, email: session.user.email, fullName: (session.user.user_metadata as any)?.full_name ?? null } as AuthUser)
			: null;
		callback(_event, usr);
	});
};


