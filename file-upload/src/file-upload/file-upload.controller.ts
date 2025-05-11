import { Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('file-upload')
export class FileUploadController {
    constructor (private readonly fileUploaderService: FileUploadService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.originalname + '-' + uniqueSuffix)
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.fileUploaderService.uploadFile(file)
    }

    @Delete('delete/:id')
    async deleteFile(@Param('id') fileId: string) {
        return this.fileUploaderService.deleteFile(fileId)
    }

    @Get('search')
    async searchFiles(@Query('query') query: string) {
        return this.fileUploaderService.searchFiles(query)
    }

    @Get('all')
    async getAllFiles() {
        return this.fileUploaderService.getAllFiles()
    }

    @Get('file/:id')
    async getFile(@Param('id') fileId: string) {
        return this.fileUploaderService.getFile(fileId)
    }
    
}
