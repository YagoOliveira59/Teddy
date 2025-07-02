import { randomUUID } from 'node:crypto';
import { User } from 'src/modules/users/domain/entities/user.entity';

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

interface ClientProps {
  name: string;
  salary: number;
  companyValue: number;
  creatorId: string;
  users?: User[];
}

export class Client {
  private readonly _id: string;
  private _name: string;
  private _salary: number;
  private _companyValue: number;
  private readonly _creatorId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private _users: User[];

  private constructor(
    props: ClientProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id ?? randomUUID();
    this._name = props.name;
    this._salary = props.salary;
    this._companyValue = props.companyValue;
    this._creatorId = props.creatorId;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
    this._users = props.users ?? [];
  }

  public static create(props: ClientProps): Client {
    if (props.name.length < 3) {
      throw new DomainException(
        'Client name must be at least 3 characters long.',
      );
    }

    if (props.salary < 0) {
      throw new DomainException('Salary cannot be negative.');
    }

    if (props.companyValue <= 0) {
      throw new DomainException('Company value must be greater than zero.');
    }

    return new Client(props);
  }

  public static hydrate(
    props: ClientProps,
    id: string,
    createdAt: Date,
    updatedAt: Date,
  ): Client {
    return new Client(props, id, createdAt, updatedAt);
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  public updateSalary(newSalary: number): void {
    if (newSalary < 0) {
      throw new DomainException('Salary cannot be negative.');
    }

    this._salary = newSalary;
    this.touch();
  }

  public updateCompanyValue(companyValue: number): void {
    if (companyValue <= 0) {
      throw new DomainException('Company value must be greater than zero.');
    }
    this._companyValue = companyValue;
    this.touch();
  }

  public changeName(newName: string): void {
    if (newName.length < 3) {
      throw new DomainException(
        'Client name must be at least 3 characters long.',
      );
    }

    this._name = newName;
    this.touch();
  }

  public addUser(user: User): void {
    const userExists = this._users.some(
      (existingUser) => existingUser.id === user.id,
    );
    if (!userExists) {
      this._users.push(user);
      this.touch();
    }
  }

  public removeUser(userId: string): void {
    const initialLength = this._users.length;
    this._users = this._users.filter((user) => user.id !== userId);
    if (this._users.length < initialLength) {
      this.touch();
    }
  }

  public canBeDeletedBy(userId: string): boolean {
    return this._creatorId === userId;
  }

  public toPlain(): {
    id: string;
    name: string;
    salary: number;
    companyValue: number;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    users: ReturnType<User['toPlain']>[];
  } {
    return {
      id: this._id,
      name: this._name,
      salary: this._salary,
      companyValue: this._companyValue,
      creatorId: this._creatorId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      users: this._users.map((user) => user.toPlain()),
    };
  }

  // --- Getters ---
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get salary(): number {
    return this._salary;
  }

  public get companyValue(): number {
    return this._companyValue;
  }

  public get creatorId(): string {
    return this._creatorId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get users(): User[] {
    return [...this._users];
  }
}
