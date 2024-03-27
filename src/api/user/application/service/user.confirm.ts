import { UserToken } from '@api/user/domain/user.type';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { HashService } from '@module/hash/hash.service';
import { SCOPE } from '@module/scope/scope.type';
import { TokenService } from '@module/token/token.service';
import { BadRequestException } from '@nestjs/common';

export class UserConfirm {
	private readonly db: UserMysqlRepository;
	private readonly token: TokenService;
	private readonly hash: HashService;

	constructor() {
		this.db = new UserMysqlRepository();
		this.token = new TokenService();
		this.hash = new HashService();
	}

	async save(token: string): Promise<boolean> {
		const { id, scope } = this.token.get<UserToken>(token);

		// Decodificar el id del usuario
		const userId = this.hash.decode(id);

		// Validar scope
		const isValidScope = scope.split(',').includes(SCOPE.USER_CONFIRM);

		if (!isValidScope) throw new BadRequestException('Token no válido');

		// Comprobar si el usuario existe
		const isExist = await this.db.exists('id', userId);
		if (!isExist) throw new BadRequestException('El usuario no existe');

		// Comprobar si el usuario ya esta confirmado
		const { is_validated } = await this.db.getById(userId);
		if (is_validated)
			throw new BadRequestException('El usuario ya está confirmado');

		// Confirmar el usuario
		await this.db.update(userId, { is_validated: 1 });

		return true;
	}
}
