import { Prisma, User } from '@prisma/client';

export interface UserRepository {
	save(user: Prisma.UserCreateInput, client: ClientTypes): Promise<User>;
	getById(id: number): Promise<User>;
	getByKey(key: string, value: string | number): Promise<User>;
	get(options: Prisma.UserFindManyArgs): Promise<User[]>;
	update(id: number, user: any): Promise<void>;
	delete(id: number): Promise<boolean>;
	deleteLater(id: number): Promise<boolean>;
	exists(key: string, value: string): Promise<boolean>;
}
