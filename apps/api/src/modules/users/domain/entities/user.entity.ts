import { randomUUID } from 'node:crypto';
import { Client } from '../../../clients/domain/entities/client.entity';

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  clients?: Client[];
}

export class User {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _passwordHash: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _clients: Client[];

  private constructor(
    props: UserProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id ?? randomUUID();
    this._name = props.name;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
    this._clients = props.clients ?? [];
  }

  public static create(props: UserProps): User {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(props.email)) {
      throw new DomainException('Invalid email format.');
    }

    if (props.name.length < 3) {
      throw new DomainException(
        'User name must be at least 3 characters long.',
      );
    }

    if (!props.passwordHash) {
      throw new DomainException('Password hash cannot be empty.');
    }

    return new User(props);
  }

  public static hydrate(
    props: UserProps,
    id: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(props, id, createdAt, updatedAt);
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  public changeName(newName: string): void {
    if (newName.length < 3) {
      throw new DomainException(
        'User name must be at least 3 characters long.',
      );
    }
    this._name = newName;
    this.touch();
  }

  public changePassword(newPasswordHash: string): void {
    if (!newPasswordHash) {
      throw new DomainException('New password hash cannot be empty.');
    }
    this._passwordHash = newPasswordHash;
    this.touch();
  }

  public addClientToPortfolio(client: Client): void {
    const alreadyInPortfolio = this._clients.some((c) => c.id === client.id);
    if (!alreadyInPortfolio) {
      this._clients.push(client);
      this.touch();
    }
  }

  public removeClientFromPortfolio(clientId: string): void {
    const initialLength = this._clients.length;
    this._clients = this._clients.filter((c) => c.id !== clientId);
    if (this._clients.length < initialLength) {
      this.touch();
    }
  }

  public toPlain() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      clients: this._clients.map((client) => client.toPlain()),
    };
  }

  // --- Getters ---
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get passwordHash(): string {
    return this._passwordHash;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get clients(): Client[] {
    return [...this._clients];
  }

  public set clients(clients: Client[]) {
    this._clients = clients;
  }
}
