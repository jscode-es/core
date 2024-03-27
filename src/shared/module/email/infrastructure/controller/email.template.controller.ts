import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class EmailTemplateController {
	private readonly template: string;
	private lang: string;
	private readonly dataFolderPath: string;
	private readonly defaultLang = 'en';

	constructor(template: string) {
		this.template = template;
		this.lang = this.defaultLang;
		this.dataFolderPath = path.join(process.cwd(), 'data', 'email');
	}

	private getPath(): string {
		const templatePath = this.buildTemplatePath(this.lang);

		if (!this.isTemplateExists(templatePath)) {
			const defaultPath = this.buildTemplatePath(this.defaultLang);

			if (!this.isTemplateExists(defaultPath)) this.fileNotFound();

			return defaultPath;
		}

		return templatePath;
	}

	private isTemplateExists(template: string): boolean {
		return fs.existsSync(template);
	}

	private buildTemplatePath(lang: string): string {
		return path.join(this.dataFolderPath, lang, `${this.template}.hbs`);
	}

	private fileNotFound(): void {
		throw new Error(
			`EmailService: No existe el fichero ${this.template}.hbs en la carpeta ${this.lang}`,
		);
	}

	setLang(lang: string): void {
		this.lang = lang;
	}

	getHTML(data: any): string {
		const templatePath = this.getPath();
		const source = fs.readFileSync(templatePath, 'utf8');
		return handlebars.compile(source)(data);
	}

	getName(): string {
		return this.template;
	}
}
