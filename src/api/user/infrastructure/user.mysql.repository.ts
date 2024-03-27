import { incrementDate } from '@helper/date.util';
import { exclude } from '@helper/exclude.util';
import { tryCatchThrow } from '@helper/try.catch.throw.util';
import { MysqlDB } from '@module/mysql/mysql.database';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../domain/user.repository';

export class UserMysqlRepository implements UserRepository {
	private readonly db: MysqlDB;
	private readonly dayIncremente: number = 15;

	constructor() {
		this.db = new MysqlDB();
	}

	async save(user: Prisma.UserCreateInput): Promise<User> {
		return await tryCatchThrow(this.db.user.create({ data: user }));
	}

	async getById(id: number): Promise<User> {
		return await tryCatchThrow(this.db.user.findUnique({ where: { id } }));
	}

	async getByKey(
		key: string,
		value: string | number,
		excludes?: string[],
	): Promise<User> {
		const where: any = { [key]: value };

		const user: any = await tryCatchThrow(
			this.db.user.findUnique({ where }),
		);

		if (!excludes?.length) return user;

		const dataExclude = exclude(user, excludes);

		return dataExclude;
	}

	async get(params: Prisma.UserFindManyArgs = {}): Promise<User[]> {
		return await tryCatchThrow(this.db.user.findMany(params));
	}

	async total(params: Prisma.UserCountArgs = {}): Promise<number> {
		return await tryCatchThrow(this.db.user.count(params));
	}

	async update(id: number, user: any): Promise<void> {
		await tryCatchThrow(this.db.user.update({ where: { id }, data: user }));
	}

	async delete(id: number): Promise<boolean> {
		await tryCatchThrow(this.db.user.delete({ where: { id } }));
		return true;
	}

	async deleteLater(id: number): Promise<boolean> {
		const data = { delete_date: incrementDate(this.dayIncremente) };
		await tryCatchThrow(this.db.user.update({ where: { id }, data }));
		return true;
	}

	async exists(key: string, value: string | number): Promise<boolean> {
		const where = { [key]: value };
		const total = await tryCatchThrow(this.db.user.count({ where }));
		return total > 0;
	}
}
