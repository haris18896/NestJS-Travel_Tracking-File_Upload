import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// makes the module as globbaly scoped
@Global()
@Module({
  // registering prisma service in this module
  providers: [PrismaService],
  // exporting prisma service to be used in other modules
  exports: [PrismaService],
})
export class PrismaModule {}
