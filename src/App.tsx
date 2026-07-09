// ============================================================
// App.tsx — v5: All hooks + AchievementToast
// ============================================================
import { useBattleLoop }         from './hooks/useBattleLoop'
import { useCloudSync }          from './hooks/useCloudSync'
import { useSfx }                from './hooks/useSfx'
import { usePushNotifications }  from './hooks/usePushNotifications'
import { Header }                from './components/Header'
import { CombatZone }            from './components/CombatZone'
import { BottomMenu }            from './components/BottomMenu'
import { OfflineModal }          from './components/OfflineModal'
import { ClassSelectModal }      from './components/ClassSelectModal'
import { AchievementToast }      from './components/AchievementToast'

export default function App() {
  useBattleLoop()
  useCloudSync()
  useSfx()
  usePushNotifications()

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden max-w-md mx-auto relative">
      <OfflineModal />
      <ClassSelectModal />
      <AchievementToast />
      <Header />
      <CombatZone />
      <BottomMenu />
    </div>
  )
}
