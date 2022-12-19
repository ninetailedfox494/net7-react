import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'https://localhost:7227/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error)
    }
})

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const UrlController = {
    activity: '/Activities'
}

const Activities = {
    list: () => requests.get<Activity[]>(`${UrlController.activity}`),
    details: (id: string) => requests.get<Activity>(`${UrlController.activity}/${id}`),
    create: (activity: Activity) => requests.post<void>(`${UrlController.activity}`, activity),
    update: (activity: Activity) => requests.put<void>(`${UrlController.activity}/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`${UrlController.activity}/${id}`)
}

const agent = {
    Activities
}

export default agent;