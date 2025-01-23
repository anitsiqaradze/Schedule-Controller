import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent {
  Users: any[] = [];
  UsersWithRole: any[] = [];

  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        // response.forEach((element) => {
        //   const role = element.roleId === '1' ? 'Admin' : 'Worker';
        //   this.UsersWithRole.push({ ...element, role });
        // });
        // this.Users = response;
        // console.log(this.Users);
        // console.log(this.UsersWithRole);
        this.Users = response.map((user) => {
          const role = user.roleId === 1 ? 'Admin' : 'Worker';
          return { ...user, role };
        });
        console.log(this.Users);
      },
      error: (error) => console.log('error fetching users', error),
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  changeUserRole(userId: number, roleId: number): void {
    const newRoleId = roleId === 1 ? 2 : 1;

    this.adminService.changeUserRole(userId, newRoleId).subscribe({
      next: () => {
        console.log('user role has changed');
        this.fetchUsers();
      },
      error: (error) => console.log('error changing user role', error),
    });
  }

  deleteUser(userId: number) {
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        console.log('user deleted');
        this.Users = this.Users.filter((user) => user.id != userId);
        //this.fetchUsers();
      },
      error: (error) => console.log('error deleting user ', error),
    });
  }
}
