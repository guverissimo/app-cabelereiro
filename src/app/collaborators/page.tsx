'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Edit, Trash2, Mail, User } from 'lucide-react'
import { createCollaborator, getCollaborators, updateCollaborator, deleteCollaborator, Collaborator } from '@/lib/api/collaborators'
import { toast } from 'react-toastify'

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: ''
  })

  useEffect(() => {
    handleGetCollaborators()
  }, [])

  const handleGetCollaborators = async () => {
    try {
      const data = await toast.promise(
        getCollaborators(),
        {
          pending: 'Buscando colaboradores...',
          success: 'Colaboradores carregados!',
          error: {
            render({ data }: { data: any }) {
              return data?.message || 'Erro ao buscar colaboradores';
            },
          },
        }
      );
      setCollaborators(data);
    } catch (err) {
      console.error('Erro técnico:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCollaborator) {
        await toast.promise(
          updateCollaborator(editingCollaborator.id, formData),
          {
            pending: 'Atualizando...',
            success: 'Colaborador atualizado!',
            error: {
              render({ data }: { data: any }) {
                return data?.message || 'Erro ao atualizar colaborador';
              },
            },
          }
        );
      } else {
        await toast.promise(
          createCollaborator(formData),
          {
            pending: 'Cadastrando...',
            success: 'Colaborador cadastrado!',
            error: {
              render({ data }: { data: any }) {
                return data?.message || 'Erro ao cadastrar colaborador';
              },
            },
          }
        );
      }

      setFormData({
        name: '',
        role: '',
        email: ''
      })
      setEditingCollaborator(null)
      setShowForm(false)
      handleGetCollaborators()
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error)
    }
  }

  const handleEdit = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator)
    setFormData({
      name: collaborator.name,
      role: collaborator.role,
      email: collaborator.email
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await toast.promise(
          deleteCollaborator(id),
          {
            pending: 'Excluindo...',
            success: 'Colaborador excluído!',
            error: {
              render({ data }: { data: any }) {
                return data?.message || 'Erro ao excluir colaborador';
              },
            },
          }
        );
        handleGetCollaborators()
      } catch (error) {
        console.error('Erro ao excluir colaborador:', error)
      }
    }
  }

  const getRoles = () => {
    const roles = new Set(collaborators.map(collab => collab.role))
    return Array.from(roles).filter(Boolean)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Colaboradores</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Colaborador
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Colaboradores</p>
              <p className="text-2xl font-bold text-gray-900">{collaborators.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Funções Diferentes</p>
              <p className="text-2xl font-bold text-gray-900">{getRoles().length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de colaborador */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Função
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  {editingCollaborator ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCollaborator(null)
                    setFormData({
                      name: '',
                      role: '',
                      email: ''
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

      {/* Lista de colaboradores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collaborators.map((collaborator) => (
                <tr key={collaborator.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{collaborator.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {collaborator.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {collaborator.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(collaborator.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(collaborator)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(collaborator.id)}
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

      {/* Dados fictícios pré-carregados */}
      {collaborators.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Dados de Exemplo</h3>
          <p className="text-blue-700 mb-4">
            Para testar o sistema, você pode inserir os seguintes colaboradores:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-medium text-blue-800">Bruna Souza</p>
              <p className="text-sm text-blue-600">Cabeleireira</p>
              <p className="text-sm text-blue-600">bruna@salon.com</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-medium text-blue-800">Carlos Lima</p>
              <p className="text-sm text-blue-600">Manicure</p>
              <p className="text-sm text-blue-600">carlos@salon.com</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-medium text-blue-800">Juliana Freitas</p>
              <p className="text-sm text-blue-600">Esteticista</p>
              <p className="text-sm text-blue-600">juliana@salon.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 