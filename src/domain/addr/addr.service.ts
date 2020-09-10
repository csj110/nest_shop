import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { AddrPostEntity } from 'src/entities/addr/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddrDto } from 'src/dto/addr.dto';

@Injectable()
export class AddrService {
  constructor(@InjectRepository(AddrPostEntity) private addrRepo: Repository<AddrPostEntity>) {}

  async findAll(user: UserEntity): Promise<AddrPostEntity[]> {
    return this.addrRepo.find({ where: { user } });
  }

  async addAddr(addr: AddrDto, user: UserEntity): Promise<any> {
    if (addr.default) {
      const defAddr = await this.addrRepo.findOne({ where: { user, default: true } });
      if (defAddr) {
        defAddr.default = false;
        defAddr.save();
      }
    }
    const addrNew = await this.addrRepo.create(addr);
    addrNew.user = user;
    await addrNew.save();
    return addrNew.toJson();
  }
}
