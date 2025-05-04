import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reading_progress')
export class Reading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  book_id: string;

  @Column('int')
  current_page: number;

  @Column('float')
  percentage_read: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
