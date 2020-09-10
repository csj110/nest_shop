import { Module } from '@nestjs/common';
import { AddrService } from './addr.service';
import { AddrController } from './addr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddrPostEntity } from 'src/entities/addr/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddrPostEntity])],
  providers: [AddrService],
  controllers: [AddrController],
})
export class AddrModule {}
