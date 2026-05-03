import { Controller } from '@nestjs/common';
import type { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(readonly _usersService: UsersService) {}
}
