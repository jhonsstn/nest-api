import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HasherModule } from './common/hasher/hasher.module';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    HasherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
