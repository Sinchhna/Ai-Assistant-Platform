import { supabaseConfig } from '@/config/supabase';

const getClient = () => {
	const client = supabaseConfig.getClient();
	if (!client) throw new Error('Supabase is not configured');
	return client;
};

export interface DBAssistant {
	id: string;
	owner_id: string;
	name: string;
	description: string;
	category: string;
	image_url?: string | null;
	external_id?: string | null;
	created_at?: string;
}

export interface DBConversation {
	id: string;
	owner_id: string;
	assistant_id: string;
	title?: string | null;
	created_at?: string;
}

export interface DBMessage {
	id: string;
	conversation_id: string;
	owner_id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	created_at?: string;
}

export const createAssistant = async (assistant: Omit<DBAssistant, 'id' | 'created_at'>) => {
	const supabase = getClient();
	const { data, error } = await supabase.from('assistants').insert(assistant).select().single();
	if (error) throw error;
	return data as DBAssistant;
};

export const getOrCreateAssistantByExternalId = async (
	ownerId: string,
	externalId: string,
	createPayload: Omit<DBAssistant, 'id' | 'created_at' | 'owner_id' | 'external_id'>
) => {
	const supabase = getClient();
	const { data: found, error: findErr } = await supabase
		.from('assistants')
		.select('*')
		.eq('owner_id', ownerId)
		.eq('external_id', externalId)
		.maybeSingle();
	if (findErr) throw findErr;
	if (found) return found as DBAssistant;
	const { data: created, error: insErr } = await supabase
		.from('assistants')
		.insert({ owner_id: ownerId, external_id: externalId, ...createPayload })
		.select()
		.single();
	if (insErr) throw insErr;
	return created as DBAssistant;
};

export const listAssistants = async () => {
	const supabase = getClient();
	const { data, error } = await supabase.from('assistants').select('*').order('created_at', { ascending: false });
	if (error) throw error;
	return (data ?? []) as DBAssistant[];
};

export const createConversation = async (conv: Omit<DBConversation, 'id' | 'created_at'>) => {
	const supabase = getClient();
	const { data, error } = await supabase.from('conversations').insert(conv).select().single();
	if (error) throw error;
	return data as DBConversation;
};

export const listConversations = async (assistantId?: string) => {
	const supabase = getClient();
	let query = supabase.from('conversations').select('*').order('created_at', { ascending: false });
	if (assistantId) query = query.eq('assistant_id', assistantId);
	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []) as DBConversation[];
};

export const addMessage = async (msg: Omit<DBMessage, 'id' | 'created_at'>) => {
	const supabase = getClient();
	const { data, error } = await supabase.from('messages').insert(msg).select().single();
	if (error) throw error;
	return data as DBMessage;
};

export const listMessages = async (conversationId: string) => {
	const supabase = getClient();
	const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
	if (error) throw error;
	return (data ?? []) as DBMessage[];
};


