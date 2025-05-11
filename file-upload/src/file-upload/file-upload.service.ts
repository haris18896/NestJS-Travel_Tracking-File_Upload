import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {v2 as cloudinary} from 'cloudinary'
import * as fs from 'fs'

@Injectable()
export class FileUploadService {
    constructor (private prisma: PrismaService) {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        })
    }

    
    async uploadFile(file: Express.Multer.File) {
        try {
            // Check if environment variables are set
            if (!process.env.CLOUDINARY_CLOUD_NAME || 
                !process.env.CLOUDINARY_API_KEY || 
                !process.env.CLOUDINARY_API_SECRET) {
                throw new Error('Missing Cloudinary credentials in environment variables');
            }

            const result = await this.uploadFileToCloudinary(file.path) as {
                public_id: string
                secure_url: string
            }

            const fileData = await this.prisma.file.create({
                data: {
                    filename: file.originalname,
                    publicId: result.public_id,
                    url: result.secure_url,
                    
                },
            })

            fs.unlinkSync(file.path)

            return fileData
        } catch (error) {
            // removing file in case of error
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
            console.error('File upload error:', error);
            throw new InternalServerErrorException(
                `Failed to upload file to Cloudinary: ${error.message || 'Unknown error'}`
            );
        }
    }

    private async uploadFileToCloudinary(filePath: string) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error)
                }
                resolve(result)
            })
        })
    }

    async deleteFile(fileId: string) {

        try {
            const file = await this.prisma.file.findUnique({
                where: {
                    id: fileId
                }
            })

            if (!file) {
                throw new NotFoundException('File not found')
            }

            await cloudinary.uploader.destroy(file.publicId)

            await this.prisma.file.delete({
                where: {
                    id: fileId
                }
            })

            return {
                message: 'File deleted successfully'
            }
        } catch (error) {
            console.error('Cloudinary delete error:', error)
            throw new InternalServerErrorException('Failed to delete file from Cloudinary')
        }
    }

    async getFile(fileId: string) {
        try {
            const file = await this.prisma.file.findUnique({
                where: {
                    id: fileId
            }
        })

        if (!file) {
            throw new NotFoundException('File not found')
        }

            return file
        } catch (error) {
            throw new InternalServerErrorException('Failed to get file')
        }
    }

    async getAllFiles() {
        try {
            const files = await this.prisma.file.findMany()
            return files
        } catch (error) {
            throw new InternalServerErrorException('Failed to get all files')
        }
    }

    async searchFiles(query: string) {
        try {
            if (!query) {
                return this.getAllFiles();
            }

            console.log('check query.', query)
            
            const files = await this.prisma.file.findMany({
                where: {
                    OR: [
                        { filename: { contains: query, mode: 'insensitive' } },
                        { publicId: { contains: query, mode: 'insensitive' } },
                        { url: { contains: query, mode: 'insensitive' } }
                    ]
                }
            })
            return files
        } catch (error) {
            console.error('Search files error:', error);
            throw new InternalServerErrorException('Failed to search files')
        }
    }

    
}
