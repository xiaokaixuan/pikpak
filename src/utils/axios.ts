import axios from 'axios'
import router from '../router/index'

const instance = axios.create({})

instance.interceptors.request.use(request => {
  const pikpakLogin = JSON.parse(window.localStorage.getItem('pikpakLogin') || '{}')
  if(!pikpakLogin || !pikpakLogin.access_token) {
    router.push('/login')
  }
  request.headers = {
    'Authorization': pikpakLogin.token_type + ' ' + pikpakLogin.access_token
  }
  request.url = 'https://cors.z7.workers.dev/' + request.url
  return request
})

instance.interceptors.response.use(response => {
  return response
}, (error) => {
  const { response } = error
  if(response.status) {
    switch (response.status) {
      case 401:
        router.push('/login')
        break;
      case 400:
        window.$message.error(response.data.error_description || '出错了')
      default:
        break;
    }
  }
  return Promise.reject(error)
})

export default instance