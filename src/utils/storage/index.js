// Save data to sessionStorage
export const setToSession = (key, value) => sessionStorage.setItem(key, value)

// Get saved data from sessionStorage
export const getFromSession = (key) => sessionStorage.getItem(key)

// Remove saved data from sessionStorage
export const removeFromSession = (key) => sessionStorage.removeItem(key)

// Remove all saved data from sessionStorage
export const clearAllFromSession = () => sessionStorage.clear()

export const setToLocal = (key, value) => localStorage.setItem(key, value)

export const getFromLocal = (key) => localStorage.getItem(key)

// Remove saved data from sessionStorage
export const removeFromLocal = (key) => localStorage.removeItem(key)

// Remove all saved data from sessionStorage
export const clearAllFromLocal = () => localStorage.clear()

export const setCookie = (cname, cvalue, exmins) => {
  const d = new Date()
  d.setTime(d.getTime() + exmins * 60 * 1000)
  let expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

export const getCookie = (cname) => {
  let name = cname + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
