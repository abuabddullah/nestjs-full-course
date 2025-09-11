import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
  // dependency injection
  constructor(private readonly helloService: HelloService) {}

  @Get('get')
  getHello(): string {
    return this.helloService.getHello();
  }

  @Get('get/user/:name')
  getHelloWithName(@Param('name') name: string): string {
    return this.helloService.getHelloWithName(name);
  }

  // /hello/query?name=john

  @Get('get/query')
  getHelloWithQuery(@Query('name') name: string): string {
    return this.helloService.getHelloWithName(name || 'world');
  }
}
