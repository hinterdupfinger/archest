import type { UserService } from '../services/UserService.js';

export class UserController {
  constructor(private userService: UserService) {}

  getUser() {
    return this.userService.getUser();
  }
}
