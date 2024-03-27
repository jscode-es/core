import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
	protected readonly storage: Storage;
	protected bucketName: string;

	constructor() {
		this.storage = new Storage({
			projectId: process.env.GOOGLE_CLOUD_PROJECT,
			keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
		});

		this.bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
	}

	setBucketName(bucketName: string) {
		this.bucketName = bucketName;
	}

	// Comprobar si existe la carpeta
	async exists(folder: string): Promise<boolean> {
		const files = await this.storage
			.bucket(this.bucketName)
			.getFiles({ prefix: folder });

		return files.length > 0;
	}
}
