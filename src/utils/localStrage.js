import Crypto from './crypto'

function setProjectSettings (data) {
    localStorage.setItem('project_settings', Crypto.encrypt(JSON.stringify(data)))
}
function getProjectSettings () {
    return JSON.parse(Crypto.decrypt(localStorage.getItem('project_settings') || '') || '[]')
}
function setToken (data) {
    localStorage.setItem('token', Crypto.encrypt(JSON.stringify(data)))
}
function getToken () {
    return JSON.parse(Crypto.decrypt(localStorage.getItem('token') || '') || '{}')
}

export default {
    setProjectSettings,
    getProjectSettings,
    setToken,
    getToken
}
