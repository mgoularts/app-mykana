// Sistema de Perfil do Paciente
// Coleta automática de dados do questionário para personalização

export interface PatientProfile {
  // Dados básicos
  id: string
  createdAt: Date
  
  // Condição Principal
  mainCondition: {
    primary: string // Principal reclamação (ex: dor, ansiedade, sono)
    secondary: string[] // Outras condições
    intensity: number // 1-10
    duration: string // Há quanto tempo vive com isso
  }
  
  // Objetivo do Tratamento
  treatmentGoal: {
    primary: string // O que espera atingir
    motivation: string // Motivação pessoal
    expectations: string[]
  }
  
  // Forma de Uso Predominante
  usageForm: {
    medicationType: string // CBD, THC, CBD+THC
    formulation: string // Óleo, gomas, vaporização, etc
    doseType: string // Gotas, mg, ml, etc
    currentDose: string
  }
  
  // Horários Típicos
  typicalSchedule: {
    frequency: string // Quantas vezes por dia
    preferredTimes: string[] // Manhã, tarde, noite
    consistency: 'regular' | 'irregular' | 'as-needed'
  }
  
  // Sensibilidade Relatada
  sensitivity: {
    sideEffects: string[] // Efeitos colaterais relatados
    tolerance: 'low' | 'medium' | 'high'
    reactions: string[]
  }
  
  // Nível de Experiência
  experienceLevel: {
    level: 'beginner' | 'intermediate' | 'experienced'
    previousUse: boolean
    knowledgeScore: number // 1-10
  }
  
  // Dados demográficos (para contexto)
  demographics: {
    age: number
    biologicalSex: string
    height: number
    weight: number
    activityLevel: string
  }
  
  // Metadados para personalização
  personalization: {
    preferredLanguageStyle: 'formal' | 'casual' | 'technical'
    notificationPreference: 'frequent' | 'moderate' | 'minimal'
    dashboardPriorities: string[] // Indicadores a destacar
  }
}

// Função para extrair perfil do questionário
export function extractProfileFromQuestionnaire(formData: any): PatientProfile {
  // Determinar condição principal
  const mainCondition = determineMainCondition(formData)
  
  // Determinar objetivo do tratamento
  const treatmentGoal = determineTreatmentGoal(formData)
  
  // Extrair forma de uso
  const usageForm = extractUsageForm(formData)
  
  // Determinar horários típicos
  const typicalSchedule = determineTypicalSchedule(formData)
  
  // Avaliar sensibilidade
  const sensitivity = assessSensitivity(formData)
  
  // Avaliar nível de experiência
  const experienceLevel = assessExperienceLevel(formData)
  
  // Extrair dados demográficos
  const demographics = extractDemographics(formData)
  
  // Gerar preferências de personalização
  const personalization = generatePersonalizationPreferences(formData, experienceLevel)
  
  return {
    id: generateProfileId(),
    createdAt: new Date(),
    mainCondition,
    treatmentGoal,
    usageForm,
    typicalSchedule,
    sensitivity,
    experienceLevel,
    demographics,
    personalization
  }
}

// Funções auxiliares de extração

function determineMainCondition(formData: any) {
  const reasons = formData.treatmentReasons || []
  const primary = formData.mainReason || reasons[0] || 'Não especificado'
  
  return {
    primary,
    secondary: reasons.filter((r: string) => r !== primary),
    intensity: formData.symptomIntensity || 5,
    duration: formData.timeLiving || 'Não especificado'
  }
}

function determineTreatmentGoal(formData: any) {
  const reasons = formData.treatmentReasons || []
  
  // Mapear razões para objetivos
  const goalMapping: Record<string, string> = {
    'Ansiedade': 'Reduzir ansiedade e melhorar bem-estar emocional',
    'Depressão': 'Melhorar humor e qualidade de vida',
    'Dor crônica': 'Aliviar dor e melhorar mobilidade',
    'Insônia': 'Melhorar qualidade do sono',
    'Epilepsia': 'Reduzir frequência de crises',
    'Autismo': 'Melhorar comunicação e comportamento',
    'Parkinson': 'Controlar sintomas motores',
    'Alzheimer': 'Preservar função cognitiva',
    'Câncer': 'Aliviar sintomas e efeitos colaterais'
  }
  
  const primary = goalMapping[reasons[0]] || 'Melhorar qualidade de vida'
  
  return {
    primary,
    motivation: formData.personalMotivation || '',
    expectations: reasons.map((r: string) => goalMapping[r] || r)
  }
}

function extractUsageForm(formData: any) {
  return {
    medicationType: formData.medicationType || 'Não especificado',
    formulation: formData.formulation || 'Não especificado',
    doseType: formData.doseType || 'Não especificado',
    currentDose: formData.doseAmount || 'Não especificado'
  }
}

function determineTypicalSchedule(formData: any) {
  const frequency = formData.frequency || 'Não especificado'
  
  // Inferir horários baseado na frequência
  let preferredTimes: string[] = []
  let consistency: 'regular' | 'irregular' | 'as-needed' = 'regular'
  
  if (frequency.includes('1x') || frequency.includes('uma vez')) {
    preferredTimes = ['Noite']
  } else if (frequency.includes('2x') || frequency.includes('duas vezes')) {
    preferredTimes = ['Manhã', 'Noite']
  } else if (frequency.includes('3x') || frequency.includes('três vezes')) {
    preferredTimes = ['Manhã', 'Tarde', 'Noite']
  } else if (frequency.includes('necessário') || frequency.includes('preciso')) {
    consistency = 'as-needed'
    preferredTimes = ['Conforme necessário']
  }
  
  return {
    frequency,
    preferredTimes,
    consistency
  }
}

