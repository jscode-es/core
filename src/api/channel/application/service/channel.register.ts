import {
	BodyConnection,
	ResponseChannelConfirm,
	TYPE_CHANNEL,
} from '@api/channel/domain/channel.type';
import { ChannelMysqlRepository } from '@api/channel/infrastructure/channel.mysql.repository';
import { CloudflareStream } from '@api/channel/infrastructure/cloudflare.stream.repository';
import { TYPE_USER, VERIFY_USER } from '@api/user/domain/user.type';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { convertToSlug } from '@helper/format.util';
import { generateStreamKey } from '@helper/generate.key.trasmition.util';
import { generateUUID } from '@helper/generate.uuid.util';
import { AvatarService } from '@module/avatar/avatar.service';
import { HashService } from '@module/hash/hash.service';
import { OffensiveService } from '@module/offensive/offensive.in.memory';
import { StorageCreateService } from '@module/storage/service/storage.create.service';
import { Prisma, User } from '@prisma/client';
import { ChannelCreateDto } from '../dto/channel.create.dto';

export class ChannelRegister {
	private readonly dbChannel: ChannelMysqlRepository;
	private readonly dbUser: UserMysqlRepository;
	private readonly offensive: OffensiveService;
	private readonly storage: StorageCreateService;
	private readonly avatar: AvatarService;
	private readonly hash: HashService;
	private readonly stream: CloudflareStream;

	constructor() {
		this.dbChannel = new ChannelMysqlRepository();
		this.dbUser = new UserMysqlRepository();
		this.offensive = new OffensiveService();
		this.storage = new StorageCreateService();
		this.avatar = new AvatarService();
		this.hash = new HashService();
		this.stream = new CloudflareStream();
	}

	async save(input: ChannelCreateDto): Promise<ResponseChannelConfirm> {
		const { name, description, userId } = input;

		// Comprobar si existe el usuario
		const userExist = await this.dbUser.exists('id', userId);

		if (!userExist) throw new Error('El usuario no existe');

		// Recuperar el total de canales del usuario
		const channelTotal = await this.dbChannel.totalByUser(userId);

		// Recuperar el usuario
		const user = await this.dbUser.getById(userId);

		// Comprobar si el usuario puede crear un canal
		const userAllowCreateChannel = await this.userAllowCreateChannel(
			user,
			channelTotal,
		);

		if (!userAllowCreateChannel)
			throw new Error('El usuario no puede crear un canal');

		// comprobar si el nombre del canal es ofensivo
		const isOffensive = this.offensive.isValid(name);
		if (isOffensive) throw new Error('El nombre del canal no es valido');

		// comprobar si el nombre del canal ya existe
		const isChannelExist = await this.dbChannel.exists('name', name);
		if (isChannelExist) throw new Error('El nombre del canal no es valido');

		// comprobar si el slug del canal ya existe
		const slug = convertToSlug(name);
		const channelSlug = await this.dbChannel.exists('slug', slug);
		if (channelSlug) throw new Error('El nombre del canal no es valido');

		// Crear canal en cloudflare
		const channelCloudflare = await this.stream.createChannel(slug);

		if (channelCloudflare.errors.length)
			throw new Error('Error al crear el canal');

		// generar la key de transmision
		const keyTransmition = channelCloudflare.result.rtmps.streamKey;

		// generar storage id
		const storageId = channelCloudflare.result.uid;

		// Conectar realacion con el usuario
		const connect = { id: userId };

		const data: Prisma.ChannelCreateInput = {
			User: { connect },
			name,
			description,
			slug,
			key_transmition: keyTransmition,
			storage: storageId,
			type: TYPE_CHANNEL.NORMAL,
		};

		// Guardar canal
		await this.dbChannel.save(data);

		// Actualizar el tipo de usuario
		this.dbUser.update(userId, { type: TYPE_USER.STREAMER });

		// Carpeta del usuario
		const folderStorage = `user/${user.storage}/channel/${storageId}`;

		// Crear avatar en la nube
		const file = this.avatar.create(input.name);

		// Id de la imagen
		const idImage = generateUUID();

		// Guardar en la carpeta temporal
		const image = await this.avatar.saveTemp(file, idImage);

		// Path de la imagen
		const path = `${folderStorage}/portrait.webp`;

		// Subir imagen a la nube
		await this.storage.file(path, image);

		// Eliminar imagen de la carpeta temporal
		this.avatar.deleteTemp(idImage);

		return { data: 'Canal registrado correctamente' };
	}

	async saveConnection(body: BodyConnection) {
		const { input_id, event_type } = body.data;

		// Compobar si existe el canal por el id de transmision
		const isExist = await this.dbChannel.exists(
			'key_transmition',
			input_id,
		);

		if (!isExist) throw new Error('El canal no existe');

		// Recuperar datos del canal
		const channel = await this.dbChannel.getByKey(
			'key_transmition',
			input_id,
		);

		// Definir estado del la connexión
		const is_live = event_type === 'live_input.connected' ? 1 : 0;

		// Actualizar estado del canal
		await this.dbChannel.update(channel.id, { is_live });

		//TODO: Enviar notificación a los usuarios suscritos
	}

	// TODO: Eliminar, por que lo genera cloudflare
	private async generateKeyTransmition(): Promise<string> {
		const key = generateStreamKey();

		const channel = await this.dbChannel.exists('key_transmition', key);

		if (channel) return await this.generateKeyTransmition();

		return key;
	}

	private async userAllowCreateChannel(
		user: User,
		totalChannel: number,
	): Promise<boolean> {
		const { type, verify } = user;

		// Los usuarios de tipo viewer pueden crear canales
		if (type === TYPE_USER.VIEWER) return true;

		// Los usuarios de tipo bussines pueden crear un solo canal
		if (type === TYPE_USER.BUSINESS && totalChannel > 0) return false;

		// Los usuarios de tipo streamer pueden crear un solo canal, si son de tipo normal, verificado
		if (
			type === TYPE_USER.STREAMER &&
			verify === VERIFY_USER.NORMAL &&
			totalChannel > 0
		)
			return false;
		if (
			type === TYPE_USER.STREAMER &&
			verify === VERIFY_USER.VERIFIED &&
			totalChannel > 0
		)
			return false;

		// Los usuarios de tipo streamer pueden crear dos solo canal, de tipo SILVER
		if (
			type === TYPE_USER.STREAMER &&
			verify === VERIFY_USER.SILVER &&
			totalChannel > 1
		)
			return false;

		// Los usuarios de tipo streamer pueden crear tres solo canal, de tipo GOLD
		if (
			type === TYPE_USER.STREAMER &&
			verify === VERIFY_USER.GOLD &&
			totalChannel > 2
		)
			return false;

		return true;
	}

	async follow(user: number, channel: string): Promise<boolean> {
		const channelId = this.hash.decode(channel);
		const data = await this.dbChannel.addFollowChannel(user, channelId);

		data;

		return true;
	}
}
