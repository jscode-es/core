import { ResponseUserConfirm } from '@api/user/domain/user.type';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { generateUUID } from '@helper/generate.uuid.util';
import { AvatarService } from '@module/avatar/avatar.service';
import { EmailConfirm } from '@module/email/application/service/email.confirm.service';
import { HashService } from '@module/hash/hash.service';
import { OffensiveService } from '@module/offensive/offensive.in.memory';
import { PasswordService } from '@module/password/password.service';
import { StorageCreateService } from '@module/storage/service/storage.create.service';
import { TokenService } from '@module/token/token.service';
import { ValidateService } from '@module/validate/validate.service';
import { ErrorFileSize } from '@server/error/file/size.error';
import { ErrorFileType } from '@server/error/file/type.error';
import { ErrorUserNotExist } from '@server/error/user/not_exist.error';
import { UserCreateDto } from '../dto/user.create.dto';

export class UserRegister {
	private readonly MAX_AGE = 13;
	private readonly EXPIRATION = '48h';
	private readonly MAX_SIZE_FILE = 10000000;
	private readonly MIN_SIZE_FILE = 1000;
	private readonly db: UserMysqlRepository;
	private readonly offensive: OffensiveService;
	private readonly password: PasswordService;
	private readonly validate: ValidateService;
	private readonly emailConfirm: EmailConfirm;
	private readonly token: TokenService;
	private readonly hash: HashService;
	private readonly storage: StorageCreateService;
	private readonly avatar: AvatarService;

	constructor() {
		this.db = new UserMysqlRepository();
		this.offensive = new OffensiveService();
		this.password = new PasswordService();
		this.validate = new ValidateService();
		this.emailConfirm = new EmailConfirm();
		this.token = new TokenService();
		this.hash = new HashService();
		this.storage = new StorageCreateService();
		this.avatar = new AvatarService();
	}

	async save(
		input: UserCreateDto,
		client: any,
	): Promise<ResponseUserConfirm> {
		input;
		client;

		return null;
		/* const { alias, email, password, birthdate } = input;
		// Comprobar si existe el alias
		const isAliasExist = await this.db.exists('alias', alias);
		if (isAliasExist) throw new ErrorAliasNotAllow();

		// Si el alias es ofensivo
		const isOffensive = this.offensive.isValid(alias);
		if (isOffensive) throw new ErrorAliasNotAllow();

		// Comprobar si existe el email
		const isEmailExist = await this.db.exists('email', email);
		if (isEmailExist) throw new ErrorAliasNotAllow();

		// Validar si la contraseña es válida
		const isPassowdValid = this.validate.password(password);
		if (!isPassowdValid) throw new ErrorPassword();

		// Validar si la fecha de nacimiento es válida
		const isDateValid = this.validate.date(birthdate);
		if (!isDateValid) throw new ErrorDate();

		// Validar si la edad es mayor
		const isAgeValid = this.validate.minimumAge(birthdate, this.MAX_AGE);
		if (!isAgeValid) throw new ErrorYear(this.MAX_AGE);

		// Encriptar la contraseña
		const hashPassword = await this.password.encrypt(password);

		// Guardar el usuario en la base de datos
		const data = {
			storage: await this.generateStorageId(),
			email,
			alias,
			password: hashPassword,
			birthdate: new Date(birthdate).toISOString(),
			type: TYPE_USER.VIEWER,
			continent: client.location.continent_code,
			country: client.location.country_code,
			region: client.location.region_code,
		};

		// Guardar el usuario en la base de datos
		const user = await this.db.save(data);

		// Hash el id del usuario
		const hashId = this.hash.encode(user.id);

		// Expiración del token
		const optionsToken = { expiresIn: this.EXPIRATION };

		// Datos de usuario
		const userData = {
			id: hashId,
			scope: SCOPE.USER_CONFIRM,
		};

		// Crear el token de confirmación
		const token = this.token.create(userData, optionsToken);

		// Crear la url de confirmación
		const urlConfirm = `${process.env.HOST_RENDER}/confirm?token=${token}`;

		// Datos de envío del email
		const params: SendEmailConfirmProps = {
			url: urlConfirm,
			name: alias,
			userId: user.id,
			lang: client.language,
		};

		// Enviar el email de confirmación
		this.emailConfirm.send(email, params);

		return { token, id: hashId }; */
	}

	private async generateStorageId(): Promise<string> {
		const storage = generateUUID();

		const isStorageExist = await this.db.exists('storage', storage);

		if (isStorageExist) return await this.generateStorageId();

		return storage;
	}

	async profile(userId: number, file: any): Promise<any> {
		const typesAllowed = ['jpg', 'jpeg', 'png', 'gif'];
		const type = file.mimetype.split('/')[1];

		if (!typesAllowed.includes(type)) throw new ErrorFileType();

		const isAllowSize =
			file.size > this.MAX_SIZE_FILE || file.size < this.MIN_SIZE_FILE;

		// Maximun size 10mb and minimun 1kb
		if (!isAllowSize) throw new ErrorFileSize();

		// Comprobar si el usuario existe
		const isExist = await this.db.exists('id', userId);
		if (!isExist) throw new ErrorUserNotExist();

		// Comprobar si el usuario ya esta confirmado
		const { storage } = await this.db.getById(userId);

		// Id de la imagen
		const idImage = generateUUID();

		// Carpeta del usuario
		const folderStorage = `user/${storage}`;

		// Convert to file to webp
		const image = await this.avatar.convertFileToWebp(file, idImage);

		// Path de la imagen
		const path = `${folderStorage}/portrait.webp`;

		// Subir imagen a la nube
		await this.storage.file(path, image);

		// Limpiar cache de cloudflare
		/* const cache = await this.cloudflare.remove(
			`${process.env.HOST_STATIC}/${folderStorage}/portrait.webp`,
		); */

		// Eliminar imagen de la carpeta temporal
		this.avatar.deleteTemp(idImage);

		return true;
	}
}
