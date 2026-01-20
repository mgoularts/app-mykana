'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  Home as HomeIcon,
  ClipboardList,
  Pill,
  FileText,
  User,
  Plus,
  Activity,
  Moon,
  Frown,
  Smile,
  DollarSign,
  Package,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Edit,
  Trash2,
  AlertCircle,
  Save,
  X,
  Bell,
  BellRing,
  Send
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CheckinForm from '@/components/custom/checkin-form'

type TabType = 'home' | 'checkin' | 'relatorio' | 'medicamento'

interface Medication {
  id: string
  nome: string
  marca: string
  quantidadeFrascos: number
  quantidadePorProduto: number
  unidadeMedida: string
  validade: string
  frequenciaDiaria: number
  horarios: string[]
  valorPago: number
  contatoEmpresa?: {
    site?: string
    telefone?: string
    nomeReferencia?: string
  }
  dosePorUso: number
  estoqueDisponivel: number
  custoDiario: number
  custoTotal: number
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  
  // Estados para medicamentos
  const [medications, setMedications] = useState<Medication[]>([])
  const [isAddingMedication, setIsAddingMedication] = useState(false)
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null)
  
  // Configuração de doses diárias baseada no medicamento cadastrado
  const activeMedication = medications.length > 0 ? medications[0] : null
  const dailyDosesConfig = activeMedication?.frequenciaDiaria || 2
  const [todayDosesCompleted, setTodayDosesCompleted] = useState(0)
  
  // Estado para observações do check-in
  const [checkInObservations, setCheckInObservations] = useState('')
  
  // Estado para sugestões
  const [suggestion, setSuggestion] = useState('')
  
  // Estado para notificações
  const [hasNotification, setHasNotification] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Verificar se há dose programada para agora
  useEffect(() => {
    const checkNotifications = () => {
      if (!activeMedication) {
        setHasNotification(false)
        return
      }

      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      
      // Verificar se algum horário programado está próximo (dentro de 15 minutos)
      const hasScheduledDose = activeMedication.horarios.some(horario => {
        const [hour, minute] = horario.split(':').map(Number)
        const scheduledTime = new Date()
        scheduledTime.setHours(hour, minute, 0, 0)
        
        const diffMinutes = Math.abs((scheduledTime.getTime() - now.getTime()) / 60000)
        return diffMinutes <= 15
      })
      
      setHasNotification(hasScheduledDose)
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 60000) // Verificar a cada minuto

    return () => clearInterval(interval)
  }, [activeMedication])
  
  // Calcular porcentagem do dia
  const todayPercentage = (todayDosesCompleted / dailyDosesConfig) * 100
  const isDayComplete = todayDosesCompleted >= dailyDosesConfig
  
  // Dados mockados para demonstração
  const [lastDose] = useState({
    time: '14:30',
    amount: '5 gotas',
    date: 'Hoje'
  })
  
  const [nextDose] = useState({
    time: '22:00',
    date: 'Hoje'
  })
  
  const [checkInStatus] = useState<'done' | 'pending'>('done')
  
  const [indicators] = useState({
    pain: { current: 3, yesterday: 5, trend: 'down' as const },
    anxiety: { current: 4, yesterday: 4, trend: 'stable' as const },
    sleep: { current: 7, yesterday: 6, trend: 'up' as const }
  })
  
  // Sequência de constância com porcentagem
  const [weekStreak, setWeekStreak] = useState([
    { day: 'S', completed: true, percentage: 100 },
    { day: 'T', completed: true, percentage: 100 },
    { day: 'Q', completed: true, percentage: 100 },
    { day: 'Q', completed: true, percentage: 100 },
    { day: 'S', completed: true, percentage: 100 },
    { day: 'S', completed: false, percentage: todayPercentage }, // Hoje
    { day: 'D', completed: false, percentage: 0 }
  ])
  
  const [streakCount] = useState(5)

  // Função para registrar dose realizada
  const handleDoseCompleted = () => {
    if (todayDosesCompleted < dailyDosesConfig) {
      const newCount = todayDosesCompleted + 1
      setTodayDosesCompleted(newCount)
      
      // Atualizar porcentagem do dia atual na sequência
      const newPercentage = (newCount / dailyDosesConfig) * 100
      setWeekStreak(prev => {
        const updated = [...prev]
        updated[5] = { 
          ...updated[5], 
          percentage: newPercentage,
          completed: newCount >= dailyDosesConfig
        }
        return updated
      })
    }
  }

  // Função para enviar sugestão
  const handleSendSuggestion = () => {
    if (suggestion.trim()) {
      // Aqui você implementaria o envio real para o administrador
      alert('Sugestão enviada com sucesso! Obrigado pelo seu feedback. 💚')
      setSuggestion('')
    }
  }

  // Estados para o calendário de relatórios
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showReport, setShowReport] = useState(false)
  
  // Estado para modal de confirmação de exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean
    medicationId: string | null
    medicationName: string
  }>({
    show: false,
    medicationId: null,
    medicationName: ''
  })
  
  // Formulário de medicamento
  const [medicationForm, setMedicationForm] = useState({
    nome: '',
    marca: '',
    quantidadeFrascos: '',
    quantidadePorProduto: '',
    unidadeMedida: 'ml',
    validade: '',
    frequenciaDiaria: '',
    horarios: [] as string[],
    valorPago: '',
    dosePorUso: '',
    contatoEmpresa: {
      site: '',
      telefone: '',
      nomeReferencia: ''
    }
  })

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => isSameDay(d, date))
  }

  const handleDateClick = (date: Date) => {
    if (isDateSelected(date)) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleDateMouseDown = (date: Date) => {
    setIsDragging(true)
    if (!isDateSelected(date)) {
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleDateMouseEnter = (date: Date) => {
    if (isDragging && !isDateSelected(date)) {
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const selectWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    setSelectedDates(weekDates)
  }

  const selectTwoWeeks = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    
    const weekDates = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    setSelectedDates(weekDates)
  }

  const selectMonth = () => {
    const { daysInMonth } = getDaysInMonth(currentMonth)
    const monthDates = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      monthDates.push(date)
    }
    setSelectedDates(monthDates)
  }

  const clearSelection = () => {
    setSelectedDates([])
    setShowReport(false)
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  // Dados mockados para o relatório
  const reportData = {
    frequenciaUso: '85%',
    diasRegistrados: selectedDates.length,
    diasCorretos: Math.floor(selectedDates.length * 0.9),
    humorMedio: 7.2,
    tendenciaHumor: 'Positiva',
    principaisSintomas: ['Ansiedade leve', 'Dor nas costas', 'Insônia ocasional'],
    sequenciaDoses: '18/21 doses',
    checkInsRealizados: Math.floor(selectedDates.length * 0.85),
    observacoes: 3,
    evolucaoData: [
      { dia: 'Seg', humor: 6, sintomas: 3 },
      { dia: 'Ter', humor: 7, sintomas: 2 },
      { dia: 'Qua', humor: 7.5, sintomas: 2 },
      { dia: 'Qui', humor: 8, sintomas: 1 },
      { dia: 'Sex', humor: 7, sintomas: 2 },
      { dia: 'Sáb', humor: 8.5, sintomas: 1 },
      { dia: 'Dom', humor: 7.5, sintomas: 1 }
    ]
  }

  // Funções para medicamentos
  const handleFrequenciaChange = (freq: string) => {
    const frequencia = parseInt(freq) || 0
    const horarios = Array(frequencia).fill('')
    setMedicationForm(prev => ({
      ...prev,
      frequenciaDiaria: freq,
      horarios
    }))
  }

  const handleHorarioChange = (index: number, value: string) => {
    const newHorarios = [...medicationForm.horarios]
    newHorarios[index] = value
    setMedicationForm(prev => ({
      ...prev,
      horarios: newHorarios
    }))
  }

  const calculateMedicationData = () => {
    const quantidadeFrascos = parseFloat(medicationForm.quantidadeFrascos) || 0
    const quantidadePorProduto = parseFloat(medicationForm.quantidadePorProduto) || 0
    const frequenciaDiaria = parseFloat(medicationForm.frequenciaDiaria) || 0
    const valorPago = parseFloat(medicationForm.valorPago) || 0
    const dosePorUso = parseFloat(medicationForm.dosePorUso) || 0

    const quantidadeTotal = quantidadeFrascos * quantidadePorProduto
    const doseTotal = frequenciaDiaria * dosePorUso
    const estoqueDisponivel = quantidadeTotal
    const custoDiario = (valorPago / quantidadeTotal) * doseTotal
    const custoTotal = valorPago

    return {
      estoqueDisponivel,
      custoDiario,
      custoTotal,
      dosePorUso
    }
  }

  const handleSaveMedication = () => {
    // Validação
    if (!medicationForm.nome || !medicationForm.marca || !medicationForm.quantidadeFrascos || 
        !medicationForm.quantidadePorProduto || !medicationForm.validade || 
        !medicationForm.frequenciaDiaria || !medicationForm.valorPago || !medicationForm.dosePorUso) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    // Validação dos horários
    const horariosPreenchidos = medicationForm.horarios.filter(h => h !== '').length
    if (horariosPreenchidos !== medicationForm.horarios.length) {
      alert('Por favor, preencha todos os horários de uso')
      return
    }

    const calculatedData = calculateMedicationData()
    
    const newMedication: Medication = {
      id: editingMedicationId || Date.now().toString(),
      nome: medicationForm.nome,
      marca: medicationForm.marca,
      quantidadeFrascos: parseFloat(medicationForm.quantidadeFrascos),
      quantidadePorProduto: parseFloat(medicationForm.quantidadePorProduto),
      unidadeMedida: medicationForm.unidadeMedida,
      validade: medicationForm.validade,
      frequenciaDiaria: parseFloat(medicationForm.frequenciaDiaria),
      horarios: medicationForm.horarios,
      valorPago: parseFloat(medicationForm.valorPago),
      dosePorUso: calculatedData.dosePorUso,
      estoqueDisponivel: calculatedData.estoqueDisponivel,
      custoDiario: calculatedData.custoDiario,
      custoTotal: calculatedData.custoTotal,
      contatoEmpresa: medicationForm.contatoEmpresa.site || medicationForm.contatoEmpresa.telefone || medicationForm.contatoEmpresa.nomeReferencia
        ? medicationForm.contatoEmpresa
        : undefined
    }

    if (editingMedicationId) {
      setMedications(prev => prev.map(med => med.id === editingMedicationId ? newMedication : med))
      alert('Medicamento atualizado com sucesso! ✅')
    } else {
      setMedications(prev => [...prev, newMedication])
      alert('Medicamento salvo com sucesso! ✅')
    }

    // Reset form
    setMedicationForm({
      nome: '',
      marca: '',
      quantidadeFrascos: '',
      quantidadePorProduto: '',
      unidadeMedida: 'ml',
      validade: '',
      frequenciaDiaria: '',
      horarios: [],
      valorPago: '',
      dosePorUso: '',
      contatoEmpresa: {
        site: '',
        telefone: '',
        nomeReferencia: ''
      }
    })
    setIsAddingMedication(false)
    setEditingMedicationId(null)

    // Scroll suave para a seção de medicamentos salvos
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const handleEditMedication = (medication: Medication) => {
    setMedicationForm({
      nome: medication.nome,
      marca: medication.marca,
      quantidadeFrascos: medication.quantidadeFrascos.toString(),
      quantidadePorProduto: medication.quantidadePorProduto.toString(),
      unidadeMedida: medication.unidadeMedida,
      validade: medication.validade,
      frequenciaDiaria: medication.frequenciaDiaria.toString(),
      horarios: medication.horarios,
      valorPago: medication.valorPago.toString(),
      dosePorUso: medication.dosePorUso.toString(),
      contatoEmpresa: medication.contatoEmpresa || {
        site: '',
        telefone: '',
        nomeReferencia: ''
      }
    })
    setEditingMedicationId(medication.id)
    setIsAddingMedication(true)
  }

  const handleDeleteMedication = (id: string) => {
    const medication = medications.find(med => med.id === id)
    if (medication) {
      setDeleteConfirmation({
        show: true,
        medicationId: id,
        medicationName: medication.nome
      })
    }
  }

  const confirmDeleteMedication = () => {
    if (deleteConfirmation.medicationId) {
      setMedications(prev => prev.filter(med => med.id !== deleteConfirmation.medicationId))
      setDeleteConfirmation({
        show: false,
        medicationId: null,
        medicationName: ''
      })
    }
  }

  const cancelDeleteMedication = () => {
    setDeleteConfirmation({
      show: false,
      medicationId: null,
      medicationName: ''
    })
  }

  const handleCancelMedication = () => {
    setMedicationForm({
      nome: '',
      marca: '',
      quantidadeFrascos: '',
      quantidadePorProduto: '',
      unidadeMedida: 'ml',
      validade: '',
      frequenciaDiaria: '',
      horarios: [],
      valorPago: '',
      dosePorUso: '',
      contatoEmpresa: {
        site: '',
        telefone: '',
        nomeReferencia: ''
      }
    })
    setIsAddingMedication(false)
    setEditingMedicationId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200 py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="text-slate-600 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Sino de Notificação */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 bg-transparent rounded-full flex items-center justify-center hover:bg-slate-100 transition-all duration-300"
            >
              {hasNotification ? (
                <>
                  <BellRing className="w-5 h-5 text-green-600 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                </>
              ) : (
                <Bell className="w-5 h-5 text-green-600" />
              )}
            </button>
            
            {/* Perfil do Usuário */}
            <Link href="/profile">
              <button className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <User className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de Notificações */}
      {showNotifications && (
        <div className="fixed top-16 right-4 w-80 bg-white rounded-2xl border-2 border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top duration-300">
          <div className="p-4 border-b-2 border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              Notificações
            </h3>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            {hasNotification ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Hora da dose!</p>
                      <p className="text-sm text-green-700">
                        Está na hora de tomar seu medicamento
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Agora
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">
                  Você não possui notificações
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-red-500 p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Confirmar Exclusão</h3>
                <p className="text-sm text-slate-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-slate-700">
                Tem certeza que deseja excluir o medicamento{' '}
                <span className="font-bold text-red-700">{deleteConfirmation.medicationName}</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDeleteMedication}
                className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Não
              </button>
              <button
                onClick={confirmDeleteMedication}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tab Home */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Saudação */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-2">
                  Olá, João! 👋
                </h1>
                <p className="text-slate-600">
                  Aqui está seu resumo de hoje
                </p>
              </div>

              {/* Sequência de Constância com Botão Registrar Dose */}
              <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-teal-600" />
                      Sequência de Constância
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">Continue assim! 🔥</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-teal-600">{streakCount}</div>
                    <div className="text-sm text-slate-600">dias seguidos</div>
                  </div>
                </div>

                {/* Calendário Semanal com Porcentagem */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {weekStreak.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-slate-500 mb-2 font-medium">{day.day}</div>
                      <div className="relative">
                        {/* Círculo de progresso */}
                        <div className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                          day.completed 
                            ? 'bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg scale-105' 
                            : 'bg-slate-100 border-2 border-slate-200'
                        }`}>
                          {/* Barra de progresso para dias incompletos */}
                          {!day.completed && day.percentage > 0 && (
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-400 to-cyan-500 transition-all duration-500"
                              style={{ height: `${day.percentage}%` }}
                            />
                          )}
                          
                          {/* Ícone ou porcentagem */}
                          <div className="relative z-10">
                            {day.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : day.percentage > 0 ? (
                              <span className="text-xs font-bold text-slate-700">
                                {Math.round(day.percentage)}%
                              </span>
                            ) : (
                              <div className="w-3 h-3 bg-slate-300 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão Registrar Dose */}
                <button
                  onClick={handleDoseCompleted}
                  disabled={isDayComplete}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 mb-4 ${
                    isDayComplete
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isDayComplete ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-6 h-6" />
                      Todas as doses de hoje registradas! ✅
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Pill className="w-6 h-6" />
                      Registrar Dose ({todayDosesCompleted + 1}/{dailyDosesConfig})
                    </span>
                  )}
                </button>

                {/* Informação sobre doses do dia */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Progresso de Hoje</p>
                      <p className="text-xs text-slate-600 mt-1">
                        {todayDosesCompleted} de {dailyDosesConfig} doses realizadas
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-600">
                        {Math.round(todayPercentage)}%
                      </div>
                      {isDayComplete && (
                        <p className="text-xs text-teal-700 font-medium">✅ Completo!</p>
                      )}
                    </div>
                  </div>
                  {/* Barra de progresso */}
                  <div className="mt-3 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-500"
                      style={{ width: `${todayPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Mensagem de Encorajamento */}
                {streakCount === 0 && (
                  <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-blue-700 font-medium">
                      Tudo bem. Amanhã você retoma sua sequência. 💙
                    </p>
                  </div>
                )}
              </div>

              {/* Resumo do Dia */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-teal-600" />
                  Resumo do Dia
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Última Dose */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm text-blue-700 font-semibold mb-2">Última Dose Registrada</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-900">{lastDose.time}</span>
                      <span className="text-sm text-blue-600">• {lastDose.amount}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">{lastDose.date}</p>
                  </div>

                  {/* Próxima Dose */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-sm text-purple-700 font-semibold mb-2">Próxima Dose Prevista</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-purple-900">{nextDose.time}</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">{nextDose.date}</p>
                  </div>
                </div>

                {/* Status do Check-in */}
                <div className={`rounded-xl p-4 border-2 ${
                  checkInStatus === 'done' 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {checkInStatus === 'done' ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Check-in feito ✅</p>
                          <p className="text-sm text-green-700">Ótimo trabalho hoje!</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Clock className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="font-semibold text-orange-900">Check-in pendente ⏳</p>
                          <p className="text-sm text-orange-700">Não esqueça de registrar como está se sentindo</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Indicadores Principais */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Dor */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-red-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">Dor</h3>
                    <Activity className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-red-600">{indicators.pain.current}</span>
                    <span className="text-slate-500">/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {indicators.pain.trend === 'down' && (
                      <>
                        <TrendingDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Melhorou</span>
                      </>
                    )}
                    {indicators.pain.trend === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Aumentou</span>
                      </>
                    )}
                    {indicators.pain.trend === 'stable' && (
                      <>
                        <Minus className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600 font-medium">Estável</span>
                      </>
                    )}
                    <span className="text-xs text-slate-500">vs ontem ({indicators.pain.yesterday})</span>
                  </div>
                </div>

                {/* Ansiedade */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-yellow-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">Ansiedade</h3>
                    <Frown className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-yellow-600">{indicators.anxiety.current}</span>
                    <span className="text-slate-500">/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {indicators.anxiety.trend === 'down' && (
                      <>
                        <TrendingDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Melhorou</span>
                      </>
                    )}
                    {indicators.anxiety.trend === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Aumentou</span>
                      </>
                    )}
                    {indicators.anxiety.trend === 'stable' && (
                      <>
                        <Minus className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600 font-medium">Estável</span>
                      </>
                    )}
                    <span className="text-xs text-slate-500">vs ontem ({indicators.anxiety.yesterday})</span>
                  </div>
                </div>

                {/* Sono */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">Sono</h3>
                    <Moon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-blue-600">{indicators.sleep.current}</span>
                    <span className="text-slate-500">/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {indicators.sleep.trend === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Melhorou</span>
                      </>
                    )}
                    {indicators.sleep.trend === 'down' && (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Piorou</span>
                      </>
                    )}
                    {indicators.sleep.trend === 'stable' && (
                      <>
                        <Minus className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600 font-medium">Estável</span>
                      </>
                    )}
                    <span className="text-xs text-slate-500">vs ontem ({indicators.sleep.yesterday})</span>
                  </div>
                </div>
              </div>

              {/* Resumos Adicionais */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Resumo da Dose */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6">
                  <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Resumo de Doses
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Doses hoje:</span>
                      <span className="font-bold text-green-900">2/3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Doses na semana:</span>
                      <span className="font-bold text-green-900">18/21</span>
                    </div>
                    <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-600" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>

                {/* Resumo do Check-in */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Check-ins Diários
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">Esta semana:</span>
                      <span className="font-bold text-purple-900">5/7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">Este mês:</span>
                      <span className="font-bold text-purple-900">22/30</span>
                    </div>
                    <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500" style={{ width: '73%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Três Blocos Inferiores */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Humor */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center">
                  <Smile className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-700 mb-2">Humor</h3>
                  <div className="text-3xl font-bold text-yellow-600 mb-1">7.5</div>
                  <p className="text-xs text-slate-500">Média de hoje</p>
                </div>

                {/* Medicamento Disponível */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center">
                  <Package className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-700 mb-2">Estoque</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">68%</div>
                  <p className="text-xs text-slate-500">Medicamento disponível</p>
                </div>

                {/* Custo por Dia */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-700 mb-2">Custo/Dia</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">R$ 12</div>
                  <p className="text-xs text-slate-500">Média diária</p>
                </div>
              </div>

              {/* Estatísticas dos Últimos 7 Dias */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Evolução dos Últimos 7 Dias
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Dor</span>
                      <span className="text-sm font-bold text-green-600">↓ 35% de melhora</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-green-500" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Ansiedade</span>
                      <span className="text-sm font-bold text-green-600">↓ 20% de melhora</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-green-500" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Sono</span>
                      <span className="text-sm font-bold text-green-600">↑ 25% de melhora</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-green-500" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campo Envie sua Sugestão */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-6">
                <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Envie sua Sugestão
                </h3>
                <p className="text-sm text-indigo-700 mb-4">
                  Compartilhe suas ideias, feedbacks ou sugestões para melhorar o aplicativo
                </p>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Digite sua sugestão aqui..."
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  rows={4}
                />
                <button
                  onClick={handleSendSuggestion}
                  disabled={!suggestion.trim()}
                  className={`mt-3 w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    suggestion.trim()
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Enviar Sugestão
                </button>
              </div>
            </div>
          )}

          {/* Tab Check-in */}
          {activeTab === 'checkin' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Check-in Diário</h2>
                <p className="text-slate-600">
                  Registre como você está se sentindo hoje
                </p>
              </div>

              <CheckinForm onComplete={() => setActiveTab('home')} />
            </div>
          )}

          {/* Tab Relatório */}
          {activeTab === 'relatorio' && (
            <div className="space-y-6" onMouseUp={handleMouseUp}>
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Relatórios</h2>
                <p className="text-slate-600">
                  Selecione o período que deseja analisar
                </p>
              </div>

              {/* Calendário Interativo */}
              <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 shadow-lg">
                {/* Header do Calendário */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-700 capitalize">
                    {monthName}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Botões de Seleção Rápida */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={selectWeek}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Esta Semana
                  </button>
                  <button
                    onClick={selectTwoWeeks}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                  >
                    2 Semanas
                  </button>
                  <button
                    onClick={selectMonth}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Este Mês
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-all duration-300"
                  >
                    Limpar
                  </button>
                </div>

                {/* Grid do Calendário */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {/* Dias da semana */}
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Espaços vazios antes do primeiro dia */}
                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}

                  {/* Dias do mês */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                    const selected = isDateSelected(date)
                    const isToday = isSameDay(date, new Date())

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(date)}
                        onMouseDown={() => handleDateMouseDown(date)}
                        onMouseEnter={() => handleDateMouseEnter(date)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 select-none ${
                          selected
                            ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                            : isToday
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* Informação de Seleção */}
                {selectedDates.length > 0 && (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedDates.length} {selectedDates.length === 1 ? 'dia selecionado' : 'dias selecionados'}
                    </p>
                  </div>
                )}
              </div>

              {/* Botão Visualizar Relatório */}
              {selectedDates.length > 0 && (
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileText className="w-6 h-6" />
                  Visualizar Relatório
                </button>
              )}

              {/* Relatório Detalhado */}
              {showReport && selectedDates.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-700">Relatório Detalhado</h3>
                    <button
                      onClick={() => setShowReport(false)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Visão Geral */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-200">
                      <p className="text-sm text-teal-700 font-semibold mb-2">Frequência de Uso</p>
                      <p className="text-3xl font-bold text-teal-900">{reportData.frequenciaUso}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-sm text-blue-700 font-semibold mb-2">Dias Registrados</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {reportData.diasCorretos}/{reportData.diasRegistrados}
                      </p>
                    </div>
                  </div>

                  {/* Humor */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                    <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                      <Smile className="w-5 h-5" />
                      Resumo do Humor
                    </h4>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-yellow-700">{reportData.humorMedio}</span>
                      <span className="text-slate-600">/10</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Tendência: <span className="font-semibold">{reportData.tendenciaHumor}</span>
                    </p>
                  </div>

                  {/* Sintomas */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Principais Sintomas
                    </h4>
                    <ul className="space-y-2">
                      {reportData.principaisSintomas.map((sintoma, index) => (
                        <li key={index} className="flex items-center gap-2 text-purple-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          {sintoma}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sequência de Doses */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Sequência de Doses
                    </h4>
                    <p className="text-2xl font-bold text-green-700 mb-2">{reportData.sequenciaDoses}</p>
                    <p className="text-sm text-green-700">
                      Check-ins realizados: <span className="font-semibold">{reportData.checkInsRealizados}</span>
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Observações registradas: <span className="font-semibold">{reportData.observacoes}</span>
                    </p>
                  </div>

                  {/* Gráfico de Evolução */}
                  <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-teal-600" />
                      Evolução ao Longo do Tempo
                    </h4>
                    <div className="space-y-4">
                      {/* Gráfico de barras simples */}
                      <div className="flex items-end justify-between gap-2 h-40">
                        {reportData.evolucaoData.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col gap-1">
                              {/* Barra de Humor */}
                              <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden relative">
                                <div
                                  className="bg-gradient-to-t from-teal-500 to-cyan-600 transition-all duration-500"
                                  style={{ height: `${item.humor * 10}px` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-slate-600 font-medium">{item.dia}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Legenda */}
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded" />
                          <span className="text-slate-600">Humor</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Padrões e Bem-estar */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">Padrões e Bem-estar</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Melhora geral:</span>
                        <span className="font-bold text-blue-900">+28%</span>
                      </div>
                      <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-600" style={{ width: '78%' }} />
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Relação positiva entre uso regular e redução de sintomas
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Medicamento */}
          {activeTab === 'medicamento' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Medicamentos</h2>
                <p className="text-slate-600">
                  Gerencie as informações dos seus medicamentos
                </p>
              </div>

              {/* Botão Adicionar Medicamento */}
              {!isAddingMedication && (
                <button
                  onClick={() => setIsAddingMedication(true)}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-6 h-6" />
                  Adicionar Novo Medicamento
                </button>
              )}

              {/* Formulário de Registro de Medicamento */}
              {isAddingMedication && (
                <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 shadow-lg space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-700">
                      {editingMedicationId ? 'Editar Medicamento' : 'Registro do Medicamento'}
                    </h3>
                    <button
                      onClick={handleCancelMedication}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Campos Obrigatórios */}
                  <div className="space-y-4">
                    {/* Nome do Medicamento */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Nome do Medicamento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medicationForm.nome}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Ex: Canabidiol"
                      />
                    </div>

                    {/* Marca */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Marca <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medicationForm.marca}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, marca: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Ex: MedCann"
                      />
                    </div>

                    {/* Quantidade de Frascos/Potes */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Quantidade de Frascos/Potes <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={medicationForm.quantidadeFrascos}
                          onChange={(e) => setMedicationForm(prev => ({ ...prev, quantidadeFrascos: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="Ex: 2"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Quantidade por Produto <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={medicationForm.quantidadePorProduto}
                          onChange={(e) => setMedicationForm(prev => ({ ...prev, quantidadePorProduto: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="Ex: 30"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Unidade de Medida */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Unidade de Medida <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={medicationForm.unidadeMedida}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, unidadeMedida: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      >
                        <option value="ml">ml (mililitro)</option>
                        <option value="mg">mg (miligrama)</option>
                        <option value="g">g (grama)</option>
                        <option value="unidade">unidade</option>
                        <option value="gomas">gomas</option>
                        <option value="gotas">gotas</option>
                        <option value="comprimidos">comprimidos</option>
                        <option value="cápsulas">cápsulas</option>
                      </select>
                    </div>

                    {/* Dose por Uso */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Dose por Uso <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={medicationForm.dosePorUso}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, dosePorUso: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Ex: 5"
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Quantidade utilizada em cada dose (em {medicationForm.unidadeMedida})
                      </p>
                    </div>

                    {/* Validade */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Validade <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={medicationForm.validade}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, validade: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Frequência de Uso Diária */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Frequência de Uso Diária <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={medicationForm.frequenciaDiaria}
                        onChange={(e) => handleFrequenciaChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Ex: 3"
                        min="1"
                        max="10"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Quantas vezes por dia você usa este medicamento?
                      </p>
                    </div>

                    {/* Horários (gerados automaticamente) */}
                    {medicationForm.horarios.length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                        <label className="block text-sm font-semibold text-blue-900 mb-3">
                          Horários de Uso <span className="text-red-500">*</span>
                        </label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {medicationForm.horarios.map((horario, index) => (
                            <div key={index}>
                              <label className="block text-xs text-blue-700 mb-1">
                                Horário {index + 1}
                              </label>
                              <input
                                type="time"
                                value={horario}
                                onChange={(e) => handleHorarioChange(index, e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          Estes horários serão usados para enviar notificações
                        </p>
                      </div>
                    )}

                    {/* Valor Pago */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Valor Pago (R$) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={medicationForm.valorPago}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, valorPago: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Ex: 450.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Campos Opcionais - Contato da Empresa */}
                  <div className="border-t-2 border-slate-200 pt-6">
                    <h4 className="text-lg font-bold text-slate-700 mb-4">
                      Contato da Empresa Fornecedora (Opcional)
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Site
                        </label>
                        <input
                          type="url"
                          value={medicationForm.contatoEmpresa.site}
                          onChange={(e) => setMedicationForm(prev => ({
                            ...prev,
                            contatoEmpresa: { ...prev.contatoEmpresa, site: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="https://exemplo.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={medicationForm.contatoEmpresa.telefone}
                          onChange={(e) => setMedicationForm(prev => ({
                            ...prev,
                            contatoEmpresa: { ...prev.contatoEmpresa, telefone: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Nome da Pessoa de Referência
                        </label>
                        <input
                          type="text"
                          value={medicationForm.contatoEmpresa.nomeReferencia}
                          onChange={(e) => setMedicationForm(prev => ({
                            ...prev,
                            contatoEmpresa: { ...prev.contatoEmpresa, nomeReferencia: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="Ex: João Silva"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelMedication}
                      className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveMedication}
                      className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Salvar Medicamento
                    </button>
                  </div>
                </div>
              )}

              {/* Medicamentos Salvos */}
              {medications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-700">Medicamentos Salvos</h3>
                  
                  {medications.map((medication) => (
                    <div key={medication.id} className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
                      {/* Header do Card */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-700">{medication.nome}</h4>
                          <p className="text-sm text-slate-600">Marca: {medication.marca}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMedication(medication)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Informações Principais */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-200">
                          <p className="text-xs text-teal-700 font-semibold mb-1">Estoque Disponível</p>
                          <p className="text-2xl font-bold text-teal-900">
                            {medication.estoqueDisponivel.toFixed(2)} {medication.unidadeMedida}
                          </p>
                          <p className="text-xs text-teal-600 mt-1">
                            {medication.quantidadeFrascos} frasco(s) × {medication.quantidadePorProduto} {medication.unidadeMedida}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                          <p className="text-xs text-green-700 font-semibold mb-1">Custo Diário</p>
                          <p className="text-2xl font-bold text-green-900">
                            R$ {medication.custoDiario.toFixed(2)}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Custo total: R$ {medication.custoTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Detalhes de Uso */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Frequência de Uso</p>
                        <p className="text-blue-700">
                          {medication.frequenciaDiaria}x ao dia • {medication.dosePorUso} {medication.unidadeMedida} por dose
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {medication.horarios.map((horario, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-lg text-xs font-medium">
                              {horario}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Validade */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">
                          Validade: <span className="font-semibold">{new Date(medication.validade).toLocaleDateString('pt-BR')}</span>
                        </span>
                      </div>

                      {/* Contato da Empresa (se existir) */}
                      {medication.contatoEmpresa && (
                        <div className="border-t-2 border-slate-200 pt-4">
                          <p className="text-sm font-semibold text-slate-700 mb-2">Contato da Empresa</p>
                          <div className="space-y-1 text-sm text-slate-600">
                            {medication.contatoEmpresa.site && (
                              <p>Site: <a href={medication.contatoEmpresa.site} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">{medication.contatoEmpresa.site}</a></p>
                            )}
                            {medication.contatoEmpresa.telefone && (
                              <p>Telefone: {medication.contatoEmpresa.telefone}</p>
                            )}
                            {medication.contatoEmpresa.nomeReferencia && (
                              <p>Referência: {medication.contatoEmpresa.nomeReferencia}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Mensagem quando não há medicamentos */}
              {medications.length === 0 && !isAddingMedication && (
                <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl border-2 border-slate-200 p-12 text-center">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    Nenhum medicamento cadastrado
                  </h3>
                  <p className="text-slate-600">
                    Adicione seu primeiro medicamento para começar a gerenciar seu tratamento
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - SEM ABA DOSE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'home'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'checkin'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span className="text-xs font-medium">Check-in</span>
            </button>

            <button
              onClick={() => setActiveTab('relatorio')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'relatorio'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">Relatório</span>
            </button>

            <button
              onClick={() => setActiveTab('medicamento')}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'medicamento'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs font-medium">Medicamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer para bottom navigation */}
      <div className="h-20" />
    </div>
  )
}
