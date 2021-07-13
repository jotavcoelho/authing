import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['authing.token']}`
  }
});

api.interceptors.response.use(
  response => { 
    return response 
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();

        const { 'authing.refreshToken': refreshToken } = cookies;

        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response.data;

          setCookie(undefined, 'authing.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 1 month
            path: '/',
          });
          
          setCookie(undefined, 'authing.refreshToken', response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 30, // 1 month
            path: '/',
          });
    
          api.defaults.headers['Authorization'] = `Bearer ${token}`;

        });
      } else {
        // log user out
      }
    }
  }  
);
