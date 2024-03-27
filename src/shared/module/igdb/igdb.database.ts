import { sleepRandom } from '@helper/sleep.util';
import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { MysqlDB } from '../mysql/mysql.database';

type ResponseToken = {
	access_token: string;
	expires_in: number;
	token_type: string;
};

type ResponseGame = {
	name: string;
	slug: string;
	cover: string;
};

@Injectable()
export class IgDB {
	private clientID: string;
	private clientSecret: string;
	private url = 'https://api.igdb.com/v4';
	private limit = 500;
	private db: MysqlDB;

	constructor() {
		this.clientID = process.env.TWITCH_CLIENT;
		this.clientSecret = process.env.TWITCH_SECRET;
		this.db = new MysqlDB();
	}

	async getToken(): Promise<ResponseToken> {
		const url = `https://id.twitch.tv/oauth2/token?client_id=${this.clientID}&client_secret=${this.clientSecret}&grant_type=client_credentials`;
		const response = await fetch(url, { method: 'POST' });
		return await response.json();
	}

	async getGames(
		responseToken: ResponseToken,
		page: number = 0,
	): Promise<any> {
		if (!responseToken) return;

		const headers = {
			'Client-ID': this.clientID,
			Authorization: `Bearer ${responseToken.access_token}`,
		};

		const currentPage = page * this.limit;

		const url = `${this.url}/games`;
		const body = `fields name, slug, cover.image_id; sort first_release_date desc; where rating >= 50 & cover.image_id != null ;sort release_dates.date desc; limit ${this.limit}; offset ${currentPage};`;

		const responseIGDB = await fetch(url, {
			method: 'POST',
			headers,
			body,
		});

		return await responseIGDB.json();
	}

	async getImage(image_id: string): Promise<any> {
		const url = `https://images.igdb.com/igdb/image/upload/t_720p/${image_id}.jpg`;
		const response = await fetch(url);
		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const dirTemp = path.join(os.tmpdir(), `${image_id}.jpg`);
		await fs.writeFile(dirTemp, buffer);

		return {
			path: dirTemp,
			mimetype: 'image/jpg',
		};
	}

	async removeImage(image_id: string): Promise<any> {
		const dirTemp = path.join(os.tmpdir(), `${image_id}.jpg`);
		return fs.unlink(dirTemp);
	}

	async getAll(): Promise<ResponseGame[]> {
		const responseToken = await this.getToken();
		const totalPage = 41;
		let games = [];

		for (let page = 0; page < totalPage; page++) {
			await sleepRandom(500, 2000);

			const responseGames = await this.getGames(responseToken, page);

			if (!responseGames?.length) break;

			const data = responseGames.map((game) => {
				return {
					name: game.name,
					slug: game.slug,
					cover: game.cover.image_id,
				};
			});

			games = [...games, ...data];
		}

		return games;
	}
}
