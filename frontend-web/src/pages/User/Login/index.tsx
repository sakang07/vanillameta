import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useAlert } from 'react-alert';
import { AuthContext } from '@/contexts/AuthContext';
import { LoadingContext } from '@/contexts/LoadingContext';
import { ReactComponent as Logo } from '@/assets/images/logo.svg';
import backgroundImage from '@/assets/images/visual-bg.png';
import Copyright from '@/components/Copyright';
import authService from '@/api/authService';

const Login = () => {
  const { setToken, userState } = useContext(AuthContext);
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const alert = useAlert();
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userPwd: '',
  });

  console.log('isLogin:', userState?.isLogin);

  useEffect(() => {
    if (userState?.isLogin) {
      navigate('/dashboard');
    }
  }, []);

  const handleChange = event => {
    event.preventDefault();
    setUserInfo(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async event => {
    event.preventDefault();
    showLoading();
    const data = {
      user_id: userInfo.userId,
      password: userInfo.userPwd,
    };
    await authService
      .signin(data)
      .then(response => {
        if (response.status === 201) {
          setToken(response.data.accessToken);
          navigate('/dashboard');
        }
      })
      .catch(error => {
        console.log(error);
        alert.error('ID 또는 비밀번호가 일치하지 않습니다.');
      })
      .finally(() => {
        hideLoading();
      });
  };

  return (
    <Box
      component="main"
      sx={{ position: 'relative', zIndex: 0, width: '100%', height: '100%', minWidth: '100vw', backgroundColor: '#f5f6f8' }}
    >
      <Box
        sx={{
          pt: '90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <RouterLink to="/">
          <Logo width="223px" height="43px" />
        </RouterLink>
        <Typography sx={{ mt: '17px', fontSize: '16px', color: '#043f84' }}>
          통합 데이터분석을 위한{' '}
          <Typography component="span" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            대시보드 리포팅 솔루션
          </Typography>
        </Typography>
        <Stack component="form" onSubmit={handleLogin} noValidate sx={{ width: '360px', mt: '56px' }} spacing="20px">
          <TextField
            label="User ID"
            name="userId"
            value={userInfo.userId}
            onChange={handleChange}
            margin="normal"
            required={true}
            fullWidth
          />
          <TextField
            label="Password"
            name="userPwd"
            value={userInfo.userPwd}
            onChange={handleChange}
            type="password"
            margin="normal"
            required={true}
            fullWidth
            sx={{ height: '36px' }}
          />
          {/*<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />*/}
          <Button type="submit" size="large" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Stack>
        <Typography
          sx={{ display: 'block', mt: '50px', fontSize: '14px', textAlign: 'center', color: '#4a4a4a' }}
          component={RouterLink}
          to="/signup"
        >
          회원가입
        </Typography>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
      <Box
        component="img"
        src={backgroundImage}
        sx={{
          position: 'fixed',
          zIndex: -1,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          width: '1024px',
          height: '608px',
        }}
      />
    </Box>
  );
};

export default Login;
