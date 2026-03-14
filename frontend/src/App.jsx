import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import HomePage from '@/pages/HomePage'
import LearnPage from '@/pages/LearnPage'
import ChapterPage from '@/pages/ChapterPage'
import DashboardPage from '@/pages/DashboardPage'
import LeaderboardPage from '@/pages/LeaderboardPage'
import { LoginPage, RegisterPage } from '@/pages/AuthPages'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"              element={<HomePage />}        />
        <Route path="/learn"         element={<LearnPage />}       />
        <Route path="/chapter/:slug" element={<ChapterPage />}     />
        <Route path="/dashboard"     element={<DashboardPage />}   />
        <Route path="/leaderboard"   element={<LeaderboardPage />} />
        <Route path="/login"         element={<LoginPage />}       />
        <Route path="/register"      element={<RegisterPage />}    />
        <Route path="*"              element={<HomePage />}        />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1530',
            color: '#f5ead8',
            border: '1px solid rgba(200,146,42,0.3)',
            fontFamily: 'Cinzel, serif',
            fontSize: '13px',
          },
        }}
      />
    </>
  )
}
