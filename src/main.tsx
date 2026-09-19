import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import { EditableTextsProvider } from '@/context/EditableTextsContext'
import { ImagesProvider } from '@/context/ImagesContext'
import '@/styles/global.css'
import '@/styles/admin.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <EditableTextsProvider>
        <ImagesProvider>
          <App />
        </ImagesProvider>
      </EditableTextsProvider>
    </BrowserRouter>
  </StrictMode>,
)
