import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { HasherModule } from './common/hasher/hasher.module';
import dbEnvironment from './configs/db';
import { AccountModule } from './models/account/account.module';
import { TransactionModule } from './models/transaction/transaction.module';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().default(5432),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_NAME: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRATION_TIME: joi.string().required(),
        BCRYPT_SALT: joi.number().required(),
      }),
    }),
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const env = process.env.NODE_ENV || 'development';
        return dbEnvironment[env];
      },
    }),
    HasherModule,
    AuthModule,
    AccountModule,
    TransactionModule,
  ],
})
export class AppModule {}
