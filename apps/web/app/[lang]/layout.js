import LanguageSwitcher from '../components/LanguageSwitcher'

export const generateStaticParams = async () => {
  return [
    { lang: 'en' },
    { lang: 'hi' },
    { lang: 'bn' },
    { lang: 'ta' },
    { lang: 'te' },
    { lang: 'kn' }
  ]
}

export const metadata = {
  title: 'WhistleSafe - Secure Anonymous Reporting',
  description: 'A secure platform for anonymous incident reporting and whistleblowing',
}

export default function LangLayout({ children, params }) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900">
            WhistleSafe
          </a>
          <div className="flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            <LanguageSwitcher />
          </div>
        </nav>
      </header>
      <main className="flex-grow pt-16">
        {children}
      </main>
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">WhistleSafe</h3>
              <p className="text-gray-600">
                Empowering organizations with secure and anonymous whistleblowing solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600">
                Email: info@whistlesafe.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} WhistleSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
} 