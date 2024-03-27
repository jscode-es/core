import { ResponseFindUser } from '@api/user/domain/user.type';
import { UserMysqlRepository } from '@api/user/infrastructure/user.mysql.repository';
import { formatDate, formatDateTime } from '@helper/format.util';
import { convertToFindManyArgs, convertToTotalArgs } from '@helper/prisma.util';
import { HashService } from '@module/hash/hash.service';
import { Prisma, User } from '@prisma/client';

export class UserSearch {
	private readonly db: UserMysqlRepository;
	private readonly hash: HashService;

	constructor() {
		this.db = new UserMysqlRepository();
		this.hash = new HashService();
	}

	async find(options: any = {}): Promise<ResponseFindUser> {
		const params = convertToFindManyArgs<Prisma.UserFindManyArgs>(
			options,
			Prisma.UserScalarFieldEnum,
			['password'],
		);

		const paramsTotal = convertToTotalArgs<Prisma.UserCountArgs>(params);

		const response = await this.db.get(params);
		const total = await this.db.total(paramsTotal);

		// Override id to use hashId
		response.forEach((user: any) => {
			if (user?.id) user.id = this.hash.encode(user.id);
		});

		return {
			pagination: {
				totalPage: Math.ceil(total / options.limit),
				page: options.page,
				perPage: options.limit,
			},
			total,
			items: response,
		};
	}

	async findTable(params: {
		limit: number;
		page: number;
		search: string;
	}): Promise<any> {
		// filtrado
		const where = {
			OR: [
				{
					alias: {
						contains: params.search,
					},
				},
			],
		};

		const options: Prisma.UserFindManyArgs = {
			select: {
				id: true,
				country: true,
				alias: true,
				type: true,
				is_banned: true,
				created: true,
				updated: true,
			},
			where,
			skip: params.page * params.limit,
			take: params.limit,
		};

		const total = await this.db.total({ where });
		const response = await this.db.get(options);

		// Override id to use hashId
		response.forEach((user: any) => {
			if (user?.id) user.id = this.hash.encode(user.id);
			user.created = formatDate(user.created);
			user.updated = formatDateTime(user.updated);
			user.email = '*********';
		});

		// Total page
		const totalPage = Math.ceil(total / params.limit);

		// Pagination
		let next = params.page + 1;
		const prev = params.page - 1;

		// Validar si hay siguiente o anterior
		if (next + 1 > totalPage) {
			next = -1;
		}

		return {
			columns: [
				{
					field: 'id',
					name: 'ID',
					hidden: true,
				},
				{
					field: 'country',
					name: 'País',
					width: '60px',
				},
				{
					field: 'alias',
					name: 'Alias',
				},
				{
					field: 'email',
					name: 'Correo electrónico',
				},
				{
					field: 'type',
					name: 'Tipo',
				},
				{
					field: 'is_banned',
					name: 'Baneado',
				},
				{
					field: 'created',
					name: 'Creado',
					width: '150px',
				},
				{
					field: 'updated',
					name: 'Útima actualización',
					width: '250px',
				},
			],

			page: {
				total: totalPage,
				next,
				prev,
			},
			total,
			items: response,
		};
	}

	async findOne(id: number): Promise<User> {
		return await this.db.getById(id);
	}

	async findBy(
		key: string,
		value: string | number,
		exclude?: string[],
	): Promise<User> {
		return await this.db.getByKey(key, value, exclude);
	}
}
