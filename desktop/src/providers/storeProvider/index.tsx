/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Store } from 'tauri-plugin-store-api'

interface StoreContextType {
  store: Store | null,
  getItem: <T>(key: string) => Promise<T | null>,
  setItem: (key: string, value: any) => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const StoreProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    const initializeStore = async () => {
      const storeInstance = new Store('.settings.json')
      setStore(storeInstance)
    }

    initializeStore().catch(console.error);
  }, [])

  const getItem = async <T,>(key: string): Promise<T | null> => {
    if(store){
      return await store.get<T>(key)
    }
    return null
  }

  const setItem = async (key:string, value: any): Promise<void> => {
    if(store){
      await store.set(key, value)
      await store.save()
    }
  }

  return (
    <StoreContext.Provider value={{store, getItem, setItem}}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if(context === undefined){
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
