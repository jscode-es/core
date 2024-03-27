import { PasswordService } from '@module/password/password.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateService {
	private readonly MINIM_LARGE_PASSWORD = 6;

	date(input: string): boolean {
		const date = new Date(input);
		return date.toString() !== 'Invalid Date';
	}

	minimumAge(birthdate: string, minimumAge: number = 13): boolean {
		const date = new Date(birthdate);
		const now = new Date();
		const age = now.getFullYear() - date.getFullYear();
		return age > minimumAge;
	}

	password(password: string): boolean {
		const hasLetter = /[a-zA-Z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		const hasMinimumLength = password.length >= this.MINIM_LARGE_PASSWORD;
		return hasLetter && hasNumber && hasMinimumLength;
	}

	async passwordMatch(password: string, hash: string): Promise<boolean> {
		const passwordService = new PasswordService();
		const isMatch = await passwordService.compare(password, hash);
		return isMatch;
	}

	email(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		return emailRegex.test(email);
	}
}
