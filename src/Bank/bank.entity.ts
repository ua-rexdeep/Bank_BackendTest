import {Entity, Column, PrimaryGeneratedColumn, Generated,} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Bank {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID generated automatically' })
    id: number;

    @Column({ length: 256, unique: true })
    @ApiProperty({ example: 'Monobank', description: 'Name of Bank' })
    name: string;

    @Column({type: 'float', default: 0})
    @ApiProperty({ example: 172.27344, description: 'Bank balance' })
    balance: number;

    @Column()
    @Generated("uuid")
    api_link: string;

    @Column({ type: 'varchar', length: '215', default: () => 'random()' })
    api_key: string;

    private static random(length = 115): string {
        const ABC = Array.from({length: 91 - 65}).map((x,i)=>String.fromCharCode(i+65))
        const abc = Array.from({length: 123 - 97}).map((x,i)=>String.fromCharCode(i+97))
        const nums = [0,1,2,3,4,5,6,7,8,9]
        const arr: Array<string | number> = [].concat(ABC, abc, nums)
        return Array.from({length: length}).map(() => arr[Math.random() * arr.length] ).join('')
    }
}
