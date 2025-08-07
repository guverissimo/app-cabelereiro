import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, UserRole, Permission } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existem usuários
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: 'Usuários já foram criados anteriormente' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash('123456', 10)

    // Criar usuários com diferentes roles
    const users = [
      {
        name: 'Proprietário',
        email: 'owner@salon.com',
        password: hashedPassword,
        role: UserRole.OWNER,
        permissions: [
          Permission.VIEW_OWN_DATA,
          Permission.VIEW_ALL_DATA,
          Permission.MANAGE_COLLABORATORS,
          Permission.MANAGE_SERVICES,
          Permission.MANAGE_APPOINTMENTS,
          Permission.MANAGE_INVENTORY,
          Permission.VIEW_REPORTS,
          Permission.MANAGE_FINANCIAL,
          Permission.MANAGE_SUBSCRIPTIONS,
          Permission.MANAGE_GIFT_CARDS
        ]
      },
      {
        name: 'Administrador',
        email: 'admin@salon.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        permissions: [
          Permission.VIEW_OWN_DATA,
          Permission.VIEW_ALL_DATA,
          Permission.MANAGE_COLLABORATORS,
          Permission.MANAGE_SERVICES,
          Permission.MANAGE_APPOINTMENTS,
          Permission.MANAGE_INVENTORY,
          Permission.MANAGE_SUBSCRIPTIONS,
          Permission.MANAGE_GIFT_CARDS
        ]
      },
      {
        name: 'Colaborador',
        email: 'collaborator@salon.com',
        password: hashedPassword,
        role: UserRole.COLLABORATOR,
        permissions: [
          Permission.VIEW_OWN_DATA,
          Permission.MANAGE_APPOINTMENTS
        ]
      }
    ]

    const createdUsers = []

    for (const userData of users) {
      const { permissions, ...userInfo } = userData
      
      const user = await prisma.user.create({
        data: userInfo
      })

      // Criar permissões para o usuário
      for (const permission of permissions) {
        await prisma.userPermission.create({
          data: {
            user_id: user.id,
            permission: permission,
            granted_by: user.id // O próprio usuário se concede as permissões iniciais
          }
        })
      }

      createdUsers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: permissions
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Usuários criados com sucesso',
      users: createdUsers
    })

  } catch (error) {
    console.error('Erro ao criar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
