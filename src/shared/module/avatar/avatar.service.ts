// ====================================
// Este modulo se encarga de gestionar
// los avatares de los usuarios.
// ====================================

import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as sharp from 'sharp';

interface MultipartFile {
	fieldname: string;
	filename: string;
	mimeType: string;
	toBuffer(): Promise<Buffer>;
}

@Injectable()
export class AvatarService {
	create(letter: string): sharp.Sharp {
		if (letter.length > 1) letter = letter.charAt(0);

		const image = sharp({
			create: {
				width: 100,
				height: 100,
				channels: 4,
				background: this.randomColor(),
			},
		});

		const data = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
			<text x="50" y="68" alignment-baseline="central" text-anchor="middle" font-size="50" fill="white" font-family="Arial, sans-serif">${letter.toUpperCase()}</text>
		</svg>`;

		image.composite([{ input: Buffer.from(data) }]).webp();

		return image;
	}

	async convertFileToWebp(file: MultipartFile, id: string) {
		const buffer = await file.toBuffer();
		const image = sharp(buffer);
		const dirTemp = path.join(os.tmpdir(), `${id}.webp`);

		return new Promise((resolve, reject) => {
			image.toFile(dirTemp, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						path: dirTemp,
						mimetype: 'image/webp',
					});
				}
			});
		});
	}

	saveTemp(image: sharp.Sharp, id: string) {
		const dirTemp = path.join(os.tmpdir(), `${id}.webp`);

		return new Promise((resolve, reject) => {
			image.toFile(dirTemp, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						path: dirTemp,
						mimetype: 'image/webp',
					});
				}
			});
		});
	}

	async deleteTemp(id: string) {
		const dirTemp = path.join(os.tmpdir(), `${id}.webp`);
		return new Promise((resolve, reject) => {
			fs.unlink(dirTemp, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}

	private randomColor() {
		// colores de fondo ideales para letras en color blanco
		const colors = [
			'#1abc9c',
			'#2ecc71',
			'#3498db',
			'#9b59b6',
			'#34495e',
			'#16a085',
			'#27ae60',
			'#2980b9',
			'#8e44ad',
			'#2c3e50',
			'#f1c40f',
			'#e67e22',
			'#e74c3c',
		];

		return colors[Math.floor(Math.random() * colors.length)];
	}
}
