'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Pill, Activity, Calendar, ArrowLeft, User, Heart, Stethoscope, Scale, TrendingUp, MessageSquare, AlertCircle, Target, Gift } from 'lucide-react'
import Image from 'next/image'

type Screen = 'login' | 'welcome' | 'phases' | 'phase1-detail' | 'questionnaire'

interface FormData {
  // Etapa 1
  fullName: string
  email: string
  
  // Etapa 2
  treatmentFor: string
  treatmentForOther: string
  
  // Etapa 3
  patientName: string
  isForMe: boolean
  
  // Etapa 4
  treatmentReasons: string[]
  treatmentReasonsOther: string
  
  // Etapa 5
  medicationType: string
  medicationTypeOther: string
  
  // Etapa 6
  formulation: string
  formulationOther: string
  
  // Etapa 7
  frequency: string
  
  // Etapa 8
  doseType: string
  doseTypeOther: string
  
  // Etapa 9
  doseAmount: string
  
  // Etapa 10
  biologicalSex: string
  birthDay: string
  birthMonth: string
  birthYear: string
  
  // Etapa 11
  height: string
  weight: string
  
  // Etapa 12
  activityLevel: string
  
  // Etapa 13
  personalMotivation: string
  
  // Etapa 14
  sideEffects: string[]
  sideEffectsOther: string
  
  // Etapa 15
  mainReason: string
  symptomIntensity: number
  timeLiving: string
  
