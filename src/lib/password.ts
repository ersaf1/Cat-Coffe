import crypto from 'crypto';

export function validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: 'Password minimal 8 karakter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password harus mengandung minimal satu huruf besar' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password harus mengandung minimal satu huruf kecil' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password harus mengandung minimal satu angka' };
  }

  return { isValid: true };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password) return 'weak';
  
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // special character

  if (score < 3) return 'weak';
  if (score === 3 || score === 4) return 'medium';
  return 'strong';
}

/**
 * Checks if a hash suffix is in the Pwned Passwords API response.
 * Using k-Anonymity model, we only send the first 5 chars to HIBP.
 */
export async function isPasswordLeaked(password: string): Promise<boolean> {
  const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'NextJS-Supabase-Auth-App'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch from HIBP API', response.statusText);
      // Fail open: if API is down, don't block user registration, but log it.
      return false;
    }

    const data = await response.text();
    const leakedList = data.split('\n');

    for (const line of leakedList) {
      if (line.includes(':')) {
        const [leakedSuffix] = line.split(':');
        if (leakedSuffix === suffix) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('HIBP API error:', error);
    return false; // Fail open
  }
}
