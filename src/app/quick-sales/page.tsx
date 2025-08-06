'use client'

import { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Trash2, Save, X } from 'lucide-react'
import { getServices, Service } from '@/lib/api/services'
import { getInventory, Inventory } from '@/lib/api/inventory'
import { getClients, Client } from '@/lib/api/clients'
import { getCollaborators, Collaborator } from '@/lib/api/collaborators'
import { toast } from 'react-toastify'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Permission } from '@/contexts/AuthContext'
import { PropagateLoader } from 'react-spinners'

interface SaleItem {
  id: string
  type: 'service' | 'product' | 'custom'
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
  serviceId?: string
  inventoryId?: string
}

interface SaleForm {
  clientId: string
  collaboratorId: string
  items: SaleItem[]
  subtotal: number
  discount: number
  total: number
  paymentMethod: string
  notes: string
}

export default function QuickSalesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saleForm, setSaleForm] = useState<SaleForm>({
    clientId: '',
    collaboratorId: '',
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    paymentMethod: 'dinheiro',
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [servicesData, inventoryData, clientsData, collaboratorsData] = await Promise.all([
        getServices(),
        getInventory(),
        getClients(),
        getCollaborators()
      ])
      setServices(servicesData)
      setInventory(inventoryData)
      setClients(clientsData)
      setCollaborators(collaboratorsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addService = (service: Service) => {
    const existingItem = saleForm.items.find(item => item.serviceId === service.id)

    if (existingItem) {
      updateItemQuantity(existingItem.id, existingItem.quantity + 1)
    } else {
      const newItem: SaleItem = {
        id: `service-${Date.now()}`,
        type: 'service',
        name: service.name,
        quantity: 1,
        unitPrice: service.price,
        totalPrice: service.price,
        serviceId: service.id
      }

      const newItems = [...saleForm.items, newItem]
      updateSaleForm(newItems)
    }
  }

  const addProduct = (product: Inventory) => {
    const existingItem = saleForm.items.find(item => item.inventoryId === product.id)

    if (existingItem) {
      updateItemQuantity(existingItem.id, existingItem.quantity + 1)
    } else {
      const newItem: SaleItem = {
        id: `product-${Date.now()}`,
        type: 'product',
        name: product.product_name,
        quantity: 1,
        unitPrice: product.unit_price,
        totalPrice: product.unit_price,
        inventoryId: product.id
      }

      const newItems = [...saleForm.items, newItem]
      updateSaleForm(newItems)
    }
  }

  const addCustomItem = () => {
    const customName = prompt('Nome do item personalizado:')
    const customPrice = prompt('Preço do item:')

    if (customName && customPrice) {
      const newItem: SaleItem = {
        id: `custom-${Date.now()}`,
        type: 'custom',
        name: customName,
        quantity: 1,
        unitPrice: parseFloat(customPrice),
        totalPrice: parseFloat(customPrice)
      }

      const newItems = [...saleForm.items, newItem]
      updateSaleForm(newItems)
    }
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    const newItems = saleForm.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity
        }
      }
      return item
    })
    updateSaleForm(newItems)
  }

  const removeItem = (itemId: string) => {
    const newItems = saleForm.items.filter(item => item.id !== itemId)
    updateSaleForm(newItems)
  }

  const updateSaleForm = (items: SaleItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const total = subtotal - saleForm.discount

    setSaleForm(prev => ({
      ...prev,
      items,
      subtotal,
      total
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!saleForm.clientId || !saleForm.collaboratorId || saleForm.items.length === 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      // Aqui você implementaria a chamada para a API de vendas
      toast.success('Venda realizada com sucesso!')
      setShowForm(false)
      setSaleForm({
        clientId: '',
        collaboratorId: '',
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        paymentMethod: 'dinheiro',
        notes: ''
      })
    } catch (error) {
      toast.error('Erro ao realizar venda')
    }
  }

  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_APPOINTMENTS}>
      {isLoading && 
        <div className="text-center text-pink-600 fixed inset-0 bg-white z-50 flex items-center justify-center">
          <PropagateLoader
            color='pink'
          />
        </div>
      }

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vendas Rápidas</h1>
          {/* <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Venda
          </button> */}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-full'>
          <div className='text-black w-1/2'>
            {/* Adicionar Itens */}
            <div className="">
              {/* Serviços */}
              <div>
                <h4 className="font-medium mb-2">Serviços</h4>
                <div className="space-y-1 overflow-y-auto">
                  {services.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => addService(service)}
                      className="w-25 h-25 m-1 p-2 hover:bg-gray-100 rounded-md text-sm bg-white border-pink-600 flex-col border justify-center items-center "
                    >
                      <p>{service.name}</p>
                      <p>R$ {service.price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Produtos */}
              <div>
                <h4 className="font-medium mb-2 mt-5">Produtos</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {inventory.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-25 h-25 m-1 p-2 gap-1 hover:bg-gray-100 rounded-md text-sm bg-white border-pink-600 flex-col border justify-center items-center "
                    >
                      <p>{product.product_name}</p>
                      <p>R$ {product.unit_price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className=" w-1/2 bg-white p-6 rounded-lg w-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Nova Venda</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    value={saleForm.clientId}
                    onChange={(e) => setSaleForm({ ...saleForm, clientId: e.target.value })}
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
                    Colaborador
                  </label>
                  <select
                    value={saleForm.collaboratorId}
                    onChange={(e) => setSaleForm({ ...saleForm, collaboratorId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Selecione um colaborador</option>
                    {collaborators.map(collaborator => (
                      <option key={collaborator.id} value={collaborator.id}>
                        {collaborator.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Itens da Venda */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-semibold">Itens da Venda</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addCustomItem}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Item Personalizado
                    </button>
                  </div>
                </div>

                {/* Lista de Itens */}
                <div className="space-y-2 mb-4">
                  {saleForm.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-black font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          R$ {item.unitPrice.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <span className="text-black font-medium">R$ {item.totalPrice.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>


              </div>

              {/* Resumo da Venda */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-black flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>R$ {saleForm.subtotal.toFixed(2)}</span>
                </div>
                <div className=" flex justify-between mb-2">
                  <span className='text-black'>Desconto:</span>
                  <input
                    type="number"
                    min="0"
                    max={saleForm.subtotal}
                    value={saleForm.discount}
                    onChange={(e) => setSaleForm({
                      ...saleForm,
                      discount: parseFloat(e.target.value) || 0,
                      total: saleForm.subtotal - (parseFloat(e.target.value) || 0)
                    })}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-black"
                  />
                </div>
                <div className="flex justify-between font-bold text-lg border-t -600 pt-2 ">
                  <span className='text-black'>Total:</span>
                  <span className='text-black'>R$ {saleForm.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Método de Pagamento e Observações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    value={saleForm.paymentMethod}
                    onChange={(e) => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={saleForm.notes}
                    onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Finalizar Venda
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>

    </ProtectedRoute>
  )
} 