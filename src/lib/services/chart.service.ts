import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export class ChartService {
  /**
   * Сохраняет новую натальную карту
   */
  static async create(userId: string, data: {
    title?: string
    description?: string
    inputData: any
    chartData: any
    timeUnknown?: boolean
    houseSystem?: string
  }) {
    return prisma.natalChart.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        inputData: data.inputData,
        chartData: data.chartData,
        timeUnknown: data.timeUnknown || false,
        houseSystem: data.houseSystem || 'P',
      }
    })
  }
  
  /**
   * Получает все карты пользователя
   */
  static async getUserCharts(userId: string, limit = 50) {
    return prisma.natalChart.findMany({
      where: { userId },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      include: {
        interpretations: {
          select: {
            id: true,
            type: true,
            createdAt: true
          }
        }
      }
    })
  }
  
  /**
   * Получает карту по ID
   */
  static async getById(id: string, userId?: string) {
    const where: Prisma.NatalChartWhereInput = { id }
    if (userId) {
      where.userId = userId
    }
    
    return prisma.natalChart.findFirst({
      where,
      include: {
        interpretations: true,
        threads: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              take: 10
            }
          }
        }
      }
    })
  }
  
  /**
   * Обновляет карту
   */
  static async update(id: string, userId: string, data: {
    title?: string
    description?: string
    pinned?: boolean
  }) {
    return prisma.natalChart.updateMany({
      where: { id, userId },
      data
    })
  }
  
  /**
   * Закрепляет/открепляет карту
   */
  static async togglePin(id: string, userId: string) {
    // Сначала получаем текущее состояние
    const chart = await prisma.natalChart.findFirst({
      where: { id, userId }
    })
    
    if (!chart) {
      throw new Error('Chart not found')
    }
    
    if (!chart.pinned) {
      // Если закрепляем - сначала открепляем все остальные
      await prisma.natalChart.updateMany({
        where: { userId, pinned: true },
        data: { pinned: false }
      })
    }
    
    // Переключаем состояние закрепления
    return prisma.natalChart.update({
      where: { id },
      data: { pinned: !chart.pinned }
    })
  }
  
  /**
   * Удаляет карту
   */
  static async delete(id: string, userId: string) {
    return prisma.natalChart.deleteMany({
      where: { id, userId }
    })
  }
  
  /**
   * Сохраняет интерпретацию карты
   */
  static async saveInterpretation(chartId: string, data: {
    type: string
    content: string
    model: string
    prompt?: string
  }) {
    return prisma.interpretation.upsert({
      where: {
        chartId_type: {
          chartId,
          type: data.type
        }
      },
      update: {
        content: data.content,
        model: data.model,
        prompt: data.prompt
      },
      create: {
        chartId,
        type: data.type,
        content: data.content,
        model: data.model,
        prompt: data.prompt
      }
    })
  }
  
  /**
   * Получает интерпретацию карты
   */
  static async getInterpretation(chartId: string, type: string) {
    return prisma.interpretation.findUnique({
      where: {
        chartId_type: {
          chartId,
          type
        }
      }
    })
  }
}