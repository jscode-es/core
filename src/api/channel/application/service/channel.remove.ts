import { ChannelId } from '@api/channel/domain/channel.type';
import { ChannelMysqlRepository } from '@api/channel/infrastructure/channel.mysql.repository';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { StorageDeleteService } from '@module/storage/service/storage.delete.service';

export class ChannelRemove {
	private readonly db: ChannelMysqlRepository;
	private readonly dbUser: UserMysqlRepository;
	private readonly storage: StorageDeleteService;

	constructor() {
		this.db = new ChannelMysqlRepository();
		this.storage = new StorageDeleteService();
		this.dbUser = new UserMysqlRepository();
	}

	// Metodo que llama al metodo deleteLater de la base de datos
	// para eliminar el canal en una fecha determinada
	async removeLater(id: ChannelId): Promise<void> {
		return this.db.deleteLater(id);
	}

	// Metodo que elimina un canal de la base de datos y sus archivos de la nube
	async remove(id: ChannelId): Promise<void> {
		const { storage, user } = await this.db.getById(id);

		const dataUser = await this.dbUser.getById(user);

		const path = `user/${dataUser.storage}/channel/${storage}`;

		this.deleteStorage(path);

		return this.db.delete(id);
	}

	private async deleteStorage(path: string): Promise<void> {
		const isExist = await this.storage.exists(path);

		if (!isExist) return;

		return this.storage.folder(path);
	}
}
