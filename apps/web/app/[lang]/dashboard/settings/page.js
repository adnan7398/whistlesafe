'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '../../../i18n/client'
import { motion } from 'framer-motion'

export default function SettingsPage({ params: { lang } }) {
  const { t } = useTranslation(lang, 'common')
  const [userData, setUserData] = useState({
    language: lang,
    notifications: true,
    emailUpdates: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error fetching user settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      setMessage({
        type: 'success',
        text: t('dashboard.settings_saved')
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage({
        type: 'error',
        text: t('dashboard.settings_error')
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {t('dashboard.settings')}
      </h1>

      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t('dashboard.language_settings')}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dashboard.preferred_language')}
            </label>
            <select
              name="language"
              value={userData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t('dashboard.notification_settings')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notifications"
                checked={userData.notifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                {t('dashboard.enable_notifications')}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="emailUpdates"
                checked={userData.emailUpdates}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                {t('dashboard.email_updates')}
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {saving ? t('dashboard.saving') : t('dashboard.save_changes')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
} 