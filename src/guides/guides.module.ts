import { Module } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [GuidesService],
  controllers: [GuidesController],
  imports: [PrismaModule],
})
export class GuidesModule {}
