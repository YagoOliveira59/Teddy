export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

interface UserClientProps {
  userId: string;
  clientId: string;
}

export class UserClient {
  private readonly _userId: string;
  private readonly _clientId: string;

  private constructor(props: UserClientProps) {
    this._userId = props.userId;
    this._clientId = props.clientId;
  }

  public static create(props: UserClientProps): UserClient {
    if (!props.userId) {
      throw new DomainException(
        'User ID é obrigatório para criar a associação.',
      );
    }
    if (!props.clientId) {
      throw new DomainException(
        'Client ID é obrigatório para criar a associação.',
      );
    }

    return new UserClient(props);
  }

  public static hydrate(props: UserClientProps): UserClient {
    return new UserClient(props);
  }

  public toPlain() {
    return {
      userId: this._userId,
      clientId: this._clientId,
    };
  }

  public get userId(): string {
    return this._userId;
  }

  public get clientId(): string {
    return this._clientId;
  }
}
