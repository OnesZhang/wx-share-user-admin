import { addUser, updateUser, getUserInfo } from '../../api/user'

Page({
    data: {
        formData: {
            userToken: '',
            expireTime: '',
            isPlus: false,
            remark: ''
        },
        isEdit: false,
        userId: null,
        showPicker: false,
        years: [],
        months: [],
        days: [],
        hours: [],
        minutes: [],
        seconds: [],
        dateTimeArray: [0, 0, 0, 0, 0, 0], // 当前选择的日期时间索引
        tempDateTime: null // 临时存储选择的日期时间
    },

    onLoad(options) {
        this.initDateTimePicker()
        if (options.id) {
            this.setData({
                isEdit: true,
                userId: options.id
            })
            this.loadUserInfo(options.id)
        }
    },

    // 初始化日期时间选择器数据
    initDateTimePicker() {
        const date = new Date()
        const years = []
        const months = []
        const days = []
        const hours = []
        const minutes = []
        const seconds = []

        for (let i = date.getFullYear(); i <= date.getFullYear() + 10; i++) {
            years.push(i)
        }
        for (let i = 1; i <= 12; i++) {
            months.push(i.toString().padStart(2, '0'))
        }
        for (let i = 1; i <= 31; i++) {
            days.push(i.toString().padStart(2, '0'))
        }
        for (let i = 0; i < 24; i++) {
            hours.push(i.toString().padStart(2, '0'))
        }
        for (let i = 0; i < 60; i++) {
            minutes.push(i.toString().padStart(2, '0'))
            seconds.push(i.toString().padStart(2, '0'))
        }

        this.setData({
            years,
            months,
            days,
            hours,
            minutes,
            seconds
        })
    },

    // 生成UUID
    generateUUID() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
        this.setData({
            'formData.userToken': uuid
        })
    },

    // 显示日期时间选择器
    showDateTimePicker() {
        console.log('显示时间选择器');
        this.setData({
            showPicker: true
        })
    },

    // 隐藏日期时间选择器
    hideDateTimePicker() {
        console.log('隐藏时间选择器');
        this.setData({
            showPicker: false
        })
    },

    // 日期时间选择变化
    onDateTimeChange(e) {
        this.setData({
            dateTimeArray: e.detail.value
        })
    },

    // 确认日期时间选择
    confirmDateTime() {
        const { dateTimeArray, years, months, days, hours, minutes, seconds } = this.data
        const dateTime = `${years[dateTimeArray[0]]}-${months[dateTimeArray[1]]}-${days[dateTimeArray[2]]} ${hours[dateTimeArray[3]]}:${minutes[dateTimeArray[4]]}:${seconds[dateTimeArray[5]]}`

        this.setData({
            'formData.expireTime': dateTime,
            showPicker: false
        })
    },

    async loadUserInfo(id) {
        try {
            const { data } = await getUserInfo(id)

            // 转换日期格式，将'-'替换为'/'以兼容iOS
            const formattedExpireTime = data.expireTime.replace(/-/g, '/')

            this.setData({
                formData: {
                    userToken: data.userToken,
                    expireTime: data.expireTime, // 显示原始格式
                    isPlus: data.isPlus === 1,
                    remark: data.remark || ''
                }
            })

            // 设置日期时间选择器的初始值
            if (data.expireTime) {
                const date = new Date(formattedExpireTime) // 使用转换后的格式创建Date对象
                const yearIndex = this.data.years.findIndex(y => y === date.getFullYear())
                const monthIndex = date.getMonth()
                const dayIndex = date.getDate() - 1
                const hourIndex = date.getHours()
                const minuteIndex = date.getMinutes()
                const secondIndex = date.getSeconds()

                this.setData({
                    dateTimeArray: [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex, secondIndex]
                })
            }
        } catch (err) {
            console.error('加载用户信息失败:', err)
            wx.showToast({
                title: '加载用户信息失败',
                icon: 'none'
            })
        }
    },

    onInputToken(e) {
        this.setData({
            'formData.userToken': e.detail.value
        })
    },

    onDateChange(e) {
        this.setData({
            'formData.expireTime': e.detail.value
        })
    },

    onSwitchPlus(e) {
        this.setData({
            'formData.isPlus': e.detail.value
        })
    },

    onInputRemark(e) {
        this.setData({
            'formData.remark': e.detail.value
        })
    },

    onCancel() {
        wx.navigateBack()
    },

    async onSubmit() {
        const { formData, isEdit, userId } = this.data

        if (!formData.userToken || !formData.expireTime) {
            wx.showToast({
                title: '请填写完整信息',
                icon: 'none'
            })
            return
        }

        // 显示loading
        wx.showLoading({
            title: isEdit ? '更新中...' : '添加中...',
            mask: true // 添加蒙层防止重复点击
        })

        try {
            const submitData = {
                ...formData,
                isPlus: formData.isPlus ? 1 : 0
            }

            if (isEdit) {
                submitData.id = userId
                await updateUser(submitData)
            } else {
                await addUser(submitData)
            }

            // 隐藏loading
            wx.hideLoading()

            wx.showToast({
                title: isEdit ? '更新成功' : '添加成功',
                icon: 'success'
            })

            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]
            prevPage.loadUserList()

            setTimeout(() => {
                wx.navigateBack()
            }, 1500)
        } catch (err) {
            // 发生错误时也要隐藏loading
            wx.hideLoading()
            
            console.error(err)
            wx.showToast({
                title: err.message || '操作失败',
                icon: 'none'
            })
        }
    },

    // 添加一个工具方法来处理日期格式转换
    formatDateForIOS(dateStr) {
        return dateStr.replace(/-/g, '/')
    }
}) 