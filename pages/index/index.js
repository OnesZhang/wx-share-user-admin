// index.js
import { getUserList, addUser, updateUser, deleteUser } from '../../api/user'

Page({
  data: {
    userList: [],
    pagination: {
      page: 1,
      size: 20,
      total: 0
    },
    keyWord: '',
    pageSizes: [10, 20, 30, 50],
    pageSizeIndex: 1,
    maxPage: 1,
    showAddModal: false,  // 控制添加/编辑弹窗显示
    editingUser: null,    // 当前编辑的用户数据
    hideAddBtn: false,
    listPaddingBottom: 0 // 新增用于底部padding
  },

  onLoad() {
    this.loadUserList()
  },

  // 计算最大页数
  calculateMaxPage(total, size) {
    return Math.ceil(total / size) || 1
  },

  async loadUserList() {
    wx.showLoading({
      title: '加载中...'
    })
    try {
      const { data } = await getUserList({
        page: this.data.pagination.page,
        size: this.data.pagination.size,
        keyWord: this.data.keyWord
      })

      const maxPage = this.calculateMaxPage(data.pagination.total, data.pagination.size)

      this.setData({
        userList: data.list,
        pagination: data.pagination,
        maxPage
      })
    } catch (err) {
      console.error(err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 搜索
  onSearch: debounce(function (e) {
    this.setData({
      'pagination.page': 1,
      keyWord: e.detail.value
    }, () => {
      this.loadUserList()
    })
  }, 500),

  // 上一页
  prevPage() {
    console.log('点击上一页', this.data.pagination.page)
    if (this.data.pagination.page <= 1) return
    const newPage = this.data.pagination.page - 1
    this.setData({
      'pagination.page': newPage
    }, () => {
      this.loadUserList()
    })
  },

  // 下一页
  nextPage() {
    console.log('点击下一页', this.data.pagination.page)
    if (this.data.pagination.page >= this.data.maxPage) return
    const newPage = this.data.pagination.page + 1
    this.setData({
      'pagination.page': newPage
    }, () => {
      this.loadUserList()
    })
  },

  // 删除用户
  deleteUser(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除该用户吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteUser([id])
            wx.showToast({
              title: '删除成功'
            })
            this.loadUserList()
          } catch (err) {
            console.error(err)
          }
        }
      }
    })
  },

  // 切换每页显示数量
  onPageSizeChange(e) {
    const size = this.data.pageSizes[e.detail.value]
    this.setData({
      'pagination.size': size,
      'pagination.page': 1,
      pageSizeIndex: e.detail.value
    }, () => {
      this.loadUserList()
    })
  },

  // 为了适应新的底部固定分页，需要给列表添加底部padding
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('.pagination').boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        const paginationHeight = res[0].height
        this.setData({
          listPaddingBottom: paginationHeight + 20
        })
      }
    })
  },

  // 滚动到底部的处理方法
  onScrollToLower() {
    console.log('滚动到底部', this.data.pagination.page)
    // 隐藏添加按钮
    // this.setData({
    //   hideAddBtn: true
    // });
  },

  // 显示新增用户弹窗
  showAddUser() {
    wx.navigateTo({
      url: '/pages/user-form/index'
    })
  },

  // 显示编辑用户弹窗
  editUser(e) {
    const user = e.currentTarget.dataset.user
    wx.navigateTo({
      url: `/pages/user-form/index?id=${user.id}`
    })
  },

  // 处理滚动事件，判断是否在底部
  handleScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.detail
    const threshold = 50 // 设置一个阈值，防止误判
    const isBottom = scrollHeight - scrollTop - clientHeight <= threshold
    
    // 只有当状态需要改变时才调用setData
    if (this.data.hideAddBtn !== isBottom) {
        this.setData({
            hideAddBtn: isBottom
        })
    }
  },
})

// 防抖函数
function debounce(fn, delay) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}
