'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle2, Pill, Activity, Calendar, ArrowLeft, User, Heart, Stethoscope, Scale, TrendingUp, MessageSquare, AlertCircle, Target, Gift, Sparkles, Check, X, FileText } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { extractProfileFromQuestionnaire, saveProfile, loadProfile, type PatientProfile, getPersonalizedGreeting, getDashboardPriorities } from '@/lib/patient-profile'

type Screen = 'login' | 'onboarding' | 'welcome' | 'phases' | 'phase1-detail' | 'questionnaire' | 'payment-annual' | 'payment-plans' | 'profile-view'

interface FormData {
  // Dados pessoais
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  cpf: string
  
  // Endereço
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  
  // Informações do tratamento
  treatmentFor: string
  treatmentForOther: string
  patientName: string
  isForMe: boolean
  treatmentReasons: string[]
  treatmentReasonsOther: string
  medicationType: string
  medicationTypeOther: string
  formulation: string
  formulationOther: string
  frequency: string
  doseType: string
  doseTypeOther: string
  doseAmount: string
  
  // Informações de saúde
  biologicalSex: string
  birthDay: string
  birthMonth: string
  birthYear: string
  height: string
  weight: string
  activityLevel: string
  
  // Alergias e condições
  allergies: string
  healthConditions: string
  currentMedications: string
  
  // Contatos de emergência
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  
  // Médico responsável
  doctorName: string
  doctorCRM: string
  doctorPhone: string
  
  // Plano de saúde
  hasHealthInsurance: boolean
  healthInsuranceName: string
  healthInsuranceNumber: string
  
  // Motivação e sintomas
  personalMotivation: string
  sideEffects: string[]
  sideEffectsOther: string
  mainReason: string
  symptomIntensity: number
  timeLiving: string
  
  // Termos e preferências
  acceptTerms: boolean
  acceptPrivacy: boolean
  wantDoseReminders: boolean
  wantDailyCheckins: boolean
  wantWeeklyReports: boolean
  
