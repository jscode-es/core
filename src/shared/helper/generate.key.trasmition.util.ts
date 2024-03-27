import * as crypto from 'crypto';

// Genera una clave de transmisión aleatoria
export function generateStreamKey(): string {
	const keyLength = 16; // Longitud de la clave en bytes
	const key = crypto.randomBytes(keyLength).toString('hex');
	return key;
}
