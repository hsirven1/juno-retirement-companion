import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { LocaleProvider } from './i18n'
import { AppLayout } from './components/AppLayout'
import { OptionalAppLayout } from './components/OptionalAppLayout'
import { LandingPage } from './pages/LandingPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { RetirementMapPage } from './pages/RetirementMapPage'
import { PlanPage } from './pages/PlanPage'
import { HomePage } from './pages/HomePage'
import { DiscoverPage } from './pages/DiscoverPage'
import { CoachPage } from './pages/CoachPage'
import { ProfilePage } from './pages/ProfilePage'
import { GuidedPathPage } from './pages/GuidedPathPage'
import { SocialLifeRedirect } from './pages/SocialLifeRedirect'

export default function App() {
  return (
    <AppProvider>
      <LocaleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route
              path="/retirement-map"
              element={
                <OptionalAppLayout>
                  <RetirementMapPage />
                </OptionalAppLayout>
              }
            />
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/vie-sociale" element={<SocialLifeRedirect />} />
              <Route path="/guide/:pathId" element={<GuidedPathPage />} />
              <Route path="/coach" element={<CoachPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LocaleProvider>
    </AppProvider>
  )
}
