import { Injectable } from '@nestjs/common';
import { wordsOffensive } from './words.offensive';

@Injectable()
export class OffensiveService {
	private convertNumertToLetter(input: string): string {
		const inputLowerCase = input.toLowerCase();
		const map = {
			'0': 'o',
			'1': 'i',
			'2': 'z',
			'3': 'e',
			'4': 'a',
			'5': 's',
			'6': 'g',
			'7': 't',
			'8': 'b',
			'9': 'g',
		};
		return inputLowerCase.replace(/[0123456789]/g, (m) => map[m]);
	}

	isValid(input: string): boolean {
		const inputLowerCase = this.convertNumertToLetter(input);
		return wordsOffensive.includes(inputLowerCase);
	}
}
