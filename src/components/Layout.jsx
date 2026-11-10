import { Outlet } from 'react-router-dom'
import { ProfileProvider } from '../context/ProfileContext'
import Navbar from './Navbar'
import ReminderEngine from './chronos/ReminderEngine'

export default function Layout() {
  return (
    <ProfileProvider>
      <Navbar />
      <main className="container"><Outlet /></main>
      <ReminderEngine />
    </ProfileProvider>
  )
}
