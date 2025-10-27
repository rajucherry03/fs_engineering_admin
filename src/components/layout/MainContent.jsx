import { Outlet } from 'react-router-dom'

const MainContent = () => {
  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="p-6">
        <Outlet />
      </div>
    </main>
  )
}

export default MainContent
