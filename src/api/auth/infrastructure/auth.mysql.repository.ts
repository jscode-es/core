import { MysqlDB } from '@module/mysql/mysql.database';
import { AuthRepository } from '../domain/auth.repository';

export class AuthMysqlRepository implements AuthRepository {
	private readonly db: MysqlDB;

	constructor() {
		this.db = new MysqlDB();
	}
}
