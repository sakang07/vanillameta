import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect } from 'react';
import instance from '@/helpers/apiHelper';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';

const useAuthAxios = () => {
  const { token, refreshToken } = useContext(AuthContext);
  const alert = useAlert();
  const navigate = useNavigate();
  let isAlreadyRefreshingToken = false;

  // 요청 interceptor
  const requestInterceptor = instance.interceptors.request.use(
    async config => {
      if (token && !config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // 응답 interceptor
  const responseInterceptor = instance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originRequest = error?.config;
      if (error?.response?.data?.data === 'accessTokenExpired' && !isAlreadyRefreshingToken) {
        // token 만료 후 첫 요청
        isAlreadyRefreshingToken = true;
        refreshToken().then(response => {
          if (response.status === 201) {
            const newToken = response.data.accessToken;
            originRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originRequest); // 최초의 요청을 반환하여 다시 호출
          } else if (response.status === 401) {
            console.log('refresh token 없음!', error);
            alert.error('로그인이 만료되었습니다.\n다시 로그인 해주세요.', {
              onClose: () => {
                navigate('/login');
              },
            });
          } else {
            return Promise.reject(error);
          }
        });
      } else {
        // token 과 관련없는 요청
        return Promise.reject(error);
      }
    },
  );

  /*
   TODO: bug fix
    1. interceptor 후 요청에 성공해도 화면에 보이지 않는 문제 있음(새로고침 시 보임)
    2. 동시에 여러 요청을 처리해야 하는 경우 interceptor가 실패한 요청마다 토큰을 재발급하는 문제
   */
  // const subscribers: ((token: string) => void)[] = [];
  //
  // // 요청 interceptor
  // const requestInterceptor = instance.interceptors.request.use(
  //     async config => {
  //       if (token) {
  //         config.headers.Authorization = `Bearer ${token}`;
  //       }
  //       return config;
  //     },
  //     error => {
  //       return Promise.reject(error);
  //     },
  // );
  //
  // // 응답 interceptor
  // const responseInterceptor = instance.interceptors.response.use(
  //     response => {
  //       return response;
  //     },
  //     async error => {
  //       const {
  //         response: { status },
  //       } = error;
  //       if (status === 401) {
  //         if (error.response.data.data === 'accessTokenExpired') {
  //           // token 만료 후 첫 요청
  //           return await resetTokenAndReattemptRequest(error);
  //         }
  //       }
  //       // token 과 관련없는 요청
  //       return Promise.reject(error);
  //       // }
  //     },
  // );
  //
  // async function resetTokenAndReattemptRequest(error) {
  //   try {
  //     const { response: errorResponse } = error;
  //
  //     // subscribers에 access token을 받은 이후 재요청할 함수 추가 (401로 실패했던)
  //     // retryOriginalRequest는 pending 상태로 있다가
  //     // access token을 받은 이후 onAccessTokenFetched가 호출될 때
  //     // access token을 넘겨 다시 axios로 요청하고
  //     // 결과값을 처음 요청했던 promise의 resolve로 settle시킨다.
  //     const retryOriginalRequest = new Promise((resolve, reject) => {
  //       addSubscriber(async accessToken => {
  //         try {
  //           errorResponse.config.headers.Authorization = accessToken;
  //           resolve(instance(errorResponse.config));
  //         } catch (err) {
  //           reject(err);
  //         }
  //       });
  //     });
  //
  //     // refresh token을 이용해서 access token 요청
  //     if (!isAlreadyRefreshingToken) {
  //       isAlreadyRefreshingToken = true; // 문닫기 (한 번만 요청)
  //
  //       // 새로운 토큰 저장
  //       const { data } = await refreshToken();
  //       // console.log('refresh token', data);
  //
  //       isAlreadyRefreshingToken = false; // 문열기 (초기화)
  //       onAccessTokenFetched(data.access);
  //     }
  //     return retryOriginalRequest; // pending 됐다가 onAccessTokenFetched가 호출될 때 resolve
  //   } catch (error) {
  //     if (error.response.data.data === 'Unauthorized') {
  //       // refresh token 만료
  //       alert.error('로그인이 만료되었습니다.\n다시 로그인 해주세요.', {
  //         onClose: () => {
  //           navigate('/login');
  //         },
  //       });
  //     }
  //     return Promise.reject(error);
  //   }
  // }
  //
  // const addSubscriber = (callback: (token: string) => void) => {
  //   subscribers.push(callback);
  // };
  //
  // const onAccessTokenFetched = (token: string) => {
  //   subscribers.forEach(callback => callback(token));
  // };

  // 추가한 interceptor 동작 종료 후에 제거
  useEffect(() => {
    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [requestInterceptor, responseInterceptor]);
};

export default useAuthAxios;
