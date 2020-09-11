import { Column } from "typeorm/decorator/columns/Column";

export class BasePostAddr {
  @Column({ type: 'varchar', length: 8 })
  province: string;

  @Column({ type: 'varchar', length: 20 })
  city: string;

  @Column({ type: 'varchar', length: 20 })
  county: string;

  @Column({ type: 'varchar', length: 40 })
  area: string;
  @Column({ name: 'receiver_name', type: 'varchar', length: '15' })
  receivername: string;

  @Column({ name: 'receiver_phone', type: 'varchar', length: '20' })
  receiverphone: string;
}