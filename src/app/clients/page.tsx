'use client'

import { createClient, deleteClient, getClients, updateClient } from '@/lib/api/clients'
import { Client, supabase } from '@/lib/supabase'
import { Plus, Users, Edit, Trash2, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingCliente] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  const [formData, setFormData] = useState({
    id: '',
    client_name: '',
    client_phone: ''
  })

  useEffect(() => {
    loadClients();
  }, [])
  // Buscando clientes do Supabase
  const loadClientesSupabase = async () => {
    try {
      const { data } = await supabase
        .from('client')
        .select('*')
      setClients(data || [])
    } catch (error) {
      console.log("Erro ao carregar clientes: ", error)
    }
  }
  // Buscando clientes do banco Postgress
  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  const aplicarMascara = (valor: string) => {
    let numeros = valor.replace(/\D/g, '')

    if (numeros.length > 11) numeros = numeros.slice(0, 11)

    const ddd = numeros.substring(0, 2)
    const parte1 = numeros.substring(2, 7)
    const parte2 = numeros.substring(7, 11)

    if (numeros.length > 6) {
      return `(${ddd}) ${parte1}-${parte2}`
    } else if (numeros.length > 2) {
      return `(${ddd}) ${parte1}`
    } else if (numeros.length > 0) {
      return `(${ddd}`
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingClient) {
        // const { error } = await supabase
        // 	.from('client')
        // 	.update(formData)
        // 	.eq('id', editingClient.id)
        const update = await updateClient(formData)
      } else {
        // const { error } = await supabase
        // 	.from('client')
        // 	.insert([formData])
        // if (error) throw error
        // const create = await createClient(formData)
        // console.log(create);

        const create = toast.promise(
          createClient(formData),
          {
            pending: 'Cadastrando...',
            success: 'Cliente cadastrado!',
            error: {
              render({ data }) {
                return data?.message || 'Erro ao cadastrar cliente';
              },
            },
          }
        )


      }

      setFormData({
        id: '',
        client_name: '',
        client_phone: ''
      })

      setEditingCliente(null)
      setShowForm(false)
      loadClients()
    } catch (error) {
      console.log('Erro ao salvar cliente:', error);
      alert(error)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingCliente(client)
    setFormData({
      id: client.id,
      client_name: client.client_name,
      client_phone: client.client_phone
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        // const { error } = await supabase
        // 	.from('client')
        // 	.delete()
        // 	.eq('id', id)

        // if (error) throw error
        const del = await deleteClient(id);
        loadClients()
      } catch (error) {
        console.error('Erro ao excluir colaborador:', error)
      }
    }
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClient ? 'Editar Cliente' : 'Novo Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Celular
                </label>
                <input
                  type="text"
                  value={formData.client_phone}
                  placeholder="(11) 9XXXX-XXXX"
                  onChange={(e) => setFormData({ ...formData, client_phone: aplicarMascara(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>


              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  {editingClient ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCliente(null)
                    setFormData({
                      id: '',
                      client_name: '',
                      client_phone: '',
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{client.client_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.client_phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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

      {clients.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 text-center ">
          <h3 className="text-gray-500">Nenhum cliente cadastrado</h3>
        </div>
      )}
    </div>
  )
}