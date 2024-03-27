// ====================================
// Este decorador se encarga de obtener
// los datos del cliente.
// ====================================

import { LocationService } from '@module/location.database';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as DeviceDetector from 'device-detector-js';

function randomNumer() {
	return Math.floor(Math.random() * 255);
}

function randomIp() {
	return `${randomNumer()}.${randomNumer()}.${randomNumer()}.${randomNumer()}`;
}

function getIp(ip: string) {
	const localIps = ['::1', '127.0.0.1', '::ffff:', '::ffff:127.0.0.1'];
	if (localIps.includes(ip)) return randomIp();
	return ip;
}

function getDevice(userAgent: string) {
	const deviceDetector = new DeviceDetector();
	return deviceDetector.parse(userAgent);
}

function getCity(ip: string) {
	const city = new LocationService();
	return city.getCity(ip);
}

function getLocation(ip: string) {
	const info = getCity(ip);

	const data = {
		continent_code: info.continent?.code,
		continent_name: info.continent?.names?.en,
		country_code: info.country?.isoCode,
		country_name: info.country?.names?.en,
		region_code: info?.subdivisions ? info?.subdivisions[0]?.isoCode : null,
		region_name: info?.subdivisions
			? info?.subdivisions[0]?.names.en
			: null,
		city: info.city?.names?.en,
		time_zone: info.location?.timeZone,
		isInEuropeanUnion: info.registeredCountry?.isInEuropeanUnion,
		//languages: info?.traits?.languages,
	};

	return data;
}

function getLanguageByHeader(header: string) {
	if (!header) return 'en';
	const languages = header.split(',');
	return languages[0].split(';')[0];
}

export type ClientTypes = {
	ip: string;
	device: any;
	location: any;
	language: string;
};

export const Client = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): ClientTypes => {
		const request = ctx.switchToHttp().getRequest();
		const ip = getIp(
			request.headers['x-real-ip'] ||
				request.ip ||
				request.headers['x-forwarded-for'] ||
				request.connection.remoteAddress,
		);

		const device = getDevice(request.headers['user-agent']);
		const location = getLocation(ip);
		const language = getLanguageByHeader(
			request.headers['accept-language'],
		);

		return {
			ip,
			device,
			location,
			language,
		};
	},
);
