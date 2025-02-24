"use client"

import LeftSection from "../../../components/SessionPageComponents/left-section"
import MiddleSection from "../../../components/SessionPageComponents/middle-section"
import RightSection from "../../../components/SessionPageComponents/right-section"
import { Button } from "../../../components/ui/button"
import { AppProvider } from "../../../context/AppContext"

export default function Home() {

  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <header className="flex items-center justify-end p-4 bg-gray-900 text-white">
          <Button onClick={() => {window.location.reload()}} variant="destructive">Exit</Button>
        </header>

        <main className="container grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mx-auto">
          <LeftSection />
          <MiddleSection />
          <RightSection />
        </main>
      </div>
    </AppProvider>
  )
}

