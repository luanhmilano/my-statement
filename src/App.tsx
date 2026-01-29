import { AuthProvider } from '@/auth/auth.provider';
import { RouterProvider } from './routes';

function App() {
  return (
    <AuthProvider>
      <RouterProvider />
    </AuthProvider>
  ) 
}

export default App
