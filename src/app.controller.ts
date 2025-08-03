import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('files')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  listFiles() {
    try {
      const uploadsPath = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsPath)) {
        return [];
      }
      
      const files = fs.readdirSync(uploadsPath);
      return files.map(filename => {
        const filePath = path.join(uploadsPath, filename);
        const stats = fs.statSync(filePath);
        return {
          name: filename,
          size: this.formatFileSize(stats.size),
          type: path.extname(filename),
          uploaded: stats.birthtime.toLocaleString('es-ES'),
        };
      });
    } catch (error) {
      return [];
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string) {
    return {
      message: `File ${filename} retrieved successfully`,
      filename: filename,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo o el archivo no es válido');
    }
    console.log('File received:', file);
    return {
      message: 'File uploaded successfully',
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      savedAs: file.filename,
    };
  }

}
