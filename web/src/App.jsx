import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f172a', 
              color: '#f1f5f9', 
              border: '1px solid rgba(99, 102, 241, 0.4)', 
              borderRadius: '0.75rem',
              fontSize: '0.75rem', 
              fontWeight: '500', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
            },
            success: {
              style: {
                border: '1px solid rgba(16, 185, 129, 0.4)', 
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#0f172a',
              },
            },
            error: {
              style: {
                border: '1px solid rgba(244, 63, 94, 0.4)',
              },
              iconTheme: {
                primary: '#f43f5e',
                secondary: '#0f172a',
              },
            },
          }}
        />

        <AppRoutes />
      </div>
    </>
  );
}

export default App;