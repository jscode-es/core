import { incrementDate } from '@helper/date.util';
import { tryCatchThrow } from '@helper/try.catch.throw.util';
import { MysqlDB } from '@module/mysql/mysql.database';
import { Channel, Prisma } from '@prisma/client';
import { ChannelRepository } from '../domain/channel.repository';

export class ChannelMysqlRepository implements ChannelRepository {
	private readonly db: MysqlDB;
	private readonly dayIncremente: number = 15;

	constructor() {
		this.db = new MysqlDB();
	}

	async save(channel: Prisma.ChannelCreateInput): Promise<Channel> {
		return await tryCatchThrow(this.db.channel.create({ data: channel }));
	}

	async update(
		id: number,
		channel: Prisma.ChannelUpdateInput,
	): Promise<Channel> {
		return await tryCatchThrow(
			this.db.channel.update({ where: { id }, data: channel }),
		);
	}

	async getByKey(key: string, value: unknown): Promise<Channel> {
		const where: any = { [key]: value };
		return await this.db.channel.findUnique({ where });
	}

	async exists(key: string, value: string | number): Promise<boolean> {
		const where = { [key]: value };
		const total = await tryCatchThrow(this.db.channel.count({ where }));
		return total > 0;
	}

	async totalByUser(id: number): Promise<number> {
		const where = { user: id };
		return await tryCatchThrow(this.db.channel.count({ where }));
	}

	async getById(id: number): Promise<Channel> {
		return await tryCatchThrow(
			this.db.channel.findUnique({ where: { id } }),
		);
	}

	async delete(id: number): Promise<void> {
		await tryCatchThrow(this.db.channel.delete({ where: { id } }));
	}

	async deleteLater(id: number): Promise<void> {
		const data = { delete_date: incrementDate(this.dayIncremente) };
		await tryCatchThrow(this.db.channel.update({ where: { id }, data }));
	}

	async get(params: Prisma.ChannelFindManyArgs = {}): Promise<Channel[]> {
		return await tryCatchThrow(this.db.channel.findMany(params));
	}

	async getView(params: any = {}): Promise<any[]> {
		params;
		return [];
		/* return await tryCatchThrow(
			this.db.viewChannelPublicWeb.findMany(params),
		); */
	}

	async getViewTotal(params: any = {}): Promise<number> {
		params;
		return 0;
		/* return await tryCatchThrow(this.db.viewChannelPublicWeb.count(params)); */
	}

	async total(params: Prisma.ChannelCountArgs): Promise<number> {
		return await tryCatchThrow(this.db.channel.count(params));
	}

	async getChannelsByUser(id: number): Promise<Channel[]> {
		const where = {
			user: id,
		};
		return await tryCatchThrow<any>(
			this.db.userFollowChannel.findMany({
				where,
				include: { Channel: true },
			}),
		);
	}

	async getConfigBySlug(slug: string): Promise<Channel> {
		const where = { slug };
		const include = { ChannelConfig: true };
		return await tryCatchThrow<Channel>(
			this.db.channel.findUnique({
				where,
				include,
			}),
		);
	}

	async addFollowChannel(user: number, channel: number): Promise<any> {
		const data: any = { user, channel, is_notification: 1 };
		return await tryCatchThrow(this.db.userFollowChannel.create({ data }));
	}
}
