import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): {
        id: number;
        name: string;
    }[];
    getUserById(id: number): {
        id: number;
        name: string;
    } | undefined;
    getWelcomeMessage(id: number): string;
}
