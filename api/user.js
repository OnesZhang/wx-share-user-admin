import request from '../utils/request'

export const getUserList = (data) => {
    return request({
        url: '/adminapi/chatgpt/user/page',
        method: 'POST',
        data
    })
}

export const getUserInfo = (id) => {
    return request({
        url: '/adminapi/chatgpt/user/info',
        method: 'GET',
        data: { id }
    })
}

export const addUser = (data) => {
    return request({
        url: '/adminapi/chatgpt/user/add',
        method: 'POST',
        data
    })
}

export const updateUser = (data) => {
    return request({
        url: '/adminapi/chatgpt/user/update',
        method: 'POST',
        data
    })
}

export const deleteUser = (ids) => {
    return request({
        url: '/adminapi/chatgpt/user/delete',
        method: 'POST',
        data: { ids }
    })
} 