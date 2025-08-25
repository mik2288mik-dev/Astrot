import { z } from 'zod';

// Telegram user schema based on initDataUnsafe.user
const TelegramUserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
  allows_write_to_pm: z.boolean().optional(),
  photo_url: z.string().optional()
});

const TelegramInitDataSchema = z.object({
  user: TelegramUserSchema,
  chat_instance: z.string().optional(),
  chat_type: z.string().optional(),
  auth_date: z.number(),
  hash: z.string()
});

export type TelegramUser = z.infer<typeof TelegramUserSchema>;
export type TelegramInitData = z.infer<typeof TelegramInitDataSchema>;

/**
 * Extract and validate Telegram user from request headers
 */
export function extractTelegramUser(request: Request): TelegramUser | null {
  try {
    // In a real app, you would validate the hash against the bot token
    // For now, we'll extract from the Authorization header or request body
    const authHeader = request.headers.get('authorization');
    const telegramData = request.headers.get('x-telegram-init-data');
    
    if (telegramData) {
      // Parse URL-encoded init data
      const params = new URLSearchParams(telegramData);
      const userParam = params.get('user');
      
      if (userParam) {
        const userData = JSON.parse(decodeURIComponent(userParam));
        return TelegramUserSchema.parse(userData);
      }
    }
    
    // Fallback: try to extract from Authorization header
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userData = JSON.parse(atob(token));
      return TelegramUserSchema.parse(userData);
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Telegram user:', error);
    return null;
  }
}

/**
 * Extract Telegram user ID from request
 */
export function extractTelegramUserId(request: Request): number | null {
  const user = extractTelegramUser(request);
  return user?.id || null;
}

/**
 * Validate that the request comes from an authenticated Telegram user
 */
export function requireTelegramAuth(request: Request): TelegramUser {
  const user = extractTelegramUser(request);
  if (!user) {
    throw new Error('Unauthorized: Telegram authentication required');
  }
  return user;
}

/**
 * Mock function for development - extracts user from request body
 * In production, this should be replaced with proper hash validation
 */
export function extractTelegramUserFromBody(body: any): TelegramUser | null {
  try {
    if (body.tgUser) {
      return TelegramUserSchema.parse(body.tgUser);
    }
    if (body.tgId && typeof body.tgId === 'number') {
      // Create a minimal user object for development
      return {
        id: body.tgId,
        first_name: body.name || 'User',
        last_name: undefined,
        username: undefined
      };
    }
    return null;
  } catch (error) {
    console.error('Error extracting Telegram user from body:', error);
    return null;
  }
}