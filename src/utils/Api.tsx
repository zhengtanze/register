import { message } from 'antd';
import axios from 'axios';

const configs = {
    dev: {
        apiBase: 'http://mock.xxxx.cn/'
    },
};

let config = configs['dev'];

axios.defaults.timeout = 10000;

// 请求前拦截
axios.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        // message.error("请求超时");
        return Promise.reject(err);
    }
);
// 返回后拦截
axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        return Promise.reject(err);
    }
);

const Api = {
    myPost: (path: string, params?: Record<string, any>, options?: {
        defaultErrProcess: boolean
    }) => {

        let { defaultErrProcess = true } = options || {};
        params = params || {};
        let url = config.apiBase + path;
        console.log(url)

        return new Promise((resolve, reject) => {

            let errFn = reject;
            if (defaultErrProcess) {
                errFn = (ret) => {
                    let { errcode, errmsg } = ret;
                    if (errcode === 5) {
                        message.error('未登录');
                        //TODO redirect to signin page
                    } else {
                        message.error(errmsg);
                    }
                    reject(ret);
                };
            }

            axios.post(url, params).then((response) => {
                let { data = {} } = response;
                let { result = {}, errcode }: any = data;
                if (errcode) {
                    errFn(data);
                } else {
                    resolve(result);
                }
            }).catch((err = {}) => {
                reject(err);
            });

        });
    }
}
export { config };
export default Api;
