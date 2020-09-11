import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { AddrPostEntity } from 'src/entities/addr/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, ObjectID, Repository } from 'typeorm';
import { AddrDto } from 'src/dto/addr.dto';

@Injectable()
export class AddrService {
  constructor(@InjectRepository(AddrPostEntity) private addrRepo: Repository<AddrPostEntity>) {}

  async mustFindOne(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<AddrPostEntity>
  ): Promise<AddrPostEntity> {
    const addr = await this.addrRepo.findOne(id, options);
    if (!addr) throw new BadRequestException('地址不存在');
    return addr;
  }

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

  async modifyAddr(addrId: number, addr: Partial<AddrDto>, user: UserEntity): Promise<Partial<AddrPostEntity>> {
    let oldAddr = await this.mustFindOne(addrId, { where: { user } });
    //TODO need to be tested
    await this.addrRepo.update(oldAddr, addr);
    return oldAddr.toJson();
  }

  async deleteAddr(addrId: number, user: UserEntity) {
    let addr = await this.mustFindOne(addrId, { where: { user } });
    // TODO need to be tested
    await addr.softRemove();
  }
}
