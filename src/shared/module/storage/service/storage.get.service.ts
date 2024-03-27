import { Injectable } from '@nestjs/common';
import { StorageService } from '../google.storage';

@Injectable()
export class StorageGetService extends StorageService {
	async file(fileName: string) {
		const [file] = await this.storage
			.bucket(this.bucketName)
			.file(fileName)
			.get();

		return file;
	}

	async folder(folderName: string) {
		const [files] = await this.storage
			.bucket(this.bucketName)
			.getFiles({ prefix: `${folderName}/` });

		return files;
	}
}
