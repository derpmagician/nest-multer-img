import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Directory where files will be stored
      limits: {
        fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve static files from the uploads directory
      serveRoot: '/subidas', // URL path to access the uploaded files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
