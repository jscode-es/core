import { UUID } from '@module/uuid/domain/uuid.type';
import { Prisma } from '@prisma/client';

export interface EmailRepository {
	exists(key: string, value: string | number): Promise<boolean>;
	save(data: Prisma.UserTrackEmailCreateManyInput): Promise<void>;
	update(
		trackID: UUID,
		data: Prisma.UserTrackEmailUpdateInput,
	): Promise<void>;
}
