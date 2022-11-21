import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HasherService } from './hasher.service';

@Module({
  providers: [HasherService, ConfigService],
  exports: [HasherService],
})
export class HasherModule {}
