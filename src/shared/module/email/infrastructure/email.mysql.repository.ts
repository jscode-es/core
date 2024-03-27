import { tryCatchThrow } from '@helper/try.catch.throw.util';
import { MysqlDB } from '@module/mysql/mysql.database';
import { Prisma } from '@prisma/client';
import { EmailRepository } from '../domain/email.repository';
import { Status } from '../domain/email.type';

export class EmailMysqlRepository implements EmailRepository {
	private readonly db: MysqlDB;

	constructor() {
		this.db = new MysqlDB();
	}

	async exists(key: string, value: string | number): Promise<boolean> {
		const where = { [key]: value };
		const total = await tryCatchThrow(
			this.db.userTrackEmail.count({ where }),
		);
		return total > 0;
	}

	async save(data: Prisma.UserTrackEmailCreateManyInput): Promise<any> {
		return await tryCatchThrow(this.db.userTrackEmail.create({ data }));
	}

	async update(
		trackID: string,
		data: Prisma.UserTrackEmailUpdateInput,
	): Promise<void> {
		const where = { track_id: trackID };
		await tryCatchThrow(this.db.userTrackEmail.update({ where, data }));
	}

	async changeStatus(trackID: string, status: Status): Promise<void> {
		const data = { status };
		const where = { track_id: trackID };

		await tryCatchThrow(this.db.userTrackEmail.update({ where, data }));
	}
}
