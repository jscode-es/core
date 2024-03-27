import { ChannelMysqlRepository } from '@api/channel/infrastructure/channel.mysql.repository';
import { TYPE_USER, UserId } from '@api/user/domain/user.type';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { StorageDeleteService } from '@module/storage/service/storage.delete.service';

export class UserRemove {
	private readonly db: UserMysqlRepository;
	private readonly dbChannel: ChannelMysqlRepository;
	private readonly storage: StorageDeleteService;

	constructor() {
		this.db = new UserMysqlRepository();
		this.storage = new StorageDeleteService();
	}

	// Metodo que llama al metodo deleteLater de la base de datos
	// para eliminar el usuario en una fecha determinada por legal
	async removeLater(id: UserId): Promise<boolean> {
		return this.db.deleteLater(id);
	}

	// Metodo que elimina un usuario de la base de datos y sus archivos de la nube
	async remove(id: UserId): Promise<boolean> {
		const { storage, type } = await this.db.getById(id);

		if (type !== TYPE_USER.VIEWER) this.deleteStorageChannel(id);

		const path = `user/${storage}`;

		this.deleteStorage(path);

		return this.db.delete(id);
	}

	private async deleteStorage(path: string): Promise<void> {
		const isExist = await this.storage.exists(path);

		if (!isExist) return;

		return this.storage.folder(path);
	}

	private async deleteStorageChannel(id: UserId): Promise<void> {
		const { storage } = await this.dbChannel.getByKey('user', id);

		const path = `${id}/channel/${storage}`;

		const isExist = await this.storage.exists(path);

		if (!isExist) return;

		return this.storage.folder(path);
	}
}
