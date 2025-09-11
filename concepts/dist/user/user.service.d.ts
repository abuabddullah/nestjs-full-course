import { HelloService } from 'src/hello/hello.service';
export declare class UserService {
    private readonly helloService;
    constructor(helloService: HelloService);
    getAllUsers(): {
        id: number;
        name: string;
    }[];
    getUserbyId(id: number): {
        id: number;
        name: string;
    } | undefined;
    getWelcomeMessage(userId: number): string;
}
