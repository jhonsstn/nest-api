import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HasherModule } from './common/hasher/hasher.module';
import { AccountModule } from './models/account/account.module';
import { TransactionModule } from './models/transaction/transaction.module';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }), //TODO: move to config
    HasherModule,
    AuthModule,
    AccountModule,
    TransactionModule,
  ],
})
export class AppModule {}
