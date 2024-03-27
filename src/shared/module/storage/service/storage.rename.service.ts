import { Injectable } from '@nestjs/common';
import { StorageService } from '../google.storage';

@Injectable()
export class StorageRenameService extends StorageService {
	async file(fileName: string, newFileName: string) {
		const [file] = await this.storage
			.bucket(this.bucketName)
			.file(fileName)
			.move(this.storage.bucket(this.bucketName).file(newFileName));

		return file;
	}

	async folder(folderName: string, newFolderName: string) {
		const [files] = await this.storage
			.bucket(this.bucketName)
			.getFiles({ prefix: `${folderName}/` });

		for (const file of files) {
			const newFileName = file.name.replace(folderName, newFolderName);

			await file.move(
				this.storage.bucket(this.bucketName).file(newFileName),
			);
		}
	}
}
