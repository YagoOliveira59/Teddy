import { Inject, Injectable } from '@nestjs/common';
import {
  IMailService,
  IMailServiceProvider,
} from '@shared/mail/application/ports/mail.service.interface';

import type { SendWelcomeEmailInputType } from './send-welcome-email.input';

@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(
    @Inject(IMailServiceProvider)
    private readonly mailService: IMailService,
  ) {}
  async execute(input: SendWelcomeEmailInputType): Promise<void> {
    const { name, email } = input;
    console.log(`Enviando e-mail de boas-vindas para ${name} (${email})`);

    const subject = `Bem-vindo(a), ${name}!`;
    const body = `
      <h1>Olá, ${name}!</h1>
      <p>Seja muito bem-vindo(a) ao nosso sistema.</p>
      <p>Estamos felizes por ter você conosco.</p>
      <br>
      <p>Atenciosamente,<br>Equipe do Sistema</p>
    `;
    // Note: The email address is hardcoded for demonstration purposes.
    await this.mailService.sendMail(
      `${name.toLocaleLowerCase()}@example.com`,
      subject,
      body,
    );
  }
}
