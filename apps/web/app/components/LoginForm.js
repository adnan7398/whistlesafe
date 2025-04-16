'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../i18n/client'
import { motion } from 'framer-motion'

export default function LoginForm({ role, lang }) {
  const { t } = useTranslation(lang, 'common')
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/auth/${role}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || t('auth.login_error'))
      }

      // Store token and redirect
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', role)
      router.push(`/${lang}/${role}/dashboard`)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t(`auth.${role}_login_title`)}
        </h1>
        <p className="text-gray-600">
          {t(`auth.${role}_login_subtitle`)}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.email')}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.password')}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              {t('auth.remember_me')}
            </label>
          </div>
          <a
            href={`/${lang}/auth/forgot-password`}
            className="text-sm text-primary-600 hover:text-primary-900"
          >
            {t('auth.forgot_password')}
          </a>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? t('auth.logging_in') : t('auth.login')}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t('auth.no_account')}{' '}
          <a
            href={`/${lang}/auth/${role}/signup`}
            className="text-primary-600 hover:text-primary-900"
          >
            {t('auth.sign_up')}
          </a>
        </p>
      </div>
    </motion.div>
  )
} 