import { Injectable } from '@nestjs/common';
import { StorageService } from '../google.storage';

@Injectable()
export class StorageDeleteService extends StorageService {
	async file(fileName: string) {
		await this.storage.bucket(this.bucketName).file(fileName).delete();
	}

	async folder(folderName: string) {
		// eliminar carpeta aunque esté llena de archivos
		await this.storage.bucket(this.bucketName).deleteFiles({
			prefix: `${folderName}`,
		});
	}
}
