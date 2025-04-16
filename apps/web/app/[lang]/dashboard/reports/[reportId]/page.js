'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../../../i18n/client'
import { motion } from 'framer-motion'

export default function ReportDetailsPage({ params: { lang, reportId } }) {
  const { t } = useTranslation(lang, 'common')
  const router = useRouter()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    fetchReportDetails()
  }, [reportId])

  const fetchReportDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      setReport(data.report)
      setUpdates(data.updates)
    } catch (error) {
      console.error('Error fetching report details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t('dashboard.report_not_found')}
        </h2>
        <button
          onClick={() => router.push(`/${lang}/dashboard/reports`)}
          className="text-primary-600 hover:text-primary-900"
        >
          {t('dashboard.back_to_reports')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {t('dashboard.report_details')}
        </h1>
        <button
          onClick={() => router.push(`/${lang}/dashboard/reports`)}
          className="text-primary-600 hover:text-primary-900"
        >
          {t('dashboard.back_to_reports')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t('dashboard.report_information')}
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('dashboard.report_id')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{report.reportId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('dashboard.category')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {t(`dashboard.category_${report.category}`)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('dashboard.status')}
              </dt>
              <dd className="mt-1">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : report.status === 'in-review'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {t(`dashboard.status_${report.status}`)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('dashboard.description')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{report.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('dashboard.location')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {report.location.address}
                <div className="mt-2 text-xs text-gray-500">
                  {t('dashboard.coordinates')}: {report.location.lat}, {report.location.lng}
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('dashboard.created_at')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(report.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </motion.div>

        {/* Updates Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t('dashboard.updates')}
          </h2>
          <div className="space-y-4">
            {updates.map((update, index) => (
              <div
                key={index}
                className="relative pl-8 pb-4 border-l-2 border-gray-200"
              >
                <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary-600"></div>
                <div className="text-sm text-gray-500">
                  {new Date(update.timestamp).toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-gray-900">{update.message}</div>
                {update.status && (
                  <div className="mt-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        update.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : update.status === 'in-review'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {t(`dashboard.status_${update.status}`)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 