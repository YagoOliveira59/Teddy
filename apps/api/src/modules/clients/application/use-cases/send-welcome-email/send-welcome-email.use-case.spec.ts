import { SendWelcomeEmailUseCase } from './send-welcome-email.use-case';
import type { SendWelcomeEmailInputType } from './send-welcome-email.input';
import type { IMailService } from '@/src/shared/mail/application/ports/mail.service.interface';

describe('SendWelcomeEmailUseCase', () => {
  let useCase: SendWelcomeEmailUseCase;
  let mailService: { sendMail: jest.Mock };

  beforeEach(() => {
    mailService = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };
    useCase = new SendWelcomeEmailUseCase(mailService as IMailService);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send a welcome email with correct subject and body', async () => {
    const input: SendWelcomeEmailInputType = {
      name: 'Alice',
      email: 'alice@example.com',
    };

    await useCase.execute(input);

    expect(mailService.sendMail).toHaveBeenCalledWith(
      input.email,
      `Bem-vindo(a), ${input.name}!`,
      expect.stringContaining(`<h1>Olá, ${input.name}!</h1>`),
    );
  });

  it('should log the sending action', async () => {
    const input: SendWelcomeEmailInputType = {
      name: 'Bob',
      email: 'bob@example.com',
    };

    const logSpy = jest.spyOn(console, 'log');

    await useCase.execute(input);

    expect(logSpy).toHaveBeenCalledWith(
      'Enviando e-mail de boas-vindas para Bob (bob@example.com)',
    );
  });
});
