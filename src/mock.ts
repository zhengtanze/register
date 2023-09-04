
import { config } from './utils/Api';

import Mock from 'mockjs';
const { apiBase } = config;

const wrap = (data: any) => ({ errcode: 0, result: data })

const Random = Mock.Random;

//全局延时，如果不延时可能会检测不到数据变化
Mock.setup({
    timeout: '300-600'
})

interface FeedBackModel {
    code: number,
    msg?: string,
    data?: object
}

const feedbackFailed = (msg?: string): FeedBackModel => {
    return { code: 0, msg }
}

const parseBody = (request: any) => {
    return JSON.parse(request.body);
}

// 获取用户信息列表
function getList() {
    // 获取数据从 localStorage 中拉取数据
    var userlist = JSON.parse(localStorage.getItem('userlist') || '[]')
    return userlist;
}

// 获取单个用户信息
function getUser(request: any) {
    const { id } = parseBody(request);

    if (!id) {
        return feedbackFailed('无效的userId')
    }

    var userlist = JSON.parse(localStorage.getItem('userlist') || '[]')
    const user = userlist.find((it: USER.User) => it.id == id)

    if (!user) {
        return feedbackFailed('不能获取的userId')
    }
    return user;
}

// 删除用户信息
function deleteUser(request: string) {
    const { id } = parseBody(request);

    if (!id) {
        return feedbackFailed('无效的userId')
    }

    var userlist = JSON.parse(localStorage.getItem('userlist') || '[]');
    const _user = userlist.find((it: USER.User) => it.id == id);

    if (!_user) {
        return feedbackFailed('不能获取的userId')
    }

    userlist.splice(userlist.indexOf(_user), 1);
    localStorage.setItem('userlist', JSON.stringify(userlist));
}

// 添加用户信息
function addUser(request: any) {
    const { user } = parseBody(request);
    var userlist = JSON.parse(localStorage.getItem('userlist') || '[]')
    // 随机生成一个 id
    user.id = Random.id()
    user.createdAt = new Date();
    userlist.unshift(user)
    localStorage.setItem('userlist', JSON.stringify(userlist))
}

// 更新用户信息
function updateUser(request: any) {
    const { user } = parseBody(request);
    var userlist = JSON.parse(localStorage.getItem('userlist') || '[]')
    const _user = userlist.find((it: USER.User) => it.id == user.id)

    if (!_user) {
        return feedbackFailed('无效的user.id');
    } else {
        userlist[userlist.indexOf(_user)] = { ...user }
        localStorage.setItem('userlist', JSON.stringify(userlist))
    }
}

// 制作各个接口
Mock.mock(apiBase + 'getlist', 'post', wrap(getList))
Mock.mock(apiBase + 'getuser', 'post', (template) => wrap(getUser(template)))
Mock.mock(apiBase + 'deleteuser', 'post', deleteUser)
Mock.mock(apiBase + 'adduser', 'post', addUser)
Mock.mock(apiBase + 'updateuser', 'post', updateUser)


export default Mock;