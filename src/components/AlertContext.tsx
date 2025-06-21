"use client"

import { createContext, useContext, useState } from "react"
import { ShieldCheck, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AlertType = "success" | "error"

interface AlertData {
  type: AlertType
  title: string
  description?: string
}

interface AlertContextValue {
  showAlert: (data: AlertData) => void
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined)

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertData | null>(null)

  const showAlert = (data: AlertData) => {
    setAlert(data)
    setTimeout(() => setAlert(null), 5000)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-4 right-4 w-full max-w-md z-50 px-4">
          <Alert
            className={`border ${
              alert.type === "success"
                ? "border-green-500 bg-green-50 text-green-800"
                : "border-red-500 bg-red-50 text-red-800"
            }`}
          >
            {alert.type === "success" ? (
              <ShieldCheck className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.description && (
              <AlertDescription>{alert.description}</AlertDescription>
            )}
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  )
}