  // Etapa 16
  referralCode: string
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('login')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
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
    personalMotivation: '',
    sideEffects: [],
    sideEffectsOther: '',
    mainReason: '',
    symptomIntensity: 5,
    timeLiving: '',
    referralCode: ''
  })

  const totalSteps = 16
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

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Tela de Login/Cadastro
  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-100 py-6 px-4 sm:px-6">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana Logo"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-3 max-w-md mx-auto font-medium">Seu assistente de tratamento personalizado</p>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860] font-inter">Bem-vindo</h2>
              <p className="text-gray-600">Faça login ou crie sua conta para começar</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
              <input
                type="password"
                placeholder="Sua senha"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
              
              <button className="w-full bg-[#445860] text-white py-3 rounded-xl font-semibold hover:bg-[#556870] transition-all duration-300 hover:scale-[1.02]">
                Entrar
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <button 
                onClick={() => setScreen('welcome')}
                className="w-full bg-[#5AAE45] text-white py-3 rounded-xl font-semibold hover:bg-[#4a9d38] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Cadastrar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Ao continuar, você concorda com nossos termos de uso
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Boas-vindas (Tela 1)
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-100 py-6 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#5AAE45] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860] font-inter">Ótima escolha!</h2>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#5AAE45] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Agora é só seguir nosso passo a passo
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#5AAE45] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Nossa intenção é deixar o tratamento o mais adequado possível ao paciente e facilitar
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#5AAE45] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Todo o passo a passo leva apenas alguns minutos
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setScreen('phases')}
              className="w-full bg-[#5AAE45] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#4a9d38] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Tela das 3 Fases (Tela 2)
  if (screen === 'phases') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-100 py-6 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860] font-inter">
                Nosso Processo
              </h2>
              <p className="text-gray-600">Três fases simples para personalizar seu tratamento</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Fase 1</h3>
                    <p className="text-white/90">Vamos identificar e definir seu objetivo e sintomas</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#445860] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#445860] mb-2">Fase 2</h3>
                    <p className="text-gray-600">Entenda o funcionamento do aplicativo</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#445860] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#445860] mb-2">Fase 3</h3>
                    <p className="text-gray-600">Acompanhamento do seu tratamento</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setScreen('phase1-detail')}
              className="w-full bg-[#5AAE45] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#4a9d38] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Detalhes da Fase 1 (Tela 4)
  if (screen === 'phase1-detail') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-100 py-6 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Fase 1 - Preparação</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#5AAE45] rounded-full flex items-center justify-center mx-auto">
                <Pill className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860] font-inter">
                Fase 1
              </h2>
              <p className="text-xl text-gray-600">Identificar e definir seu objetivo e sintomas</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#5AAE45] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    Agora vamos identificar e definir seu objetivo e sintomas
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#5AAE45] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    Ter a embalagem do medicamento utilizado pode ajudar a realizar o preenchimento
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    Este aplicativo não tem a intenção de substituir seu médico, mas sim ajudar a auxiliar no monitoramento e esclarecimento de dúvidas do tratamento
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setScreen('questionnaire')}
              className="w-full bg-[#5AAE45] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#4a9d38] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Iniciar Questionário
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Questionário com 16 Etapas
  const renderQuestionnaireStep = () => {
    switch (currentStep) {
      // Etapa 1: Informações Básicas
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Vamos Personalizar Seu Tratamento!
              </h2>
              <p className="text-gray-600">
                Levará apenas alguns minutos e ajudará a criar um plano feito sob medida para você!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qual é o seu nome completo? *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qual é o seu e-mail? *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )

      // Etapa 2: Monitoramento do Tratamento
      case 1:
        const treatmentOptions = [
          'Para mim', 'Filho(a)', 'Esposo(a)', 'Pai', 'Mãe', 
          'Irmã(o)', 'Tio(a)', 'Primo(a)', 'Sobrinho(a)', 'Outro'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Para quem será o monitoramento?
              </h2>
              <p className="text-gray-600">Escolha uma opção abaixo</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {treatmentOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => updateFormData('treatmentFor', option)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.treatmentFor === option
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {formData.treatmentFor === 'Outro' && (
              <input
                type="text"
                value={formData.treatmentForOther}
                onChange={(e) => updateFormData('treatmentForOther', e.target.value)}
                placeholder="Especifique..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
            )}
          </div>
        )

      // Etapa 3: Nome do Paciente
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Heart className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Qual o nome de quem realizará o tratamento?
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="isForMe"
                  checked={formData.isForMe}
                  onChange={(e) => {
                    updateFormData('isForMe', e.target.checked)
                    if (e.target.checked) {
                      updateFormData('patientName', formData.fullName)
                    }
                  }}
                  className="w-5 h-5 text-[#5AAE45] rounded focus:ring-[#5AAE45]"
                />
                <label htmlFor="isForMe" className="text-gray-700 font-medium cursor-pointer">
                  É para mim, pular esta etapa
                </label>
              </div>

              {!formData.isForMe && (
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => updateFormData('patientName', e.target.value)}
                  placeholder="Nome do paciente"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                />
              )}
            </div>
          </div>
        )

      // Etapa 4: Motivo do Tratamento
      case 3:
        const reasons = [
          'Dor crônica', 'Ansiedade', 'Insônia/distúrbios do sono', 
          'Epilepsia/crises convulsivas', 'Espasticidade muscular',
          'Náuseas por quimioterapia', 'Depressão', 
          'Transtorno de Estresse Pós-Traumático', 'Enxaqueca',
          'Transtorno do Espectro Autista', 'Outros'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Stethoscope className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Por qual motivo você realiza o tratamento?
              </h2>
              <p className="text-gray-600">Pode selecionar mais de uma opção</p>
            </div>

            <div className="space-y-3">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => toggleArrayItem('treatmentReasons', reason)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.treatmentReasons.includes(reason)
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.treatmentReasons.includes(reason)
                        ? 'border-[#5AAE45] bg-[#5AAE45]'
                        : 'border-gray-300'
                    }`}>
                      {formData.treatmentReasons.includes(reason) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {reason}
                  </div>
                </button>
              ))}
            </div>

            {formData.treatmentReasons.includes('Outros') && (
              <input
                type="text"
                value={formData.treatmentReasonsOther}
                onChange={(e) => updateFormData('treatmentReasonsOther', e.target.value)}
                placeholder="Especifique outros motivos..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
            )}
          </div>
        )

      // Etapa 5: Tipo de Medicamento
      case 4:
        const medicationTypes = ['Óleo', 'Goma', 'Vaporizado', 'Gel', 'Creme', 'Fita', 'Outro']
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Pill className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Qual tipo de medicamento você utiliza?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {medicationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFormData('medicationType', type)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.medicationType === type
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {formData.medicationType === 'Outro' && (
              <input
                type="text"
                value={formData.medicationTypeOther}
                onChange={(e) => updateFormData('medicationTypeOther', e.target.value)}
                placeholder="Especifique..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
            )}
          </div>
        )

      // Etapa 6: Formulação Utilizada
      case 5:
        const formulations = [
          'Full Spectrum', 'Broad Spectrum', 'CBD Isolado', 
          'CBG Isolado', 'CBN Isolado', 'THC Isolado', 
          'THC-V Isolado', 'Outro'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Activity className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Qual formulação você utiliza?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formulations.map((formulation) => (
                <button
                  key={formulation}
                  onClick={() => updateFormData('formulation', formulation)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.formulation === formulation
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  {formulation}
                </button>
              ))}
            </div>

            {formData.formulation === 'Outro' && (
              <input
                type="text"
                value={formData.formulationOther}
                onChange={(e) => updateFormData('formulationOther', e.target.value)}
                placeholder="Especifique..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
            )}
          </div>
        )

      // Tela de Incentivo 1
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5AAE45] to-[#4a9d38] rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860]">
                Estamos quase lá! 💪
              </h2>
              <p className="text-xl text-gray-600">
                Suas respostas são essenciais para um tratamento eficaz
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white rounded-2xl p-8 text-center">
              <p className="text-lg leading-relaxed">
                Você está fazendo um ótimo trabalho! Continue respondendo para que possamos personalizar ainda mais seu acompanhamento.
              </p>
            </div>
          </div>
        )

      // Etapa 7: Frequência de Uso
      case 7:
        const frequencies = [
          'Uma vez ao dia', 'Duas vezes por dia', 'Três vezes por dia',
          'Quatro vezes por dia', 'Cinco ou mais vezes por dia',
          'Uma vez a cada 2 dias', 'Uma vez a cada 3 dias',
          'Uma vez por semana', 'Ainda em adaptação'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Calendar className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Com que frequência você usa o medicamento?
              </h2>
            </div>

            <div className="space-y-3">
              {frequencies.map((freq) => (
                <button
                  key={freq}
                  onClick={() => updateFormData('frequency', freq)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.frequency === freq
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        )

      // Etapa 8: Tipo de Dose
      case 8:
        const doseTypes = ['Gotas', 'ml', 'mg', 'Gomas', 'Pump', 'Fita', 'Outro']
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Pill className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Que tipo de dose você utiliza?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {doseTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFormData('doseType', type)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.doseType === type
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {formData.doseType === 'Outro' && (
              <input
                type="text"
                value={formData.doseTypeOther}
                onChange={(e) => updateFormData('doseTypeOther', e.target.value)}
                placeholder="Especifique..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
            )}
          </div>
        )

      // Etapa 9: Quantidade por Dose
      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Scale className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Qual a quantidade utilizada por dose?
              </h2>
            </div>

            <div>
              <input
                type="number"
                step="0.1"
                value={formData.doseAmount}
                onChange={(e) => updateFormData('doseAmount', e.target.value)}
                placeholder="Ex: 2.5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors text-center text-2xl font-semibold"
              />
              <p className="text-center text-gray-500 mt-2">
                {formData.doseType || 'unidades'}
              </p>
            </div>
          </div>
        )

      // Etapa 10: Dados Pessoais
      case 10:
        const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
        const months = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]
        const years = Array.from({ length: 107 }, (_, i) => String(2026 - i))
        
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Dados Pessoais
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sexo biológico *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateFormData('biologicalSex', 'Masculino')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.biologicalSex === 'Masculino'
                        ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                        : 'border-gray-200 hover:border-[#445860] text-gray-700'
                    }`}
                  >
                    Masculino
                  </button>
                  <button
                    onClick={() => updateFormData('biologicalSex', 'Feminino')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.biologicalSex === 'Feminino'
                        ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                        : 'border-gray-200 hover:border-[#445860] text-gray-700'
                    }`}
                  >
                    Feminino
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de nascimento *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={formData.birthDay}
                    onChange={(e) => updateFormData('birthDay', e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                  >
                    <option value="">Dia</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => updateFormData('birthMonth', e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                  >
                    <option value="">Mês</option>
                    {months.map((month, idx) => (
                      <option key={month} value={String(idx + 1).padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthYear}
                    onChange={(e) => updateFormData('birthYear', e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                  >
                    <option value="">Ano</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      // Etapa 11: Medidas
      case 11:
        const heights = Array.from({ length: 241 }, (_, i) => String(i + 10))
        const weights = Array.from({ length: 400 }, (_, i) => String(i + 1))
        
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Scale className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Quais as suas medidas?
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <select
                  value={formData.height}
                  onChange={(e) => updateFormData('height', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                >
                  <option value="">Selecione sua altura</option>
                  {heights.map(h => <option key={h} value={h}>{h} cm</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Peso (kg) *
                </label>
                <select
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                >
                  <option value="">Selecione seu peso</option>
                  {weights.map(w => <option key={w} value={w}>{w} kg</option>)}
                </select>
              </div>
            </div>
          </div>
        )

      // Etapa 12: Nível de Atividade Física
      case 12:
        const activityLevels = [
          'Incapaz de realizar', 'Temporariamente incapaz', 'Sedentário',
          'Levemente ativo', 'Moderadamente ativo', 'Ativo', 'Muito ativo'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Activity className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Qual seu nível de atividade física?
              </h2>
            </div>

            <div className="space-y-3">
              {activityLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => updateFormData('activityLevel', level)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.activityLevel === level
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )

      // Tela de Incentivo 2
      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5AAE45] to-[#4a9d38] rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860]">
                Estamos chegando ao final!
              </h2>
              <p className="text-xl text-gray-600">
                Sua saúde é prioridade para nós
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white rounded-2xl p-8 text-center">
              <p className="text-lg leading-relaxed">
                Falta pouco! As últimas perguntas nos ajudarão a entender melhor sua jornada e oferecer o melhor suporte possível.
              </p>
            </div>
          </div>
        )

      // Etapa 13: Motivação Pessoal
      case 14:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MessageSquare className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Sua História
              </h2>
              <p className="text-gray-600">
                Escreva com suas próprias palavras o que te fez procurar o tratamento com Cannabis
              </p>
            </div>

            <textarea
              value={formData.personalMotivation}
              onChange={(e) => updateFormData('personalMotivation', e.target.value)}
              placeholder="Compartilhe sua história conosco..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors resize-none"
            />
          </div>
        )

      // Etapa 14: Efeitos Colaterais
      case 15:
        const sideEffects = [
          'Sonolência', 'Boca seca', 'Tontura', 'Alterações cognitivas leves',
          'Ansiedade ou agitação', 'Taquicardia', 'Náusea',
          'Desconforto gastrointestinal', 'Alteração de humor',
          'Queda de pressão', 'Outro'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <AlertCircle className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Quais efeitos colaterais você já sentiu?
              </h2>
              <p className="text-gray-600">Escolha as opções que se aplicam</p>
            </div>

            <div className="space-y-3">
              {sideEffects.map((effect) => (
                <button
                  key={effect}
                  onClick={() => toggleArrayItem('sideEffects', effect)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.sideEffects.includes(effect)
                      ? 'border-[#5AAE45] bg-green-50 text-[#5AAE45] font-semibold'
                      : 'border-gray-200 hover:border-[#445860] text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.sideEffects.includes(effect)
                        ? 'border-[#5AAE45] bg-[#5AAE45]'
                        : 'border-gray-300'
                    }`}>
                      {formData.sideEffects.includes(effect) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {effect}
                  </div>
                </button>
              ))}
            </div>

            {formData.sideEffects.includes('Outro') && (
              <input
                type="text"
                value={formData.sideEffectsOther}
                onChange={(e) => updateFormData('sideEffectsOther', e.target.value)}
                placeholder="Especifique outros efeitos..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
              />
            )}
          </div>
        )

      // Etapa 15: Principal Motivo do Tratamento
      case 16:
        const timePeriods = [
          'Alguns dias', 'Algumas semanas', 'Até 3 meses', 'Entre 3 e 6 meses',
          'Entre 6 e 12 meses', 'Mais de um ano', 'Entre 1 e 3 anos',
          'Entre 3 e 5 anos', 'Entre 5 e 10 anos', 'Entre 10 e 20 anos',
          'Há mais de 20 anos'
        ]
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Foco Principal
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dos motivos que você selecionou, qual é o principal? *
                </label>
                <input
                  type="text"
                  value={formData.mainReason}
                  onChange={(e) => updateFormData('mainReason', e.target.value)}
                  placeholder="Digite o motivo principal"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qual é a intensidade do seu sintoma? *
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.symptomIntensity}
                    onChange={(e) => updateFormData('symptomIntensity', parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5AAE45]"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1 (menos intenso)</span>
                    <span className="text-2xl font-bold text-[#5AAE45]">{formData.symptomIntensity}</span>
                    <span>10 (mais intenso)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Há quanto tempo vive com isso? *
                </label>
                <select
                  value={formData.timeLiving}
                  onChange={(e) => updateFormData('timeLiving', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                >
                  <option value="">Selecione o período</option>
                  {timePeriods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      // Tela de Fechamento
      case 17:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5AAE45] to-[#4a9d38] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860]">
                Parabéns por chegar até aqui!
              </h2>
              <p className="text-xl text-gray-600">
                Seu esforço vale a pena para a sua saúde
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white rounded-2xl p-8 text-center">
              <p className="text-lg leading-relaxed">
                Você completou todas as etapas! Agora só falta mais uma informação opcional.
              </p>
            </div>
          </div>
        )

      // Etapa 16: Código de Indicação
      case 18:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Gift className="w-16 h-16 text-[#5AAE45] mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#445860]">
                Possui um código de indicação?
              </h2>
              <p className="text-gray-600">Deixe em branco se não tiver um cupom</p>
            </div>

            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => updateFormData('referralCode', e.target.value)}
              placeholder="Digite seu código (opcional)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors text-center text-lg"
            />
          </div>
        )

      // Tela de Conclusão
      case 19:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#5AAE45] to-[#4a9d38] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#445860]">
                Seu preenchimento foi concluído! 👍
              </h2>
              <p className="text-xl text-gray-600">
                Obrigado por compartilhar suas informações
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white rounded-2xl p-8 space-y-4">
              <p className="text-lg leading-relaxed text-center">
                Agora você pode acompanhar o progresso do seu tratamento!
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm">Completo</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold">{totalSteps}</div>
                  <div className="text-sm">Etapas</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setScreen('login')
                setCurrentStep(0)
              }}
              className="w-full bg-white border-2 border-[#5AAE45] text-[#5AAE45] py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-300 hover:scale-[1.02]"
            >
              Voltar ao Início
            </button>
          </div>
        )

      default:
        return null
    }
  }

  // Renderização do Questionário
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header com Progresso */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Image 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/7ddfae3d-7621-4fa3-8511-d4c5d3ddd754.png"
              alt="MyKana"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </div>
          
          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">
                Etapa {currentStep + 1} de {totalSteps + 4}
              </span>
              <span className="font-semibold text-[#5AAE45]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Questionário */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 sm:p-8">
            {renderQuestionnaireStep()}
          </div>

          {/* Botões de Navegação */}
          <div className="flex gap-4 mt-6">
            {currentStep > 0 && currentStep < 20 && (
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            
            {currentStep < 19 && (
              <button
                onClick={nextStep}
                className="flex-1 bg-[#5AAE45] text-white py-4 rounded-xl font-semibold hover:bg-[#4a9d38] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {currentStep === 18 ? 'Finalizar' : 'Continuar'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
