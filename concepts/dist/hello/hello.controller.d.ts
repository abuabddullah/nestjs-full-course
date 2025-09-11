import { HelloService } from './hello.service';
export declare class HelloController {
    private readonly helloService;
    constructor(helloService: HelloService);
    getHello(): string;
    getHelloWithName(name: string): string;
    getHelloWithQuery(name: string): string;
}
