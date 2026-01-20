'use client'

import { useState } from 'react'
import { ArrowLeft, Lock, Eye, EyeOff, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Limpar erro ao digitar
    setErrors({
      ...errors,
      [name]: ''
    })
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Digite sua senha atual'
      isValid = false
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Digite a nova senha'
      isValid = false
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'A senha deve ter no mínimo 6 caracteres'
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme a nova senha'
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Aqui você faria a chamada à API para alterar a senha
      setShowSuccess(true)
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-8">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-100 py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile">
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
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Título */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#445860] mb-2 flex items-center gap-3">
              <Lock className="w-8 h-8 text-[#5AAE45]" />
              Alterar Senha
            </h1>
            <p className="text-gray-600">
              Crie uma nova senha segura para sua conta
            </p>
          </div>

          {/* Mensagem de Sucesso */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-green-800 font-semibold">
                  Senha alterada com sucesso!
                </p>
                <p className="text-green-700 text-sm">
                  Redirecionando para o perfil...
                </p>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 space-y-6">
              {/* Senha Atual */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha Atual <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.currentPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#5AAE45]'
                    }`}
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* Nova Senha */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nova Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.newPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#5AAE45]'
                    }`}
                    placeholder="Digite a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">A senha deve ter no mínimo 6 caracteres</p>
              </div>

              {/* Confirmar Nova Senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Nova Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#5AAE45]'
                    }`}
                    placeholder="Confirme a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Dicas de Segurança */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Dicas para uma senha segura:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use no mínimo 6 caracteres</li>
                  <li>• Combine letras maiúsculas e minúsculas</li>
                  <li>• Inclua números e caracteres especiais</li>
                  <li>• Evite informações pessoais óbvias</li>
                </ul>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/profile" className="flex-1">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
              </Link>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5AAE45] to-[#4a9d38] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Lock className="w-5 h-5" />
                Alterar Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
