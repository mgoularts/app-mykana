'use client'

import { useState } from 'react'
import { ArrowLeft, Save, X, User, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Dados mockados do usuário
  const [formData, setFormData] = useState({
    nomeCompleto: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    dataNascimento: '1990-05-15',
    altura: '175',
    peso: '75',
    sexoBiologico: 'masculino',
    condicaoPrincipal: 'dor',
    outraCondicao: '',
    objetivoTratamento: 'Reduzir dores crônicas e melhorar qualidade do sono',
    nivelExperiencia: 'intermediario',
    utilizaOutrosMedicamentos: 'nao',
    outrosMedicamentos: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSave = () => {
    // Aqui você salvaria os dados (API, localStorage, etc.)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCancel = () => {
    // Resetar para valores originais ou voltar
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-8">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-100 py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="text-gray-600 hover:text-[#445860] transition-colors">
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
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Salvar Alterações</span>
            <span className="sm:hidden">Salvar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#445860] mb-2">
              Editar Cadastro
            </h1>
            <p className="text-gray-600">
              Atualize suas informações pessoais e preferências de tratamento
            </p>
          </div>

          {/* Mensagem de Sucesso */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Save className="w-5 h-5 text-white" />
              </div>
              <p className="text-green-800 font-semibold">
                Seu cadastro foi atualizado com sucesso!
              </p>
            </div>
          )}

          {/* Formulário */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#445860] flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <User className="w-5 h-5 text-[#5AAE45]" />
                Informações Pessoais
              </h2>

              {/* Nome Completo */}
              <div>
                <label htmlFor="nomeCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomeCompleto"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                  placeholder="Digite seu nome completo"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label htmlFor="dataNascimento" className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                />
              </div>

              {/* Altura e Peso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="altura" className="block text-sm font-semibold text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    id="altura"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label htmlFor="peso" className="block text-sm font-semibold text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                    placeholder="75"
                  />
                </div>
              </div>

              {/* Sexo Biológico */}
              <div>
                <label htmlFor="sexoBiologico" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sexo Biológico
                </label>
                <select
                  id="sexoBiologico"
                  name="sexoBiologico"
                  value={formData.sexoBiologico}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors bg-white"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="prefiro-nao-informar">Prefiro não informar</option>
                </select>
              </div>
            </div>

            {/* Informações do Tratamento */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#445860] flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <User className="w-5 h-5 text-[#5AAE45]" />
                Informações do Tratamento
              </h2>

              {/* Condição Principal */}
              <div>
                <label htmlFor="condicaoPrincipal" className="block text-sm font-semibold text-gray-700 mb-2">
                  Condição Principal
                </label>
                <select
                  id="condicaoPrincipal"
                  name="condicaoPrincipal"
                  value={formData.condicaoPrincipal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors bg-white"
                >
                  <option value="dor">Dor Crônica</option>
                  <option value="ansiedade">Ansiedade</option>
                  <option value="sono">Distúrbios do Sono</option>
                  <option value="depressao">Depressão</option>
                  <option value="epilepsia">Epilepsia</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Campo condicional para "Outro" */}
              {formData.condicaoPrincipal === 'outro' && (
                <div>
                  <label htmlFor="outraCondicao" className="block text-sm font-semibold text-gray-700 mb-2">
                    Especifique a condição principal
                  </label>
                  <input
                    type="text"
                    id="outraCondicao"
                    name="outraCondicao"
                    value={formData.outraCondicao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors"
                    placeholder="Digite qual condição você está tratando"
                  />
                </div>
              )}

              {/* Objetivo do Tratamento */}
              <div>
                <label htmlFor="objetivoTratamento" className="block text-sm font-semibold text-gray-700 mb-2">
                  Objetivo do Tratamento
                </label>
                <textarea
                  id="objetivoTratamento"
                  name="objetivoTratamento"
                  value={formData.objetivoTratamento}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors resize-none"
                  placeholder="Descreva seus objetivos com o tratamento"
                />
              </div>

              {/* Nível de Experiência */}
              <div>
                <label htmlFor="nivelExperiencia" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nível de Experiência com Cannabis Medicinal
                </label>
                <select
                  id="nivelExperiencia"
                  name="nivelExperiencia"
                  value={formData.nivelExperiencia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors bg-white"
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              {/* Outros Medicamentos */}
              <div>
                <label htmlFor="utilizaOutrosMedicamentos" className="block text-sm font-semibold text-gray-700 mb-2">
                  Você utiliza outros medicamentos?
                </label>
                <select
                  id="utilizaOutrosMedicamentos"
                  name="utilizaOutrosMedicamentos"
                  value={formData.utilizaOutrosMedicamentos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors bg-white"
                >
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>

              {/* Campo condicional para outros medicamentos */}
              {formData.utilizaOutrosMedicamentos === 'sim' && (
                <div>
                  <label htmlFor="outrosMedicamentos" className="block text-sm font-semibold text-gray-700 mb-2">
                    Quais medicamentos você utiliza?
                  </label>
                  <textarea
                    id="outrosMedicamentos"
                    name="outrosMedicamentos"
                    value={formData.outrosMedicamentos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#5AAE45] focus:outline-none transition-colors resize-none"
                    placeholder="Liste os medicamentos separados por vírgula (ex: Paracetamol, Ibuprofeno, Omeprazol)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe os medicamentos por vírgula</p>
                </div>
              )}
            </div>

            {/* Alteração de Senha */}
            <div className="pt-4 border-t-2 border-gray-200">
              <Link href="/profile/change-password">
                <button className="flex items-center gap-2 text-[#5AAE45] hover:text-[#4a9d38] font-semibold transition-colors">
                  <Lock className="w-5 h-5" />
                  Clique aqui para alterar a sua senha
                </button>
              </Link>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
