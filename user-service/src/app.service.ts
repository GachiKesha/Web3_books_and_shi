import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private users: { username: string; password: string }[] = [];

  register(userDto: { username: string; password: string }) {
    const existing = this.users.find(user => user.username === userDto.username);
    if (existing) {
      return { success: false, message: 'Username already taken' };
    }
    this.users.push(userDto);
    return { success: true, message: 'User registered successfully' };
  }

  login(loginDto: { username: string; password: string }) {
    const user = this.users.find(
      u => u.username === loginDto.username && u.password === loginDto.password,
    );
    if (user) {
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  }
  
  getHello(): string {
    return 'Hello World!';
  }
}
