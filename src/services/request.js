import axios from 'axios'
import { removeFromLocal, getCookie, setCookie } from '../utils/storage/index'
const REACT_APP_BASE_URL = 'https://34.171.58.92:8080'

const getHeaders = () => {
  return {
    Authorization: 'Bearer' + ' ' + sessionStorage.getItem('token')
  }
}

export const request = async (url) => {
  try {
    const data = await axios['get'](url)
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err.response
      })
    if (!data) {
      throw Error('Empty data from get settings')
    }
    if (data && data['data'] && data['data']['error'] == 'Unauthorized' || data && data["statusText"] == 'Unauthorized') {
      logoutFromMicrosoft()
    } else {
      let value = getCookie('token') || ''
      setCookie('token', value, 360)
    }
    return data
  } catch (error) {
    return error
  }
}

export const requestPdf = async (url) => {
  try {
    const data = await axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err.response
      })
    if (!data) {
      throw Error('Empty data from get settings')
    }
    if (data && data['data'] && data['data']['error'] == 'Unauthorized' || data && data["statusText"] == 'Unauthorized') {
      logoutFromMicrosoft()
    } else {
      let value = getCookie('token') || ''
      setCookie('token', value, 360)
    }
    return data
  } catch (error) {
    return error
  }
}

export const requestPost = async (url, formData = {}, method = 'post', reqHeaders) => {
  try {
    const data = await axios[method](url, formData, {
     // headers: { ...getHeaders(), ...reqHeaders }
     headers: {
      //token: localStorage.getItem("msal.ba6f6865-88a9-43b7-ac2b-b002b3168225.idtoken") //client id
     token: getCookie('token')
     }
    
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err.response
      })
    if (data && data['data'] && data['data']['error'] == 'Unauthorized' || data && data["statusText"] == 'Unauthorized') {
      logoutFromMicrosoft()
    } else {
      let value = getCookie('token') || ''
      setCookie('token', value, 360)
    }
    return data
  } catch (error) {
    return error
  }
}

export const loginRequest = async (data) => {
  try {
    return await axios.post(`${REACT_APP_BASE_URL}/global-config/config-ui-login`, data)
  } catch (error) {
    return error
  }
}

export const configRequest = async (url, action, formData) => {
  try {
    const data = await axios[action](`${REACT_APP_BASE_URL}/${url} `, formData, {
      headers: getHeaders()
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err.response
      })
    if (data && data['data'] && data['data']['error'] == 'Unauthorized' || data && data["statusText"] == 'Unauthorized') {
      logoutFromMicrosoft()
    } else {
      let value = getCookie('token') || ''
      setCookie('token', value, 360)
    }
    return data
  } catch (error) {
    return error
  }
}

export const requestDelete = async (url, action) => {
  try {
    const data = await axios[action](url, {
      headers: getHeaders()
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err.response
      })
    if (data && data['data'] && data['data']['error'] == 'Unauthorized' || data && data["statusText"] == 'Unauthorized') {
      logoutFromMicrosoft()
    } else {
      let value = getCookie('token') || ''
      setCookie('token', value, 360)
    }
    return data
  } catch (error) {
    return error
  }
}

export const createRequest = async (url, action, formData, id) => {
  const idString = id ? `/${id}` : ''
  try {
    const data = await axios[action](`${url}${idString}`, formData, {
      headers: getHeaders()
    })
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err.response
      })
    if (data && data['data'] && data['data']['error'] == 'Unauthorized' || data && data["statusText"] == 'Unauthorized') {
      logoutFromMicrosoft()
    } else {
      let value = getCookie('token') || ''
      setCookie('token', value, 360)
    }
    return data
  } catch (error) {
    return error
  }
}

const logoutFromMicrosoft = () => {
  removeFromLocal('user_loged_in')
  removeFromLocal('userName')
  sessionStorage.clear()
  const url = window.location.origin || ''
  redirectionToBaseUrl(url)
}

const redirectionToBaseUrl = () => {
  window.location.href = '/'
}
