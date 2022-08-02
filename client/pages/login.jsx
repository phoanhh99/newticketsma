import axios from 'axios'
import Cookies from 'js-cookie'
import Head from 'next/head'
import Router from 'next/router'
import {useEffect, useState} from 'react'
import {Button, Card, Col, Form, InputGroup, Row} from 'react-bootstrap'
import Swal from 'sweetalert2'
const SWAL_FAIL_OPTION = {
    position: 'center',
    icon: 'error',
    backdrop: true,
    showConfirmButton: true,
    allowOutsideClick: false,
    width: '20rem',
  },
  SWAL_SUCCESS_OPTION = {
    position: 'center',
    icon: 'success',
    backdrop: true,
    showConfirmButton: true,
    allowOutsideClick: false,
    width: '20rem',
    timer: 3000,
  }

export async function getServerSideProps({req, res}) {
  let cookies = {}
  const cookiesArray = req.headers?.cookie?.split(';')
  cookiesArray.forEach(cookie => {
    const [key, value] = cookie.trim().split('=')
    cookies[key] = value
  })
  const jwtCookie = cookies['JwtToken']
  const result = await axios.get('/login', {
    baseURL: 'http://localhost:5000/api',
    headers: jwtCookie && {
      authorization: `Bearer ${jwtCookie}`,
    },
    withCredentials: true,
  })
  if (result.data.hasToken) {
    return {
      redirect: {
        destination: '/cases',
        permanent: true,
      },
    }
  } else if (result.data.fail) {
    return {
      props: {
        Errormessage: result.data.fail,
      },
    }
  }
  return {
    props: {},
  }
}

const LoginPage = ({Errormessage}) => {
  const [isLoading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    isRemember: true,
  })
  const [isVisible, setVisibility] = useState(false)
  const togglePasswordVisibility = () => setVisibility(!isVisible)
  const handleSubmitForm = event => {
    event.preventDefault()
    setLoading(true)
  }
  axios.defaults.baseURL = 'http://localhost:5000/api'
  useEffect(async () => {
    if (isLoading) {
      const data = {
        username: formData.username,
        password: formData.password,
      }
      const result = await axios.post('/login', data)
      setLoading(false)
      if (result.data.type.toLowerCase() === 'fail') {
        Swal.fire({
          ...SWAL_FAIL_OPTION,
          text: result.data.message,
        })
      } else {
        Cookies.set('JwtToken', result.data.jwttoken)
        Swal.fire({
          ...SWAL_SUCCESS_OPTION,
          showConfirmButton: false,
          text: result.data.message,
        }).then(rs => {
          if (rs.isConfirmed || rs.isDismissed) {
            Router.push('/cases')
          }
        })
      }
    }
  }, [isLoading])

  useEffect(() => {
    if (Errormessage) {
      Cookies.remove('JwtToken')
      Swal.fire({
        position: 'bottom-end',
        toast: true,
        icon: 'error',
        titleText: Errormessage,
        showConfirmButton: false,
        showCloseButton: true,
        color: 'crimson',
      })
    }
  }, [])

  return (
    <div className='customLoginPage'>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className='login-box'>
        <Card className='login-card'>
          <Card.Header as='h1' className='text-center user-select-none '>
            <b>IFC</b>
          </Card.Header>
          <Card.Body>
            <Form
              noValidate
              className='my-2'
              onSubmit={!isLoading ? handleSubmitForm : null}
            >
              <Row>
                <Col lg={12} md={12}>
                  <Form.Group className='mb-3' controlId='formEmail'>
                    <InputGroup className='mb-2'>
                      <Form.Control
                        type='text'
                        placeholder='Tài khoản'
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        autoComplete='off'
                      />
                      <InputGroup.Text>
                        <i className='fas fa-user-alt'></i>
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Text className='text-danger'></Form.Text>
                  </Form.Group>
                </Col>
                <Col lg={12} md={12}>
                  <Form.Group className='mb-3' controlId='formPassword'>
                    <InputGroup className='mb-3'>
                      <Form.Control
                        type={isVisible ? 'text' : 'password'}
                        placeholder={isVisible ? 'avacadabra' : '*********'}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        autoComplete='off'
                      />
                      <InputGroup.Text
                        onClick={togglePasswordVisibility}
                        className='clickable-icon'
                      >
                        {isVisible ? (
                          <i className='fas fa-lock-open-alt'></i>
                        ) : (
                          <i className='fas fa-lock-alt'></i>
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Text className='text-danger'></Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col>
                  <div className='icheck-greensea'>
                    <input
                      checked={formData.isRemember}
                      type='checkbox'
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          isRemember: e.target.checked,
                        }))
                      }
                      id='remember-me'
                    />
                    <label htmlFor='remember-me' className='text-sm'>
                      Nhớ mật khẩu?
                    </label>
                  </div>
                </Col>
                <Col>
                  <div className='d-grid gap-2'>
                    <Button
                      variant='primary'
                      disabled={isLoading}
                      type='submit'
                    >
                      {isLoading ? (
                        <i className='fal fa-spinner-third fa-spin'></i>
                      ) : (
                        'Đăng nhập'
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <style jsx global>{`
        .customLoginPage {
          -ms-flex-align: center;
          align-items: center;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-direction: column;
          flex-direction: column;
          height: 100vh;
          -ms-flex-pack: center;
          justify-content: center;
          background: #0f2027;
          background: -webkit-linear-gradient(
            to right,
            #2c5364,
            #203a43,
            #0f2027
          );
          background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
        }
        .login-box {
          width: 360px;
        }
        .login-card {
          border-top: 3px solid #20c997 !important;
        }
        .clickable-icon {
          cursor: pointer;
        }
        .input-group-text {
          width: 2.7rem;
        }
      `}</style>
    </div>
  )
}
export default LoginPage
