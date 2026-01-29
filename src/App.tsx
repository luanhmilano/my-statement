import { AuthProvider } from './auth/AuthProvider';
import { RouterProvider } from './routes';

function App() {
  return (
    <AuthProvider>
      <RouterProvider />
    </AuthProvider>
  ) 
}

export default App
