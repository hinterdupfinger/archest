import { User } from '../../core/domain/User';
import type { UserRepository } from '../../core/ports/UserRepository';

export class SqlUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    // Mock SQL Query
    return new User(id, 'John Doe');
  }

  async save(_user: User): Promise<void> {
    // Mock SQL Save
  }
}
