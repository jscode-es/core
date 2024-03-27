import { Reader } from '@maxmind/geoip2-node';
import { LOCATION_DEFAULT } from '@server/constant/location.const';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class LocationService {
	getCountry(ip: string) {
		const databasePath = path.join(
			__dirname,
			'../../../',
			'/data/location/GeoLite2-Country.mmdb',
		);
		const dbBuffer = fs.readFileSync(databasePath);
		const reader = Reader.openBuffer(dbBuffer);
		return reader.country(ip);
	}

	getCity(ip: string) {
		try {
			const databasePath = path.join(
				__dirname,
				'../../../',
				'/data/location/GeoLite2-City.mmdb',
			);
			const dbBuffer = fs.readFileSync(databasePath);
			const reader = Reader.openBuffer(dbBuffer);
			return reader.city(ip);
		} catch (error) {
			return LOCATION_DEFAULT;
		}
	}
}
