import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ unique: true, length: 30 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true, length: 50 })
  country: string;

  @Column({ name: 'newsletter_subscription', default: false })
  newsletterSubscription: boolean;

  @Column({ name: 'terms_accepted', default: false })
  termsAccepted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}