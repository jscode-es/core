import { ResponseFindChannel } from '@api/channel/domain/channel.type';
import { ChannelMysqlRepository } from '@api/channel/infrastructure/channel.mysql.repository';
import { formatDate, formatDateTime } from '@helper/format.util';
import { convertToFindManyArgs, convertToTotalArgs } from '@helper/prisma.util';
import { HashService } from '@module/hash/hash.service';
import { $Enums, Channel, Prisma } from '@prisma/client';

export class ChannelSearch {
	private readonly db: ChannelMysqlRepository;
	private readonly hash: HashService;
	private readonly storageUser: string;

	constructor() {
		this.db = new ChannelMysqlRepository();
		this.hash = new HashService();
		this.storageUser = 'https://static.speack.me/user/';
	}

	async findOne(id: number): Promise<Channel> {
		return await this.db.getById(id);
	}

	async findBy(key: string, value: string | number): Promise<Channel> {
		const data = await this.db.getByKey(key, value);
		return data;
	}

	async findViewBy(key: string, value: string | number): Promise<Channel> {
		const channels = await this.db.getView({
			select: {
				id: true,
				name: true,
				description: true,
				is_adult: true,
				is_live: true,
				slug: true,
				user: true,
				type: true,
				storageChannel: true,
				storageUser: true,
			},
			where: {
				[key]: value,
			},
			take: 1,
		});

		if (channels.length === 0) return null;

		const channel = channels[0];

		if (channel?.id) channel.id = this.hash.encode(channel.id);
		if (channel?.user) channel.user = this.hash.encode(channel.user);
		if (channel?.storageChannel) {
			channel.profile = `${this.storageUser}${channel.storageUser}/channel/${channel.storageChannel}/portrait.webp`;
			delete channel.storage;
		}

		channel.viewers = Math.floor(Math.random() * 10000);
		channel.videoUrl = 'https://static.speack.me/assets/video/demo1.mp4';
		channel.thumbnailUrl =
			'https://static.speack.me/assets/image/demo/preview/preview_1.jpg';
		channel.videoImgOffline =
			'https://static.speack.me/user/03a5fbe6-6ada-4ba8-a929-e1297d1619e6/channel/da356323-943b-4ea6-a8a0-dae1049fede6/offline.webp';
		channel.videoOffline = null;

		return channel;
	}

	async find(options: any): Promise<ResponseFindChannel> {
		const params = convertToFindManyArgs<Prisma.ChannelFindManyArgs>(
			options,
			Prisma.ChannelScalarFieldEnum,
			[],
		);

		const paramsTotal = convertToTotalArgs<Prisma.ChannelCountArgs>(params);

		const response = await this.db.get(params);
		const total = await this.db.total(paramsTotal);

		// Override id to use hashId
		response.forEach((channel: any) => {
			if (channel?.id) channel.id = this.hash.encode(channel.id);
			if (channel?.user) channel.user = this.hash.encode(channel.user);
		});

		// Salida de datos será el total de registros, los registro y el total de páginas
		return {
			pagination: {
				totalData: total,
				totalPage: Math.ceil(total / options.limit),
				page: options.page,
				perPage: options.limit,
			},
			data: response,
		};
	}

