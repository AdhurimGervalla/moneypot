import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Loader from '../components/Loader/Loader'
import { toast } from 'react-hot-toast'
import AuthCheck from '../components/AuthCheck/AuthCheck'
import MoneyPotList from '../components/MoneyPot/MoneyPotList'

export default function Home() {
  return (
    <AuthCheck>
      <main>
          <MoneyPotList />
      </main>
    </AuthCheck>
  )
}