function assessSensitivity(formData: any) {
  const sideEffects = formData.sideEffects || []
  
  // Determinar tolerância baseado em efeitos colaterais
  let tolerance: 'low' | 'medium' | 'high' = 'medium'
  
  if (sideEffects.length === 0) {
    tolerance = 'high'
  } else if (sideEffects.length >= 3) {
    tolerance = 'low'
  }
  
  return {
    sideEffects,
    tolerance,
    reactions: sideEffects
  }
}

function assessExperienceLevel(formData: any) {
  const medicationType = formData.medicationType || ''
  const doseAmount = formData.doseAmount || ''
  
  // Determinar nível de experiência
  let level: 'beginner' | 'intermediate' | 'experienced' = 'beginner'
  let knowledgeScore = 3
  
  // Se sabe o tipo de medicação específico
  if (medicationType && medicationType !== 'Não sei') {
    knowledgeScore += 2
    level = 'intermediate'
  }
  
  // Se sabe a dosagem exata
  if (doseAmount && doseAmount !== 'Não sei') {
    knowledgeScore += 2
    level = 'intermediate'
  }
  
  // Se conhece bem ambos
  if (knowledgeScore >= 7) {
    level = 'experienced'
  }
  
  return {
    level,
    previousUse: medicationType !== 'Não sei',
    knowledgeScore
  }
}

function extractDemographics(formData: any) {
  const birthYear = parseInt(formData.birthYear) || new Date().getFullYear()
  const age = new Date().getFullYear() - birthYear
  
  return {
    age,
    biologicalSex: formData.biologicalSex || 'Não especificado',
    height: parseFloat(formData.height) || 0,
    weight: parseFloat(formData.weight) || 0,
    activityLevel: formData.activityLevel || 'Não especificado'
  }
}

function generatePersonalizationPreferences(formData: any, experienceLevel: any) {
  // Determinar estilo de linguagem baseado no nível de experiência
  let preferredLanguageStyle: 'formal' | 'casual' | 'technical' = 'casual'
  
  if (experienceLevel.level === 'experienced') {
    preferredLanguageStyle = 'technical'
  } else if (experienceLevel.level === 'beginner') {
    preferredLanguageStyle = 'casual'
  }
  
  // Determinar preferência de notificações baseado na frequência
  const frequency = formData.frequency || ''
  let notificationPreference: 'frequent' | 'moderate' | 'minimal' = 'moderate'
  
  if (frequency.includes('3x') || frequency.includes('mais')) {
    notificationPreference = 'frequent'
  } else if (frequency.includes('necessário')) {
    notificationPreference = 'minimal'
  }
  
  // Determinar prioridades do dashboard baseado nas condições
  const reasons = formData.treatmentReasons || []
  const dashboardPriorities = reasons.slice(0, 3).map((reason: string) => {
    const priorityMapping: Record<string, string> = {
      'Ansiedade': 'Nível de Ansiedade',
      'Depressão': 'Humor',
      'Dor crônica': 'Intensidade da Dor',
      'Insônia': 'Qualidade do Sono',
      'Epilepsia': 'Frequência de Crises',
      'Autismo': 'Comportamento',
      'Parkinson': 'Sintomas Motores',
      'Alzheimer': 'Função Cognitiva',
      'Câncer': 'Sintomas Gerais'
    }
    return priorityMapping[reason] || reason
  })
  
  return {
    preferredLanguageStyle,
    notificationPreference,
    dashboardPriorities
  }
}

function generateProfileId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Funções de utilidade para usar o perfil

export function getPersonalizedGreeting(profile: PatientProfile): string {
  const { experienceLevel, mainCondition } = profile
  
  if (experienceLevel.level === 'beginner') {
    return `Olá! Vamos começar seu acompanhamento para ${mainCondition.primary.toLowerCase()}.`
  } else if (experienceLevel.level === 'intermediate') {
    return `Bem-vindo de volta! Continue acompanhando seu tratamento para ${mainCondition.primary.toLowerCase()}.`
  } else {
    return `Olá! Seu acompanhamento detalhado de ${mainCondition.primary.toLowerCase()} está pronto.`
  }
}

export function getPersonalizedNotificationTime(profile: PatientProfile): string[] {
  return profile.typicalSchedule.preferredTimes
}

export function getDashboardPriorities(profile: PatientProfile): string[] {
  return profile.personalization.dashboardPriorities
}

export function getRecommendedLanguageStyle(profile: PatientProfile): string {
  const styles = {
    formal: 'Use linguagem profissional e técnica',
    casual: 'Use linguagem amigável e acessível',
    technical: 'Use termos técnicos e detalhes científicos'
  }
  return styles[profile.personalization.preferredLanguageStyle]
}

// Salvar e carregar perfil do localStorage
export function saveProfile(profile: PatientProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('patient_profile', JSON.stringify(profile))
  }
}

export function loadProfile(): PatientProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('patient_profile')
    if (stored) {
      const profile = JSON.parse(stored)
      profile.createdAt = new Date(profile.createdAt)
      return profile
    }
  }
  return null
}

export function clearProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('patient_profile')
  }
}