  // Código de indicação
  referralCode: string
}

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function Home() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('login')
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'annual'>('annual')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'dose',
      title: 'Registrar primeira dose',
      description: 'Comece seu acompanhamento registrando sua primeira dose',
      completed: false
    },
    {
      id: 'reminders',
      title: 'Ativar lembretes',
      description: 'Configure notificações para nunca esquecer suas doses',
      completed: false
    },
    {
      id: 'checkin',
      title: 'Fazer primeiro check-in',
      description: 'Registre como você está se sentindo hoje',
      completed: false
    }
  ])
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    treatmentFor: '',
    treatmentForOther: '',
    patientName: '',
    isForMe: false,
    treatmentReasons: [],
    treatmentReasonsOther: '',
    medicationType: '',
    medicationTypeOther: '',
    formulation: '',
    formulationOther: '',
    frequency: '',
    doseType: '',
    doseTypeOther: '',
    doseAmount: '',
    biologicalSex: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    height: '',
    weight: '',
    activityLevel: '',
    allergies: '',
    healthConditions: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    doctorName: '',
    doctorCRM: '',
    doctorPhone: '',
    hasHealthInsurance: false,
    healthInsuranceName: '',
    healthInsuranceNumber: '',
    personalMotivation: '',
    sideEffects: [],
    sideEffectsOther: '',
    mainReason: '',
    symptomIntensity: 5,
    timeLiving: '',
    acceptTerms: false,
    acceptPrivacy: false,
    wantDoseReminders: true,
    wantDailyCheckins: true,
    wantWeeklyReports: true,
    referralCode: ''
  })

  const totalSteps = 25
  const progress = ((currentStep + 1) / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'treatmentReasons' | 'sideEffects', value: string) => {
    setFormData(prev => {
      const array = prev[field]
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...array, value] }
      }
    })
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = checklist.filter(item => item.completed).length
  const totalChecklistItems = checklist.length

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalSteps - 1) {
      // Ao finalizar o questionário, extrai perfil e vai para tela de pagamento
      const profile = extractProfileFromQuestionnaire(formData)
      saveProfile(profile)
      setPatientProfile(profile)
      setScreen('payment-annual')
    }
  }

  // Carregar perfil ao montar componente
  useEffect(() => {
    const savedProfile = loadProfile()
    if (savedProfile) {
      setPatientProfile(savedProfile)
    }
  }, [])

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Função de Login
  const handleLogin = () => {
    setLoginError('')
    
    // Validação de credenciais de administrador
    if (loginEmail === 'admin@admin' && loginPassword === 'admin#123@') {
      // Admin vai direto para o dashboard
      router.push('/dashboard')
    } else {
      setLoginError('Credenciais inválidas.')
    }
  }

  // Tela de Login/Cadastro
  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-50 to-cyan-50 border-b-2 border-slate-200 py-6 px-4 sm:px-6">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana Logo"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-md mx-auto font-medium">Seu assistente de tratamento personalizado</p>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            {/* Logo MyKana acima do Bem-vindo */}
            <div className="flex justify-center mb-4">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5c4d00d8-7f79-43ed-93f5-f34c13e5d55c.png" 
                alt="MyKana Logo" 
                className="h-24 w-auto"
              />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 font-inter">Bem-vindo</h2>
              <p className="text-slate-600">Faça login ou crie sua conta para começar</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
              <input
                type="password"
                placeholder="Sua senha"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
              
              {loginError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              )}

              <button 
                onClick={handleLogin}
                className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02]"
              >
                Entrar
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">ou</span>
                </div>
              </div>

              <button 
                onClick={() => setScreen('questionnaire')}
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Cadastrar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-center text-sm text-slate-500">
              Ao continuar, você concorda com nossos termos de uso
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Questionário (25 Etapas)
  if (screen === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex flex-col">
        {/* Header com Progresso */}
        <div className="bg-white border-b-2 border-slate-200 py-4 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">
                Etapa {currentStep + 1} de {totalSteps}
              </span>
              <span className="text-sm font-semibold text-teal-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Conteúdo do Questionário */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Etapa 1: Nome e Email */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Vamos começar!</h2>
                  <p className="text-slate-600">Primeiro, precisamos saber quem você é</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome completo</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 2: Senha */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Crie sua senha</h2>
                  <p className="text-slate-600">Escolha uma senha segura para sua conta</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirme a senha</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                      <p className="text-sm text-red-700">As senhas não coincidem</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Etapa 3: Telefone e CPF */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Dados de contato</h2>
                  <p className="text-slate-600">Para sua segurança e identificação</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CPF</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => updateFormData('cpf', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 4: Endereço - CEP */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Seu endereço</h2>
                  <p className="text-slate-600">Comece informando seu CEP</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CEP</label>
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => updateFormData('cep', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 5: Endereço - Rua e Número */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Endereço completo</h2>
                  <p className="text-slate-600">Rua e número</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Rua</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => updateFormData('street', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Número</label>
                      <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => updateFormData('number', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Nº"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Complemento</label>
                      <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => updateFormData('complement', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Apto, sala..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 6: Endereço - Bairro, Cidade e Estado */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Localização</h2>
                  <p className="text-slate-600">Bairro, cidade e estado</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bairro</label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => updateFormData('neighborhood', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Nome do bairro"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Cidade"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 7: Para quem é o tratamento */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Para quem é o tratamento?</h2>
                  <p className="text-slate-600">Selecione uma opção</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['Para mim', 'Para meu filho(a)', 'Para um familiar', 'Para outra pessoa', 'Outro'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFormData('treatmentFor', option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.treatmentFor === option
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                  {formData.treatmentFor === 'Outro' && (
                    <input
                      type="text"
                      value={formData.treatmentForOther}
                      onChange={(e) => updateFormData('treatmentForOther', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors mt-3"
                      placeholder="Especifique"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Etapa 8: Nome do paciente */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Qual o nome do paciente?</h2>
                  <p className="text-slate-600">Como devemos chamar a pessoa em tratamento?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do paciente</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => updateFormData('patientName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Digite o nome"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 9: Motivos do tratamento */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Por que busca esse tratamento?</h2>
                  <p className="text-slate-600">Selecione todos que se aplicam</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['Dor crônica', 'Ansiedade', 'Insônia', 'Depressão', 'Epilepsia', 'Náusea', 'Falta de apetite', 'Outro'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => toggleArrayItem('treatmentReasons', reason)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.treatmentReasons.includes(reason)
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{reason}</span>
                        {formData.treatmentReasons.includes(reason) && (
                          <Check className="w-5 h-5 text-teal-600" />
                        )}
                      </div>
                    </button>
                  ))}
                  {formData.treatmentReasons.includes('Outro') && (
                    <input
                      type="text"
                      value={formData.treatmentReasonsOther}
                      onChange={(e) => updateFormData('treatmentReasonsOther', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors mt-3"
                      placeholder="Especifique outros motivos"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Etapa 10: Tipo de medicação */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Que tipo de medicação você usa?</h2>
                  <p className="text-slate-600">Selecione uma opção</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['Cannabis medicinal (CBD)', 'Cannabis medicinal (THC)', 'Cannabis medicinal (CBD + THC)', 'Outro'].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateFormData('medicationType', type)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.medicationType === type
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {formData.medicationType === 'Outro' && (
                    <input
                      type="text"
                      value={formData.medicationTypeOther}
                      onChange={(e) => updateFormData('medicationTypeOther', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors mt-3"
                      placeholder="Especifique"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Etapa 11: Formulação */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Qual a formulação?</h2>
                  <p className="text-slate-600">Como você toma a medicação?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['Óleo sublingual', 'Cápsula', 'Spray', 'Vaporização', 'Outro'].map((form) => (
                    <button
                      key={form}
                      onClick={() => updateFormData('formulation', form)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.formulation === form
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {form}
                    </button>
                  ))}
                  {formData.formulation === 'Outro' && (
                    <input
                      type="text"
                      value={formData.formulationOther}
                      onChange={(e) => updateFormData('formulationOther', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors mt-3"
                      placeholder="Especifique"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Etapa 12: Frequência */}
            {currentStep === 11 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Com que frequência você toma?</h2>
                  <p className="text-slate-600">Selecione a frequência</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['1x ao dia', '2x ao dia', '3x ao dia', '4x ou mais ao dia', 'Conforme necessário'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => updateFormData('frequency', freq)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.frequency === freq
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Etapa 13: Tipo de dose */}
            {currentStep === 12 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Como você mede sua dose?</h2>
                  <p className="text-slate-600">Selecione o tipo</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['Gotas', 'ml', 'mg', 'Puffs', 'Outro'].map((dose) => (
                    <button
                      key={dose}
                      onClick={() => updateFormData('doseType', dose)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.doseType === dose
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {dose}
                    </button>
                  ))}
                  {formData.doseType === 'Outro' && (
                    <input
                      type="text"
                      value={formData.doseTypeOther}
                      onChange={(e) => updateFormData('doseTypeOther', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors mt-3"
                      placeholder="Especifique"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Etapa 14: Quantidade da dose */}
            {currentStep === 13 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Qual a quantidade por dose?</h2>
                  <p className="text-slate-600">Informe a quantidade que você toma</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8">
                  <input
                    type="text"
                    value={formData.doseAmount}
                    onChange={(e) => updateFormData('doseAmount', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                    placeholder={`Ex: 5 ${formData.doseType || 'unidades'}`}
                  />
                </div>
              </div>
            )}

            {/* Etapa 15: Sexo biológico e data de nascimento */}
            {currentStep === 14 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Informações pessoais</h2>
                  <p className="text-slate-600">Para personalizar seu acompanhamento</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sexo biológico</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Masculino', 'Feminino'].map((sex) => (
                        <button
                          key={sex}
                          onClick={() => updateFormData('biologicalSex', sex)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.biologicalSex === sex
                              ? 'bg-teal-50 border-teal-500'
                              : 'border-slate-200 hover:border-teal-300'
                          }`}
                        >
                          {sex}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Data de nascimento</label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={formData.birthDay}
                        onChange={(e) => updateFormData('birthDay', e.target.value)}
                        className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Dia"
                        maxLength={2}
                      />
                      <input
                        type="text"
                        value={formData.birthMonth}
                        onChange={(e) => updateFormData('birthMonth', e.target.value)}
                        className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Mês"
                        maxLength={2}
                      />
                      <input
                        type="text"
                        value={formData.birthYear}
                        onChange={(e) => updateFormData('birthYear', e.target.value)}
                        className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Ano"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 16: Altura e peso */}
            {currentStep === 15 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Medidas corporais</h2>
                  <p className="text-slate-600">Ajuda a calcular dosagens ideais</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Altura (cm)</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => updateFormData('height', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Ex: 170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Peso (kg)</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => updateFormData('weight', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Ex: 70"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 17: Nível de atividade */}
            {currentStep === 16 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Nível de atividade física</h2>
                  <p className="text-slate-600">Como você descreveria sua rotina?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-3">
                  {['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Muito ativo', 'Extremamente ativo'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateFormData('activityLevel', level)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.activityLevel === level
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Etapa 18: Alergias e condições de saúde */}
            {currentStep === 17 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Histórico de saúde</h2>
                  <p className="text-slate-600">Alergias e condições médicas</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alergias conhecidas</label>
                    <textarea
                      value={formData.allergies}
                      onChange={(e) => updateFormData('allergies', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors min-h-[80px]"
                      placeholder="Liste suas alergias ou escreva 'Nenhuma'"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Condições de saúde</label>
                    <textarea
                      value={formData.healthConditions}
                      onChange={(e) => updateFormData('healthConditions', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors min-h-[80px]"
                      placeholder="Diabetes, hipertensão, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Medicamentos atuais</label>
                    <textarea
                      value={formData.currentMedications}
                      onChange={(e) => updateFormData('currentMedications', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors min-h-[80px]"
                      placeholder="Liste outros medicamentos que você toma"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 19: Contato de emergência */}
            {currentStep === 18 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Contato de emergência</h2>
                  <p className="text-slate-600">Quem devemos contatar em caso de necessidade?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome completo</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Nome do contato"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Relação</label>
                    <input
                      type="text"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => updateFormData('emergencyContactRelation', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Ex: Mãe, Pai, Cônjuge, Amigo"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 20: Médico responsável */}
            {currentStep === 19 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Médico responsável</h2>
                  <p className="text-slate-600">Dados do médico que prescreveu o tratamento</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do médico</label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => updateFormData('doctorName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Dr(a). Nome Completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CRM</label>
                    <input
                      type="text"
                      value={formData.doctorCRM}
                      onChange={(e) => updateFormData('doctorCRM', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="CRM 000000/UF"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone do consultório</label>
                    <input
                      type="tel"
                      value={formData.doctorPhone}
                      onChange={(e) => updateFormData('doctorPhone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 21: Plano de saúde */}
            {currentStep === 20 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Plano de saúde</h2>
                  <p className="text-slate-600">Você possui plano de saúde?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateFormData('hasHealthInsurance', true)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.hasHealthInsurance
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => updateFormData('hasHealthInsurance', false)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        !formData.hasHealthInsurance
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      Não
                    </button>
                  </div>
                  {formData.hasHealthInsurance && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do plano</label>
                        <input
                          type="text"
                          value={formData.healthInsuranceName}
                          onChange={(e) => updateFormData('healthInsuranceName', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="Ex: Unimed, Amil, Bradesco Saúde"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Número da carteirinha</label>
                        <input
                          type="text"
                          value={formData.healthInsuranceNumber}
                          onChange={(e) => updateFormData('healthInsuranceNumber', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                          placeholder="Número do cartão"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Etapa 22: Motivação pessoal */}
            {currentStep === 21 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">O que você mais espera desse tratamento?</h2>
                  <p className="text-slate-600">Compartilhe sua motivação</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8">
                  <textarea
                    value={formData.personalMotivation}
                    onChange={(e) => updateFormData('personalMotivation', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors min-h-[120px]"
                    placeholder="Escreva aqui suas expectativas e objetivos..."
                  />
                </div>
              </div>
            )}

            {/* Etapa 23: Termos e condições */}
            {currentStep === 22 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Termos de uso</h2>
                  <p className="text-slate-600">Leia e aceite para continuar</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div className="max-h-64 overflow-y-auto border-2 border-slate-200 rounded-xl p-4 text-sm text-slate-600">
                    <h3 className="font-bold text-slate-700 mb-2">Termos de Uso do MyKana</h3>
                    <p className="mb-2">
                      Ao usar o MyKana, você concorda que este aplicativo é uma ferramenta de acompanhamento e não substitui orientação médica profissional.
                    </p>
                    <p className="mb-2">
                      Todas as informações fornecidas são confidenciais e protegidas pela LGPD.
                    </p>
                    <p>
                      Você é responsável por manter suas credenciais seguras e por todas as atividades realizadas em sua conta.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => updateFormData('acceptTerms', !formData.acceptTerms)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.acceptTerms
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.acceptTerms ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                        }`}>
                          {formData.acceptTerms && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm">Aceito os Termos de Uso</span>
                      </div>
                    </button>
                    <button
                      onClick={() => updateFormData('acceptPrivacy', !formData.acceptPrivacy)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        formData.acceptPrivacy
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.acceptPrivacy ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                        }`}>
                          {formData.acceptPrivacy && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm">Aceito a Política de Privacidade</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 24: Preferências de notificação */}
            {currentStep === 23 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Preferências de notificação</h2>
                  <p className="text-slate-600">Como você quer ser lembrado?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div className="space-y-3">
                    <button
                      onClick={() => updateFormData('wantDoseReminders', !formData.wantDoseReminders)}
                      className={`w-full p-4 border-2 rounded-xl transition-all ${
                        formData.wantDoseReminders
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="font-semibold text-slate-700">Lembretes de dose</p>
                          <p className="text-sm text-slate-500">Receba notificações nos horários das doses</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.wantDoseReminders ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                        }`}>
                          {formData.wantDoseReminders && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => updateFormData('wantDailyCheckins', !formData.wantDailyCheckins)}
                      className={`w-full p-4 border-2 rounded-xl transition-all ${
                        formData.wantDailyCheckins
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="font-semibold text-slate-700">Check-ins diários</p>
                          <p className="text-sm text-slate-500">Lembrete para registrar como você está</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.wantDailyCheckins ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                        }`}>
                          {formData.wantDailyCheckins && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => updateFormData('wantWeeklyReports', !formData.wantWeeklyReports)}
                      className={`w-full p-4 border-2 rounded-xl transition-all ${
                        formData.wantWeeklyReports
                          ? 'bg-teal-50 border-teal-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="font-semibold text-slate-700">Relatórios semanais</p>
                          <p className="text-sm text-slate-500">Resumo da sua evolução</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.wantWeeklyReports ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                        }`}>
                          {formData.wantWeeklyReports && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 25: Código de indicação (opcional) */}
            {currentStep === 24 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Quase lá!</h2>
                  <p className="text-slate-600">Tem um código de indicação?</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Código de indicação (opcional)</label>
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => updateFormData('referralCode', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Digite o código"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-500 rounded-xl p-4">
                    <p className="text-sm text-slate-700 font-medium">
                      🎁 Com um código de indicação, você e quem indicou ganham benefícios especiais!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex gap-3 mt-8">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
              )}
              <button
                onClick={nextStep}
                className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {currentStep === totalSteps - 1 ? 'Finalizar' : 'Continuar'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Placeholder para outras telas
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-700 mb-4">Tela em desenvolvimento</h1>
        <button
          onClick={() => setScreen('login')}
          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all"
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  )
}
