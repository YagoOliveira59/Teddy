import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailService } from '../../application/ports/mail.service.interface';
import * as nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NodemailerMailService implements IMailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(NodemailerMailService.name);
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      logger: true,
    });

    this.logger.info('NodemailerMailService inicializado.');
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    try {
      const fromName = this.configService.get<string>('MAIL_FROM_NAME');
      const fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL');

      const info = (await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html: body,
      })) as SentMessageInfo;

      this.logger.info(`E-mail enviado para: ${to}`);

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.info(`Preview URL: ${previewUrl}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({ err: error }, 'Falha ao enviar e-mail.');
        throw error;
      } else {
        this.logger.error(
          { err: String(error) },
          'Falha desconhecida ao enviar e-mail.',
        );
        throw new Error(String(error));
      }
    }
  }
}
