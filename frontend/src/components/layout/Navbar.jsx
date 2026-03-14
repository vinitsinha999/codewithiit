/**
 * src/components/layout/Navbar.jsx
 * Updated to show logged-in user and logout button.
 */

import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <span className="font-bold text-white text-lg">
            Code <span className="text-magic-light">with IIT</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/learn" className="text-gray-300 hover:text-white transition-colors text-sm">
            Quests
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
                <span className="text-magic-light text-sm">✦</span>
                <span className="text-white text-sm font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-4 py-2 rounded-lg text-white font-medium"
              >
                Start Quest
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
