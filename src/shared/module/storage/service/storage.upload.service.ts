import { Injectable } from '@nestjs/common';
import { StorageService } from '../google.storage';

@Injectable()
export class StorageUploadService extends StorageService {
	async file(fileName: string, filePath: string) {
		await this.storage.bucket(this.bucketName).upload(filePath, {
			destination: fileName,
		});
	}

	async folder(folderName: string, folderPath: string) {
		const [files] = await this.storage.bucket(this.bucketName).getFiles({
			prefix: `${folderName}/`,
		});

		for (const file of files) {
			const newFileName = file.name.replace(folderName, folderPath);

			await file.move(
				this.storage.bucket(this.bucketName).file(newFileName),
			);
		}
	}
}
