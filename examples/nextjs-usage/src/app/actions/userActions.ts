'use server';

import { GetUserUseCase } from '../../core/application/GetUserUseCase';
import { SqlUserRepository } from '../../infrastructure/adapters/SqlUserRepository';

export async function getUserAction(userId: string) {
  // In Next.js, Actions often wire dependencies (or use a DI container)
  const repo = new SqlUserRepository();
  const useCase = new GetUserUseCase(repo);

  const user = await useCase.execute(userId);
  return { id: user.id, name: user.name }; // Return DTO
}
