'use client'

import { useState } from 'react'
import { Pill, Package, Calendar, Link as LinkIcon, CheckCircle2 } from 'lucide-react'

interface MedicationFormProps {
  onComplete?: () => void
}

export default function MedicationForm({ onComplete }: MedicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: '',
    mlPerUnit: '',
    expiryDate: '',
    contact: ''
  })
  
  const [showSuccess, setShowSuccess] = useState(false)

  const totalAvailable = formData.quantity && formData.mlPerUnit 
    ? Number(formData.quantity) * Number(formData.mlPerUnit)
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simular salvamento
    console.log('Dados do medicamento:', formData)
    
    // Mostrar feedback de sucesso
    setShowSuccess(true)
    
    // Resetar formulário após 2 segundos
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        name: '',
        brand: '',
        quantity: '',
        mlPerUnit: '',
        expiryDate: '',
        contact: ''
      })
      if (onComplete) {
        onComplete()
      }
    }, 2000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gradient-to-br from-[#5AAE45] to-[#4a9d38] rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#445860] mb-3">
          Informações Registradas! ✅
        </h3>
        <p className="text-gray-600 text-lg">
          Informações do medicamento registradas com sucesso.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do Medicamento */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Pill className="w-4 h-4 text-[#5AAE45]" />
            Nome do Medicamento
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Canabidiol"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
          />
        </div>

        {/* Marca */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Package className="w-4 h-4 text-[#5AAE45]" />
            Marca
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Ex: MyKana Premium"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
          />
        </div>

        {/* Grid para Quantidade e ML */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Quantidade de Frascos/Potes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Quantidade de Frascos/Potes
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="Ex: 2"
              min="0"
              step="1"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
            />
          </div>

          {/* Quantidade de ml/Gomas por Produto */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              ml/Gomas por Produto
            </label>
            <input
              type="number"
              value={formData.mlPerUnit}
              onChange={(e) => handleChange('mlPerUnit', e.target.value)}
              placeholder="Ex: 30"
              min="0"
              step="0.1"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Cálculo da Quantidade Disponível */}
        {totalAvailable > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-sm text-blue-700 font-semibold mb-1">
              Quantidade Total Disponível
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-900">
                {totalAvailable.toFixed(1)}
              </span>
              <span className="text-blue-600">ml/gomas</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {formData.quantity} × {formData.mlPerUnit} = {totalAvailable.toFixed(1)}
            </p>
          </div>
        )}

        {/* Validade */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-[#5AAE45]" />
            Validade
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
          />
        </div>

        {/* Contato ou Link da Empresa */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <LinkIcon className="w-4 h-4 text-[#5AAE45]" />
            Contato ou Link da Empresa (Opcional)
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="Ex: www.empresa.com.br ou (11) 99999-9999"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
          />
        </div>

        {/* Botão de Salvar */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Salvar Informações do Medicamento
        </button>
      </form>
    </div>
  )
}
