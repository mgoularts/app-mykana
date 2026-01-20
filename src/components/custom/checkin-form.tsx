'use client'

import { useState } from 'react'
import { CheckCircle2, Sparkles, FileText } from 'lucide-react'

interface CheckinFormProps {
  onComplete?: () => void
}

export default function CheckinForm({ onComplete }: CheckinFormProps) {
  const [formData, setFormData] = useState({
    pain: 5,
    anxiety: 5,
    sleep: 5,
    mood: 5,
    sideEffects: false,
    sideEffectsDetails: '',
    observations: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envio (incluindo observações)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Mostrar feedback por 3 segundos
    setTimeout(() => {
      if (onComplete) onComplete()
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
              Mais um dia registrado! 🎉
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Seu progresso está sendo construído.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[#5AAE45]">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">Continue assim!</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dor */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-bold text-[#445860]">
            Nível de Dor
          </label>
          <span className="text-3xl font-bold text-red-600">{formData.pain}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={formData.pain}
          onChange={(e) => setFormData({ ...formData, pain: parseInt(e.target.value) })}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-red-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 - Sem dor</span>
          <span>10 - Dor máxima</span>
        </div>
      </div>

      {/* Ansiedade */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-bold text-[#445860]">
            Nível de Ansiedade
          </label>
          <span className="text-3xl font-bold text-yellow-600">{formData.anxiety}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={formData.anxiety}
          onChange={(e) => setFormData({ ...formData, anxiety: parseInt(e.target.value) })}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 - Muito calmo</span>
          <span>10 - Muito ansioso</span>
        </div>
      </div>

      {/* Qualidade do Sono */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-bold text-[#445860]">
            Qualidade do Sono
          </label>
          <span className="text-3xl font-bold text-blue-600">{formData.sleep}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={formData.sleep}
          onChange={(e) => setFormData({ ...formData, sleep: parseInt(e.target.value) })}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 - Péssimo</span>
          <span>10 - Excelente</span>
        </div>
      </div>

      {/* Humor */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-bold text-[#445860]">
            Como está seu Humor?
          </label>
          <span className="text-3xl font-bold text-purple-600">{formData.mood}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 - Muito mal</span>
          <span>10 - Muito bem</span>
        </div>
      </div>

      {/* Efeitos Colaterais */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
        <label className="text-lg font-bold text-[#445860] block mb-4">
          Teve algum efeito colateral?
        </label>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, sideEffects: false, sideEffectsDetails: '' })}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 ${
              !formData.sideEffects
                ? 'bg-[#5AAE45] text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Não
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, sideEffects: true })}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 ${
              formData.sideEffects
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sim
          </button>
        </div>

        {formData.sideEffects && (
          <div className="mt-4 animate-in slide-in-from-top duration-300">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Quais efeitos você sentiu?
            </label>
            <textarea
              value={formData.sideEffectsDetails}
              onChange={(e) => setFormData({ ...formData, sideEffectsDetails: e.target.value })}
              placeholder="Descreva os efeitos colaterais..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none resize-none"
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Campo de Observações (Opcional) - POSICIONADO AQUI */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Observações (Opcional)
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Registre sensações, acontecimentos, reações ou qualquer informação relevante sobre o seu dia
        </p>
        <textarea
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          placeholder="Ex: Hoje me senti mais disposto pela manhã, mas tive um pouco de dor de cabeça à tarde..."
          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
          rows={5}
        />
        <p className="text-xs text-blue-600 mt-2">
          Essas observações ajudam no acompanhamento do seu tratamento
        </p>
      </div>

      {/* Botão Único de Concluir Check-in */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6" />
            Concluir Check-in
          </>
        )}
      </button>
    </form>
  )
}
