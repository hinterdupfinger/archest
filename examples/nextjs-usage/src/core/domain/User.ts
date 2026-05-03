export class User {
  constructor(
    public readonly id: string,
    public name: string,
  ) {}

  changeName(newName: string) {
    if (!newName) throw new Error('Name cannot be empty');
    this.name = newName;
  }
}
