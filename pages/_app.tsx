import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar/Navbar';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';
import Loader from '../components/Loader/Loader';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <main className='mt-10 mx-auto max-w-7xl px-default md:px-8'>
        {userData.loading ?
          <Loader show /> :
            <>
              <Toaster position="top-center" reverseOrder={false} />
              <Component {...pageProps} />
            </>
        }
      </main>
    </UserContext.Provider>
  )
}

// _app.js = Layout Page -> Components which are visible on every page are here
export default MyApp
