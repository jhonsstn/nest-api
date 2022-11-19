import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HasherService } from './hasher.service';

@Module({
  imports: [ConfigModule],
  providers: [HasherService],
  exports: [HasherService],
})
export class HasherModule {}
