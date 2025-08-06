'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Gift, DollarSign, Calendar, Users } from 'lucide-react'
import { getClients, Client } from '@/lib/api/clients'
import { toast } from 'react-toastify'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Permission } from '@/contexts/AuthContext'

interface GiftCard {
  id: string
  client_id: string
  code: string
  amount: number
  balance: number
  expires_at: string | null
  is_active: boolean
  created_at: string
  client: Client
}

interface GiftCardForm {
  client_id: string
  code: string
  amount: number
  expires_at: string
}

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCard | null>(null)
  const [formData, setFormData] = useState<GiftCardForm>({
    client_id: '',
    code: '',
    amount: 0,
    expires_at: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const clientsData = await getClients()
      setClients(clientsData)
      
      // Simular dados de gift cards
      const mockGiftCards: GiftCard[] = [
        {
          id: '1',
          client_id: '1',
          code: 'GIFT001',
          amount: 100.00,
          balance: 75.50,
          expires_at: '2024-12-31',
          is_active: true,
          created_at: '2024-01-01',
          client: { id: '1', client_name: 'Maria Silva', client_phone: '11999999999' }
        },
        {
          id: '2',
          client_id: '2',
          code: 'GIFT002',
          amount: 200.00,
          balance: 200.00,
          expires_at: '2024-12-31',
          is_active: true,
          created_at: '2024-01-15',
          client: { id: '2', client_name: 'João Santos', client_phone: '11888888888' }
        }
      ]
      setGiftCards(mockGiftCards)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'GIFT'
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.client_id || !formData.code || formData.amount <= 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      // Aqui você implementaria a chamada para a API
      toast.success(editingGiftCard ? 'Gift Card atualizado!' : 'Gift Card criado!')
      setShowForm(false)
      setEditingGiftCard(null)
      setFormData({
        client_id: '',
        code: '',
        amount: 0,
        expires_at: ''
      })
      loadData()
    } catch (error) {
      toast.error('Erro ao salvar gift card')
    }
  }

  const handleEdit = (giftCard: GiftCard) => {
    setEditingGiftCard(giftCard)
    setFormData({
      client_id: giftCard.client_id,
      code: giftCard.code,
      amount: giftCard.amount,
      expires_at: giftCard.expires_at || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gift card?')) {
      try {
        // Aqui você implementaria a chamada para a API
        toast.success('Gift Card excluído!')
        loadData()
      } catch (error) {
        toast.error('Erro ao excluir gift card')
      }
    }
  }

  const getActiveGiftCards = () => giftCards.filter(gc => gc.is_active)
  const getTotalValue = () => giftCards.reduce((sum, gc) => sum + gc.balance, 0)
  const getUsedValue = () => giftCards.reduce((sum, gc) => sum + (gc.amount - gc.balance), 0)

  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_GIFT_CARDS}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gift Cards</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo Gift Card
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Gift Cards</p>
                <p className="text-2xl font-bold text-gray-900">{giftCards.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gift Cards Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{getActiveGiftCards().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Disponível</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {getTotalValue().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Utilizado</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {getUsedValue().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingGiftCard ? 'Editar Gift Card' : 'Novo Gift Card'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, code: generateCode()})}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Gerar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Expiração (Opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    {editingGiftCard ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingGiftCard(null)
                      setFormData({
                        client_id: '',
                        code: '',
                        amount: 0,
                        expires_at: ''
                      })
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Gift Cards */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Original
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Disponível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {giftCards.map((giftCard) => (
                  <tr key={giftCard.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{giftCard.client.client_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {giftCard.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {giftCard.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="font-medium">R$ {giftCard.balance.toFixed(2)}</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(giftCard.balance / giftCard.amount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        giftCard.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {giftCard.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {giftCard.expires_at 
                          ? new Date(giftCard.expires_at).toLocaleDateString('pt-BR')
                          : 'Sem expiração'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(giftCard)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(giftCard.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 