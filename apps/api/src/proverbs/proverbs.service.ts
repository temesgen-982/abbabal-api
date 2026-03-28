import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { text } from 'express';

@Injectable()
export class ProverbsService {
    constructor(private prisma: PrismaService) {}

    async findAll(page: number = 1, limit: number = 20){
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.proverb.findMany({
                skip,
                take: limit,
                orderBy: {
                    id: 'desc',
                }
            }),
            this.prisma.proverb.count(),
        ])
        return { 
            page, 
            limit,
            total,
            results: data,
        };
    }

    async findOne(id: number) {
        return this.prisma.proverb.findUnique({
            where: { id },
        });
    }

    async random() {
        const count = await this.prisma.proverb.count()

        const randomIndex = Math.floor(Math.random() * count)

        const result = await this.prisma.proverb.findMany({
            skip: randomIndex,
            take: 1,
        })

        return result[0]
    }

    async search(query: string, limit = 20) {
        if (!query?.trim()) return [];

        return this.prisma.proverb.findMany({
            where: {
                OR: [
                    { text: { contains: query } },
                    { englishTranslation: { contains: query } },
                ],
            },
            take: limit,
            orderBy: {
            id: 'desc',
            },
        });
    }
}
