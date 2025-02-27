"use client"

import LeftSection from "../../../components/SessionPageComponents/left-section"
import MiddleSection from "../../../components/SessionPageComponents/middle-section"
import RightSection from "../../../components/SessionPageComponents/right-section"
import { Button } from "../../../components/ui/button"
import { AppProvider } from "../../../context/AppContext"
import { LogOut } from "lucide-react"

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-900 text-white shadow-md">
          <h1 className="text-xl font-bold">AI Meeting Assistant</h1>
          <Button
            onClick={() => {
              window.location.reload()
            }}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Exit Session
          </Button>
        </header>

        <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-h-[calc(100vh-80px)] overflow-hidden">
          <div className="lg:col-span-4 xl:col-span-3 overflow-hidden">
            <LeftSection />
          </div>
          <div className="lg:col-span-5 xl:col-span-6 overflow-hidden">
            <MiddleSection />
          </div>
          <div className="lg:col-span-3 overflow-hidden">
            <RightSection />
          </div>
        </main>
      </div>
    </AppProvider>
  )
}

