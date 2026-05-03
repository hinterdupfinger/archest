import type { UserRepository } from '../ports/UserRepository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }
}
