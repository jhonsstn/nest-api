import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HasherModule } from './common/hasher/hasher.module';
import { AccountModule } from './models/account/account.module';
import { TransactionModule } from './models/transaction/transaction.module';
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
    }), //TODO: move to config
    HasherModule,
    AuthModule,
    AccountModule,
    TransactionModule,
  ],
})
export class AppModule {}
