export class UserService {
  public readonly id: string = '123';

  public getUser(): string {
    return 'User';
  }
}

// biome-ignore lint/suspicious/noExplicitAny: Example code
export function fetchUsers(): any[] {
  return [];
}
