import { Injectable } from '@nestjs/common';
import { StorageService } from '../google.storage';

@Injectable()
export class StorageCreateService extends StorageService {
	async file(
		fileName: string,
		file: any, //Express.Multer.File,
	) {
		const [fileUploaded] = await this.storage
			.bucket(this.bucketName)
			.upload(file.path, {
				destination: fileName,
				public: true,
				resumable: false,
				metadata: {
					contentType: file.mimetype,
					cacheControl: 'public, max-age=31536000',
				},
			});

		return fileUploaded;
	}

	async folder(folderName: string) {
		await this.storage.bucket(this.bucketName).file(folderName).save('');
	}
}
