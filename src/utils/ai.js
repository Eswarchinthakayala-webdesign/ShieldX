import { Mistral } from '@mistralai/mistralai';
import supabase from './supabase';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

const checkAIUsage = async (userId) => {
    if (!userId) return true; // weak check if no user passed, but we should always pass user.

    // Get current usage
    let { data: usage, error } = await supabase
        .from('user_ai_usage')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error && error.code === 'PGRST116') {
        // Create if not exists
        const { data: newUsage, error: createError } = await supabase
            .from('user_ai_usage')
            .insert([{ user_id: userId, request_count: 0 }])
            .select()
            .single();
        if (createError) throw createError;
        usage = newUsage;
    } else if (error) {
        throw error;
    }

    // Check monthly reset (simple logic: if last_reset_date is prev month)
    const lastReset = new Date(usage.last_reset_date);
    const now = new Date();
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        // Reset
        await supabase
            .from('user_ai_usage')
            .update({ request_count: 0, last_reset_date: now.toISOString() })
            .eq('user_id', userId);
        usage.request_count = 0;
    }

    if (usage.request_count >= 200) {
        throw new Error("AI Protocol Limit Exceeded (200/month). Upgrade Node Firmware.");
    }

    return usage;
};

const incrementAIUsage = async (userId, operationType = 'general', model = 'mistral-tiny') => {
    if (!userId) return;

    // 1. Check & Increment Aggregate Count
    const { data: usage, error: fetchError } = await supabase
        .from('user_ai_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error("Error fetching usage:", fetchError);
        throw fetchError;
    }

    const currentUsage = usage ? usage.request_count : 0;
    
    // Check limit (200 requests per month)
    if (currentUsage >= 200) {
        throw new Error("AI Protocol Limit Exceeded (200/month). Upgrade Node Firmware.");
    }

    // Upsert Aggregate Count
    const { error: upsertError } = await supabase
        .from('user_ai_usage')
        .upsert({ 
            user_id: userId, 
            request_count: currentUsage + 1,
            last_reset_date: usage?.last_reset_date || new Date().toISOString()
        });

    if (upsertError) {
        console.error("Error updating usage count:", upsertError);
    }

    // 2. Log Detailed Entry
    const { error: logError } = await supabase
        .from('ai_usage_logs')
        .insert({
            user_id: userId,
            operation_type: operationType,
            model_used: model
        });

    if (logError) {
        console.error("Error logging detailed usage:", logError);
    }
};

export const summarizeChat = async (messages, userId) => {
    if (!apiKey) throw new Error("Mistral API Key is missing");
    await checkAIUsage(userId);

    const chatContent = messages.map(m => `${m.sender_id === 'me' ? 'Me' : 'Other'}: ${m.content}`).join('\n');
    
    const chatResponse = await client.chat.complete({
        model: 'mistral-tiny',
        messages: [
            { role: 'system', content: 'You are an elite intelligence analyst. Provide a professional executive briefing of the conversation. Structure: 1. **Briefing Overview**: A 1-sentence high-level summary. 2. **Key Intelligence**: Bullet points of critical info, decisions, or sentimental shifts. 3. **Action Items**: Next steps if any. Format in clean, spacing-optimized Markdown. Do NOT use nested lists deeper than one level. Do NOT use code blocks. Start directly with the content.' },
            { role: 'user', content: chatContent }
        ]
    });

    await incrementAIUsage(userId, 'summarize');
    let content = chatResponse.choices[0].message.content;
    // Strip markdown code blocks if present
    content = content.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '');
    return content;
};

export const suggestReplies = async (messages, userId) => {
    if (!apiKey) return [];
    // We might skip usage check for suggestions to be nice? No, strict limit.
    // However, ChatView triggers this automatically? No, only on button click now.
    await checkAIUsage(userId);

    const lastMessages = messages.slice(-5).map(m => `${m.sender_id === 'me' ? 'Me' : 'Other'}: ${m.content}`).join('\n');

    const chatResponse = await client.chat.complete({
        model: 'mistral-tiny',
        messages: [
            { role: 'system', content: 'Suggest 3 short, relevant replies to the last message. Return ONLY the 3 replies separated by a pipe character (|). No other text.' },
            { role: 'user', content: lastMessages }
        ]
    });

    await incrementAIUsage(userId, 'suggestion');
    return chatResponse.choices[0].message.content.split('|').map(s => s.trim());
};

export const rewriteMessageTone = async (text, tone, userId) => {
    if (!apiKey) return text;
    await checkAIUsage(userId);

    const chatResponse = await client.chat.complete({
        model: 'mistral-tiny',
        messages: [
            { role: 'system', content: `Rewrite the following text to be ${tone}. Return ONLY the rewritten text. Do not add explanations. Keep it concise.` },
            { role: 'user', content: text }
        ]
    });

    await incrementAIUsage(userId, 'rewrite');
    return chatResponse.choices[0].message.content.replace(/^"|"$/g, ''); // Remove quotes if added
};

export const translateMessage = async (text, userId, targetLang = 'English') => {
    if (!apiKey) return text;
    await checkAIUsage(userId);
    
    const chatResponse = await client.chat.complete({
        model: 'mistral-tiny',
        messages: [
            { role: 'system', content: `Translate the following text to ${targetLang}. Return ONLY the translation. No explanations.` },
            { role: 'user', content: text }
        ]
    });

    await incrementAIUsage(userId, 'translate');
    return chatResponse.choices[0].message.content;
};
