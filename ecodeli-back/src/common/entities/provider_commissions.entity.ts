import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointments } from './appointments.entity';

@Entity('provider_commissions')
export class ProviderCommission {
  @PrimaryGeneratedColumn('uuid')
  provider_commission_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  @OneToMany(() => Appointments, (appointment) => appointment.presta_commission)
  appointments: Appointments[];
}
