'use client'

import { useState } from 'react'
import { Calendar, FileText, TrendingUp, Pill, Sparkles, Download, Loader2 } from 'lucide-react'

interface ReportFormProps {
  onComplete?: () => void
}

export default function ReportForm({ onComplete }: ReportFormProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'custom'>('week')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Dados mockados para demonstração
  const reportData = {
    averages: {
      pain: 3.2,
      anxiety: 4.1,
      sleep: 7.3,
      mood: 7.8
    },
    doses: [
      { date: '15/01/2024', type: 'Gotas', amount: '5', time: '08:00' },
      { date: '15/01/2024', type: 'Gotas', amount: '5', time: '14:30' },
      { date: '15/01/2024', type: 'Gotas', amount: '5', time: '22:00' },
      { date: '16/01/2024', type: 'Gotas', amount: '5', time: '08:00' },
      { date: '16/01/2024', type: 'Gotas', amount: '5', time: '14:30' }
    ],
    aiSummary: 'Com base nos dados coletados nos últimos 7 dias, observamos uma tendência positiva no seu tratamento. Seus níveis de dor diminuíram em 35%, indicando uma resposta favorável à medicação. A qualidade do sono melhorou significativamente (25%), o que pode estar contribuindo para a redução da ansiedade (20% de melhora). Recomendamos manter a consistência nas doses e continuar registrando seus check-ins diários para um acompanhamento mais preciso.'
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    // Simula geração do relatório
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    setShowPreview(true)
  }

  const handleDownloadPDF = () => {
    // Aqui seria implementada a lógica real de geração de PDF
    alert('Funcionalidade de download PDF será implementada em breve!')
  }

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
          {/* Seleção de Período */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h3 className="font-bold text-[#445860] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5AAE45]" />
              Período do Relatório
            </h3>

            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setPeriod('week')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  period === 'week'
                    ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold mb-1">Última Semana</div>
                <div className="text-xs text-gray-600">Últimos 7 dias</div>
              </button>

              <button
                onClick={() => setPeriod('month')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  period === 'month'
                    ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold mb-1">Último Mês</div>
                <div className="text-xs text-gray-600">Últimos 30 dias</div>
              </button>

              <button
                onClick={() => setPeriod('custom')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  period === 'custom'
                    ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold mb-1">Personalizado</div>
                <div className="text-xs text-gray-600">Escolha as datas</div>
              </button>
            </div>

            {period === 'custom' && (
              <div className="grid sm:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#5AAE45] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#5AAE45] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botão Gerar Relatório */}
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Gerando seu relatório...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                Gerar Relatório
              </>
            )}
          </button>
        </>
      ) : (
        <>
          {/* Preview do Relatório */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-[#445860] mb-2">
                Relatório de Tratamento MyKana
              </h2>
              <p className="text-gray-600">
                Período: {period === 'week' ? 'Últimos 7 dias' : period === 'month' ? 'Últimos 30 dias' : `${customStartDate} a ${customEndDate}`}
              </p>
            </div>

            {/* Médias dos Indicadores */}
            <div>
              <h3 className="font-bold text-[#445860] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#5AAE45]" />
                Médias dos Indicadores
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <div className="text-sm text-red-700 mb-1">Dor</div>
                  <div className="text-3xl font-bold text-red-600">{reportData.averages.pain}</div>
                  <div className="text-xs text-red-600">/10</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                  <div className="text-sm text-yellow-700 mb-1">Ansiedade</div>
                  <div className="text-3xl font-bold text-yellow-600">{reportData.averages.anxiety}</div>
                  <div className="text-xs text-yellow-600">/10</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Sono</div>
                  <div className="text-3xl font-bold text-blue-600">{reportData.averages.sleep}</div>
                  <div className="text-xs text-blue-600">/10</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">Humor</div>
                  <div className="text-3xl font-bold text-purple-600">{reportData.averages.mood}</div>
                  <div className="text-xs text-purple-600">/10</div>
                </div>
              </div>
            </div>

            {/* Gráfico Simplificado */}
            <div>
              <h3 className="font-bold text-[#445860] mb-4">Evolução dos Indicadores</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Dor</span>
                    <span className="text-sm font-bold text-green-600">↓ 35% melhora</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-green-500" style={{ width: '65%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Ansiedade</span>
                    <span className="text-sm font-bold text-green-600">↓ 20% melhora</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-green-500" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Sono</span>
                    <span className="text-sm font-bold text-green-600">↑ 25% melhora</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-green-500" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de Doses */}
            <div>
              <h3 className="font-bold text-[#445860] mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#5AAE45]" />
                Histórico de Doses
              </h3>
              <div className="space-y-2">
                {reportData.doses.map((dose, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#5AAE45] rounded-full" />
                      <div>
                        <div className="font-medium text-gray-900">{dose.type} - {dose.amount}</div>
                        <div className="text-xs text-gray-600">{dose.date}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">{dose.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo da IA */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Análise Inteligente
              </h3>
              <p className="text-purple-900 leading-relaxed">
                {reportData.aiSummary}
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar PDF
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="bg-white text-[#445860] py-4 rounded-xl font-bold border-2 border-gray-200 hover:border-[#5AAE45] transition-all duration-300"
            >
              Gerar Novo Relatório
            </button>
          </div>
        </>
      )}
    </div>
  )
}
