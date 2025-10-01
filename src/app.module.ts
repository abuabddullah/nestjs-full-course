import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { SharedModule } from './shared/shared.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes configmodule globally available
      load: [appConfig],
    }),
    // MongooseModule.forRoot(process.env.MONGO_URI as string), // directly using env
    MongooseModule.forRoot(appConfig().mongoUri), // using config
    AuthModule,
    UserModule,
    CourseModule,
    SharedModule,
    AiChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
