import AuthCheck from '../components/AuthCheck/AuthCheck'
import Months from '../components/Months/Months'

export default function Home() {
  return (
    <AuthCheck>
      <Months />
    </AuthCheck>
  )
}
