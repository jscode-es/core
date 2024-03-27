export function convertStringToSelect(
	value: string = '',
	model: Record<string, any> = {},
	ignore: string[] = [],
): any {
	if (!value?.length) return undefined;

	const select = {};

	if (typeof value === 'string') {
		const values = value.split(',');

		for (const value of values) {
			if (ignore.includes(value)) continue;
			if (model[value]) select[value] = true;
		}
	}

	return select;
}

export function convertStringToOr(
	find: string = '',
	findBy: string = '',
	model: Record<string, any> = {},
) {
	if (!findBy?.length) return undefined;

	const OR = findBy.split(',').map((key) => {
		const options = model[key];
		if (!options) return undefined;
		return { [key]: { contains: find } };
	});

	return OR;
}

export function convertToOrderBy(
	orderBy: string = '',
	model: Record<string, any> = {},
) {
	const orders = {};

	const values = orderBy.split(',');

	for (const value of values) {
		const [key, order] = value.split(':');
		if (!model[key]) continue;
		if (order !== 'asc' && order !== 'desc') continue;
		orders[key] = order;
	}

	return orders;
}

export function convertToFilter(
	filter: string = '',
	model: Record<string, any> = {},
) {
	const filters = {};

	const values = filter.split(',');

	for (const value of values) {
		const [key, filter] = value.split(':');
		if (!model[key]) continue;

		// Check if filter is can number
		if (!isNaN(parseInt(filter)))
			filters[key] = { equals: parseInt(filter) };
		else filters[key] = { equals: filter };
	}

	return filters;
}

export function convertToFindManyArgs<T>(
	options: any = {
		limit: 10,
		page: 0,
	},
	fields: Record<string, string> = {},
	exclude: string[] = [],
): T {
	const select = convertStringToSelect(options?.values, fields, exclude);
	const OR = convertStringToOr(options?.find, options?.findBy, fields);
	const AND = convertToFilter(options?.filter, fields);

	const params = {
		take: options?.limit,
		skip: options?.page * options?.limit,
		select,
		where: { OR, AND },
		orderBy: convertToOrderBy(options?.orderBy, fields),
	};

	return params as T;
}

export function convertToTotalArgs<T>(params: any): T {
	const totalParams = {
		where: params?.where,
	};

	return totalParams as T;
}
