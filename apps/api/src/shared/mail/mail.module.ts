import { Module } from '@nestjs/common';
import { IMailServiceProvider } from './application/ports/mail.service.interface';
import { NodemailerMailService } from './infrastructure/services/nodemailer.service';

@Module({
  providers: [
    {
      provide: IMailServiceProvider,
      useClass: NodemailerMailService,
    },
  ],
  exports: [IMailServiceProvider],
})
export class MailModule {}
