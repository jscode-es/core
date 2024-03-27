import { UserId } from '@api/user/domain/user.type';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { generateUUID } from '@helper/generate.uuid.util';
import { AvatarService } from '@module/avatar/avatar.service';
import { HashService } from '@module/hash/hash.service';
import { StorageCreateService } from '@module/storage/service/storage.create.service';
import { TokenService } from '@module/token/token.service';
import { BadRequestException } from '@nestjs/common';

export class UserUpdate {
	private readonly db: UserMysqlRepository;
	private readonly token: TokenService;
	private readonly hash: HashService;
	private readonly storage: StorageCreateService;
	private readonly avatar: AvatarService;

	constructor() {
		this.db = new UserMysqlRepository();
		this.token = new TokenService();
		this.hash = new HashService();
		this.storage = new StorageCreateService();
		this.avatar = new AvatarService();
	}

	async update(id: UserId, body: any) {
		id;
		body;

		// Comprobar si el usuario existe
		//const isExist = await this.db.exists('id', id);
		//if (!isExist) throw new BadRequestException('El usuario no existe');

		//actualizar el usuario

		// Actualizar usuario en la base de datos
		//this.db.update(id, body);

		return {};
	}

	async updateConfirm(token: string) {
		// Comprobar si el token es válido
		const isValid = this.token.verify(token);
		if (!isValid) throw new BadRequestException('El token no es válido');

		// Obtener el hashId del usuario
		const { user } = this.token.get<any>(token);

		if (!user) throw new BadRequestException('El token no es válido');

		// Obtener el id del usuario
		const id = this.hash.decode(user);

		// Comprobar si el usuario existe
		const isExist = await this.db.exists('id', id);
		if (!isExist) throw new BadRequestException('El usuario no existe');

		// Comprobar si el usuario ya esta confirmado
		const { is_validated, storage, alias } = await this.db.getById(id);

		if (is_validated)
			throw new BadRequestException('El usuario ya está confirmado');

		// Carpeta del usuario
		const folderStorage = `user/${storage}`;

		// Crear carpeta en la nube
		//await this.storage.folder(folderStorage);

		// Crear avatar en la nube
		const file = this.avatar.create(alias);

		// Id de la imagen
		const idImage = generateUUID();

		// Guardar en la carpeta temporal
		const image = await this.avatar.saveTemp(file, idImage);

		// Path de la imagen
		const path = `${folderStorage}/portrait.webp`;

		// Subir imagen a la nube
		await this.storage.file(path, image);

		// Actualizar usuario en la base de datos
		this.db.update(id, { is_validated: 1 });

		// Eliminar imagen de la carpeta temporal
		this.avatar.deleteTemp(idImage);

		return;
	}

	async closeSession(token: any) {
		token;

		return {};
	}
}