	async findTable(params: {
		limit: number;
		page: number;
		search: string;
		type: $Enums.Channel_type;
	}): Promise<any> {
		// filtrado
		const where: Prisma.ChannelWhereInput = {
			OR: [
				{
					name: {
						contains: params.search,
					},
				},
			],
			type: params.type,
		};

		const options: Prisma.ChannelFindManyArgs = {
			select: {
				id: true,
				name: true,
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
					field: 'name',
					name: 'Nombre del canal',
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

	async recommended({
		offset,
		take = 10,
	}: {
		offset?: number;
		take?: number;
	}) {
		const channels = await this.db.getView({
			select: {
				id: true,
				name: true,
				description: true,
				is_adult: true,
				is_live: true,
				slug: true,
				user: true,
				type: true,
				storageChannel: true,
				storageUser: true,
			},
			orderBy: {
				is_live: 'desc',
			},
			take,
			skip: offset,
		});

		const total = await this.db.getViewTotal();

		// Override id to use hashId
		channels.forEach((channel) => {
			(channel as any).profile = this.getPortraits(channel);
			delete channel.storage;
			if (channel?.id) channel.id = this.hash.encode(channel.id);
			if (channel?.user) channel.user = this.hash.encode(channel.user);

			// Fake viewers
			channel.viewers = Math.floor(Math.random() * 10000);

			// List of fake categories
			const categories = [
				{
					id: 1,
					name: 'Music',
					slug: 'music',
				},
				{
					id: 2,
					name: 'Sports',
					slug: 'sports',
				},
				{
					id: 3,
					name: 'Games',
					slug: 'games',
				},
				{
					id: 4,
					name: 'Talk Shows',
					slug: 'talk-shows',
				},
				{
					id: 5,
					name: 'Just Chatting',
					slug: 'just-chatting',
				},
			];

			// Fake category
			channel.category =
				categories[Math.floor(Math.random() * categories.length)];
		});

		const pages = Math.ceil(total / take);

		return {
			channels,
			pages,
			total,
		};
	}

	async favorite({
		//offset,
		//take = 10,
		user,
	}: {
		offset?: number;
		take?: number;
		user: { id: number };
	}) {
		const data = await this.db.getChannelsByUser(user.id);

		const channels = [];

		for await (const item of data) {
			const { Channel } = item as any;

			const channelInfo = await this.db.getView({
				select: {
					storageChannel: true,
					storageUser: true,
				},
				where: { id: Channel.id },
			});

			channels.push({
				profile: this.getPortraits(channelInfo[0]),
				id: this.hash.encode(Channel.id),
				user: this.hash.encode(Channel.user),
				name: Channel.name,
				description: Channel.description,
				slug: Channel.slug,
				is_live: Channel.is_live,
				type: Channel.type,
			});
		}

		return channels;
	}

	async search(query: string) {
		const total = await this.db.getViewTotal({
			where: {
				name: {
					contains: query,
				},
			},
		});

		const channels = await this.db.getView({
			select: {
				id: true,
				name: true,
				description: true,
				is_adult: true,
				is_live: true,
				slug: true,
				user: true,
				type: true,
				storageChannel: true,
				storageUser: true,
			},
			where: {
				name: {
					contains: query,
				},
			},
			orderBy: {
				is_live: 'desc',
			},
			take: 10,
		});

		// Override id to use hashId
		channels.forEach((channel) => {
			(channel as any).profile = this.getPortraits(channel);
			delete channel.storage;
			if (channel?.id) channel.id = this.hash.encode(channel.id);
			if (channel?.user) channel.user = this.hash.encode(channel.user);
		});

		return { items: channels, total };
	}

	async featured() {
		const channels = await this.db.getView({
			select: {
				id: true,
				name: true,
				description: true,
				is_adult: true,
				is_live: true,
				slug: true,
				user: true,
				type: true,
				storageChannel: true,
				storageUser: true,
			},
			orderBy: {
				is_live: 'desc',
			},
			take: 6,
		});

		// Override id to use hashId
		channels.forEach((channel) => {
			(channel as any).profile = this.getPortraits(channel);
			delete channel.storage;
			if (channel?.id) channel.id = this.hash.encode(channel.id);
			if (channel?.user) channel.user = this.hash.encode(channel.user);
		});

		return channels;
	}

	async getConfigChannelBySlug(slug: string): Promise<Channel> {
		return await this.db.getConfigBySlug(slug);
	}

	private getPortraits(channel: any) {
		return `${this.storageUser}${channel.storageUser}/channel/${channel.storageChannel}/portrait.webp`;
	}
}
