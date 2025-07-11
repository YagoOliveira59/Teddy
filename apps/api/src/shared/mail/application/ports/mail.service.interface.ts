export interface IMailService {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}

export const IMailServiceProvider = 'IMailService';
