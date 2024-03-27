import { ReturnAuthLogin } from '@api/auth/domain/auth.type';
import { ChannelSearch } from '@api/channel/application/service/channel.search';
import { UserSearch } from '@api/user/application/service/user.search';
import { EmailForguet } from '@module/email/application/service/email.forguet.service';
import { HashService } from '@module/hash/hash.service';
import { PasswordService } from '@module/password/password.service';
import { ScopeService } from '@module/scope/scope.service';
import { TokenService } from '@module/token/token.service';
import { UserLoginDto } from '../dto/auth.create.dto';

export class AuthService {
	private readonly password: PasswordService;
	private readonly token: TokenService;
	private readonly hash: HashService;
	private readonly channel: ChannelSearch;
	private readonly user: UserSearch;
	private readonly scope: ScopeService;
	private readonly emailForguet: EmailForguet;

	constructor() {
		this.user = new UserSearch();
		this.password = new PasswordService();
		this.token = new TokenService();
		this.hash = new HashService();
		this.channel = new ChannelSearch();
		this.scope = new ScopeService();
		this.emailForguet = new EmailForguet();
	}

	async login(input: UserLoginDto): Promise<ReturnAuthLogin> {
		input;
		/* const { alias, password } = input;

		// Comprobar si existe el alias
		const user = await this.user.findBy('alias', alias);

		if (!user) throw new BadRequestException('Error al iniciar sesión');

		// Comprobar si está baneado
		if (user.is_banned)
			throw new BadRequestException('Error al iniciar sesión');

		// Comprobar si el usuario está confirmado
		if (!user.is_validated)
			throw new BadRequestException('Error al iniciar sesión');

		// Comprobar si la contraseña es válida
		const isValidPassword = await this.password.compare(
			password,
			user.password,
		);

		if (!isValidPassword)
			throw new BadRequestException('Error al iniciar sesión');

		// Hash el id del usuario
		const hashId = this.hash.encode(user.id);

		let channel = null;

		let isStreamer = false;

		let scope = this.scope.defaultViewer();

		if (user.type === TYPE_USER.STREAMER) {
			channel = await this.channel.findViewBy('user', user.id);
			isStreamer = true;
			scope = this.scope.defaultStreamer();
		}

		return {
			token: this.token.create({
				user: hashId,
				scope,
			}),
			alias: user.alias,
			type: user.type as TYPE_USER,
			avatar: user.storage,
			email: user.email,
			channel: isStreamer && {
				name: channel?.name,
				slug: channel?.slug,
			},
		}; */

		return null;
	}
}
