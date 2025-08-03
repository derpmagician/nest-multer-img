import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles globalmente
      envFilePath: '.env', // Especifica la ruta del archivo .env
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'nestjs_multer',
      entities: [User],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // Generar un nombre único manteniendo la extensión original
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
      },
      fileFilter: (req, file, callback) => {
        // Solo permitir imágenes
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/bmp',
          'image/svg+xml'
        ];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP, BMP, SVG)'), false);
        }
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serve static files from public directory
      serveRoot: '/', // URL path to access static files (index.html accessible at /)
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve static files from the uploads directory
      serveRoot: '/subidas', // URL path to access the uploaded files
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
