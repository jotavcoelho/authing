import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContexts';

import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
