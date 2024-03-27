export const example = {
	headers: {
		host: 'b414-139-47-120-209.ngrok-free.app',
		'user-agent': 'Cloudflare Stream Webhook',
		'content-length': '1192',
		'accept-encoding': 'gzip',
		'content-type': 'application/json',
		'webhook-signature':
			'time=1693478376,sig1=36d7d552ad2211275c6a63a12ec45680ad61843e9f245cbf6b810480a0fc3ea9',
		'webhook-signature-verification-instructions':
			'https://developers.cloudflare.com/stream/',
		'x-forwarded-for': '2606:4700:1101:2:b74:985b:424a:25db',
		'x-forwarded-proto': 'https',
	},
	body: {
		uid: 'f4466b9685c31fc4e4f079b2dc88292a',
		creator: null,
		thumbnail:
			'https://customer-mvz05d149zgq0i6e.cloudflarestream.com/f4466b9685c31fc4e4f079b2dc88292a/thumbnails/thumbnail.jpg',
		thumbnailTimestampPct: 0,
		readyToStream: true,
		readyToStreamAt: '2023-08-31T10:39:36.548042Z',
		status: {
			state: 'ready',
			pctComplete: '100.000000',
			errorReasonCode: '',
			errorReasonText: '',
		},
		meta: { name: 'Test 31 Aug 23 10:39 UTC' },
		created: '2023-08-31T10:39:05.947528Z',
		modified: '2023-08-31T10:39:36.549051Z',
		scheduledDeletion: null,
		size: 0,
		preview:
			'https://customer-mvz05d149zgq0i6e.cloudflarestream.com/f4466b9685c31fc4e4f079b2dc88292a/watch',
		allowedOrigins: [],
		requireSignedURLs: false,
		uploaded: '2023-08-31T10:39:05.947517Z',
		uploadExpiry: null,
		maxSizeBytes: null,
		maxDurationSeconds: null,
		duration: 14,
		input: { width: 1920, height: 1080 },
		playback: {
			hls: 'https://customer-mvz05d149zgq0i6e.cloudflarestream.com/f4466b9685c31fc4e4f079b2dc88292a/manifest/video.m3u8',
			dash: 'https://customer-mvz05d149zgq0i6e.cloudflarestream.com/f4466b9685c31fc4e4f079b2dc88292a/manifest/video.mpd',
		},
		watermark: null,
		liveInput: '056a526fa3b5264cbedbd03cd5052a8b',
		clippedFrom: null,
		publicDetails: null,
	},
};
