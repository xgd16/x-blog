import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios"
// 创建axios实例
const request = axios.create({
    baseURL: 'http://127.0.0.1:4523/m1/3198791-0-default',
    timeout: 1000,
});
request.interceptors.request.use(function (config:InternalAxiosRequestConfig) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
});
// 添加响应拦截器
request.interceptors.response.use(function (response: AxiosResponse) {
    console.log(response.data)
    // 成功返回时处理数据
    return response;
}, function (error) {
    // 出错时调用
    return Promise.reject(error);
});

export interface Response <T = any> {
    code: number,
    msg: string
    data: T
}

const req = async <T>(config: AxiosRequestConfig) => {
    const res = await request(config)
    return (res.data) as T
}
export default req