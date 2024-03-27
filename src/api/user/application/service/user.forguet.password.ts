import { UserSearch } from '@api/user/application/service/user.search';
import { ReturnToken } from '@api/user/domain/user.type';
import { EmailForguet } from '@module/email/application/service/email.forguet.service';
import { HashService } from '@module/hash/hash.service';
import { ScopeService } from '@module/scope/scope.service';
import { TokenService } from '@module/token/token.service';
import { BadRequestException } from '@nestjs/common';

export class UserForguetPassword {
	private readonly token: TokenService;
	private readonly hash: HashService;
	private readonly user: UserSearch;
	private readonly scope: ScopeService;
	private readonly emailForguet: EmailForguet;

	constructor() {
		this.user = new UserSearch();
		this.token = new TokenService();
		this.hash = new HashService();
		this.scope = new ScopeService();
		this.emailForguet = new EmailForguet();
	}

	async request(email: string): Promise<ReturnToken> {
		// Comprobar si existe el email
		const user = await this.user.findBy('email', email, ['password']);

		if (!user) throw new BadRequestException('Error al recuperar cuenta');

		// Comprobar si está baneado
		if (user.is_banned)
			throw new BadRequestException('Error al recuperar cuenta');

		// Comprobar si el usuario está confirmado
		if (!user.is_validated)
			throw new BadRequestException('Error al recuperar cuenta');

		// Hash el id del usuario
		const hashId = this.hash.encode(user.id);

		// Crear token de recuperación
		const token = this.token.create({
			user: hashId,
			scope: this.scope.defaultRecovery(),
		});

		// Enviar email de recuperación
		this.emailForguet.send(email, { token, user_id: user.id });

		return { token };
	}
}
