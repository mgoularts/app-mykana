'use client'

import { useState } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'

interface DoseFormProps {
  onComplete?: () => void
}

export default function DoseForm({ onComplete }: DoseFormProps) {
  const [formData, setFormData] = useState({
    usageForm: '',
    customUsageForm: '',
    quantity: '',
    frequency: '',
    time: new Date().toTimeString().slice(0, 5),
    observation: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const usageForms = [
    'Gotas',
    'ml',
    'mg',
    'Gomas',
    'Pump',
    'Fita',
    'Outro'
  ]

  const frequencies = [
    'Uma vez ao dia',
    'Duas vezes ao dia',
    'Três vezes ao dia',
    'Quatro vezes ao dia',
    'Conforme necessário'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Mostrar feedback por 3 segundos
    setTimeout(() => {
      if (onComplete) onComplete()
      // Reset form
      setFormData({
        usageForm: '',
        customUsageForm: '',
        quantity: '',
        frequency: '',
        time: new Date().toTimeString().slice(0, 5),
        observation: ''
      })
      setIsSuccess(false)
    }, 3000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-[#5AAE45] rounded-full blur-2xl opacity-30 animate-pulse" />
            <CheckCircle2 className="w-24 h-24 text-[#5AAE45] mx-auto relative" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#445860]">
              Dose registrada com sucesso! ✅
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Seu registro foi salvo e está contribuindo para o acompanhamento do seu tratamento.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Forma de Uso */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <label className="text-lg font-bold text-[#445860] block">
          Forma de Uso
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {usageForms.map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => setFormData({ ...formData, usageForm: form, customUsageForm: '' })}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                formData.usageForm === form
                  ? 'bg-[#5AAE45] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {form}
            </button>
          ))}
        </div>

        {formData.usageForm === 'Outro' && (
          <div className="mt-4 animate-in slide-in-from-top duration-300">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Especifique a forma de uso
            </label>
            <input
              type="text"
              value={formData.customUsageForm}
              onChange={(e) => setFormData({ ...formData, customUsageForm: e.target.value })}
              placeholder="Ex: Cápsulas, spray..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none"
              required
            />
          </div>
        )}
      </div>

      {/* Quantidade */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <label className="text-lg font-bold text-[#445860] block">
          Quantidade
        </label>
        <input
          type="text"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="Ex: 5, 10ml, 2 gomas..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none text-lg"
          required
        />
      </div>

      {/* Frequência */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <label className="text-lg font-bold text-[#445860] block">
          Frequência
        </label>
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none text-lg bg-white"
          required
        >
          <option value="">Selecione a frequência</option>
          {frequencies.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>
      </div>

      {/* Horário */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <label className="text-lg font-bold text-[#445860] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#5AAE45]" />
          Horário
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none text-lg"
          required
        />
        <p className="text-sm text-gray-500">
          Horário preenchido automaticamente com a hora atual
        </p>
      </div>

      {/* Observação Opcional */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <label className="text-lg font-bold text-[#445860] block">
          Observação <span className="text-sm font-normal text-gray-500">(opcional)</span>
        </label>
        <textarea
          value={formData.observation}
          onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
          placeholder="Adicione observações sobre esta dose..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Botão de Envio */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.usageForm || !formData.quantity || !formData.frequency}
        className="w-full bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Salvando...
          </span>
        ) : (
          'Salvar Dose'
        )}
      </button>
    </form>
  )
}
