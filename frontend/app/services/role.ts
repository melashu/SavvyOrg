import Service from '@ember/service';

export default class RoleService extends Service {
  role: string | null = null;

  // Method to assign a roles
  assignRole(role: string) {
    this.role = role;
    console.log(`Role assigned: ${role}`);
  }

  // Method to get the current role
  getRole(): string | null {
    return this.role;
  }
}
