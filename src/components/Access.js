import axios from '../axios.js'
import Cookies from 'js-cookie'
export const hasAccess = async (accessToken, refreshToken) => {
    if (!refreshToken)
        return null
    else if (accessToken == undefined) {
        accessToken = await refresh(refreshToken)
        return accessToken
    }
    return accessToken
}

export const refresh = (refreshToken) => {
    console.log('refreshing..')
    const refresh = refreshToken
    return new Promise((resolve, reject) => {
        axios
            .post('/refresh', { refresh: refreshToken })
            .then(data => {
                if (data.status !== 200) {
                    console.log('Error in refreshing token')
                    resolve(false)
                }
                else {
                    const accessToken = data.data.access
                    console.log('refreshed')
                    Cookies.set('access', accessToken, { sameSite: 'strict' })
                    resolve(accessToken)
                }
            })
    })
}