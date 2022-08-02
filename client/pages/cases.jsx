import Cookies from 'js-cookie'
import {useRouter} from 'next/router'
import {Button} from 'react-bootstrap'

const CasesPage = () => {
  const router = useRouter()
  const HandleLogOut = async () => {
    Cookies.remove('JwtToken')
    router.push('/login')
  }
  return (
    <>
      <h3>This is a cases page</h3>
      <Button onClick={HandleLogOut}>Click to logout</Button>
    </>
  )
}

export default CasesPage
