import { UUID } from '@module/uuid/domain/uuid.type';
import { Prisma } from '@prisma/client';
import { Status } from '../../domain/email.type';
import { EmailMysqlRepository } from '../../infrastructure/email.mysql.repository';

export class EmailTrackingUser {
	private readonly db: EmailMysqlRepository;

	constructor() {
		this.db = new EmailMysqlRepository();
	}

	getImageURL(trackID: UUID): string {
		return `${process.env.HOST}/api/v1/track/email/${trackID}`;
	}

	getHTML(trackID: UUID): string {
		return `
			<img src="${this.getImageURL(trackID)}" alt="track" />
		`;
	}

	async savePending(
		trackID: UUID,
		template: string,
		user: number,
	): Promise<any> {
		const data: Prisma.UserTrackEmailCreateManyInput = {
			track_id: trackID,
			template,
			status: Status.PENDING,
			user,
		};

		return await this.db.save(data);
	}

	async saveSent(trackID: UUID): Promise<void> {
		const data: Prisma.UserTrackEmailUpdateInput = {
			status: Status.SENT,
		};

		await this.db.update(trackID, data);
	}

	async saveOpened(trackID: UUID): Promise<void> {
		const data: Prisma.UserTrackEmailUpdateInput = {
			status: Status.SEEN,
			seen: {
				increment: 1,
			},
		};

		await this.db.update(trackID, data);
	}

	async saveError(trackID: UUID): Promise<void> {
		const data: Prisma.UserTrackEmailUpdateInput = {
			status: Status.FAIL,
		};

		await this.db.update(trackID, data);
	}

	isExistTracking(trackID: UUID): Promise<boolean> {
		return this.db.exists('track_id', trackID);
	}
}
