import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5433),
        username: configService.get<string>('DATABASE_USER', 'bluser'),
        password: configService.get<string>('DATABASE_PASSWORD', 'secret'),
        database: configService.get('DATABASE_NAME', 'bludrone'),
        entities: ['dist/**/**/*.entity.js'],
        synchronize: false, // Don't auto-sync in production
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
