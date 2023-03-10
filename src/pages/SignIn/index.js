import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoMarkGithub } from 'react-icons/go';
import AuthLayout from '../../layouts/Auth';
import qs from 'query-string';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Link from '../../components/Link';
import { Row, Title, Label } from '../../components/Auth';

import EventInfoContext from '../../contexts/EventInfoContext';
import UserContext from '../../contexts/UserContext';

import useSignIn from '../../hooks/api/useSignIn';
import styled from 'styled-components';

import useOAuth from '../../hooks/api/useGitHubSignUp';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loadingSignIn, signIn } = useSignIn();

  const { eventInfo } = useContext(EventInfoContext);
  const { setUserData } = useContext(UserContext);

  const navigate = useNavigate();

  const { oAuthSignIn }=useOAuth();
  async function submit(event) {
    event.preventDefault();

    try {
      const userData = await signIn(email, password);
      console.log('a', userData);
      setUserData(userData);
      toast('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast('Não foi possível fazer o login!');
    }
  } 
  async function githubLogin() {
    const githubURL = 'https://github.com/login/oauth/authorize';
    const params = {
      response_type: 'code',
      scope: 'user',
      client_id: 'ebbeb7bafbc2484662c9',
      redirect_uri: 'http://localhost:3000/sign-in' 
    };
    const queryString = qs.stringify(params);
    window.location.href = `${githubURL}?${queryString}`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  useEffect(async() => {
    abacaxi();
  }, [code]); 
  
  async function abacaxi() { 
    if(code) {
      try {
        const userData = await oAuthSignIn(code);
        console.log('a', userData);
        setUserData(userData);
        toast('Login realizado com sucesso!');
        navigate('/dashboard');
      } catch (err) {
        toast('Não foi possível fazer o login!');
      }
    }
  }

  return (
    <AuthLayout background={eventInfo.backgroundImageUrl}>
      <Row>
        <img src={eventInfo.logoImageUrl} alt="Event Logo" width="60px" />
        <Title>{eventInfo.title}</Title>
      </Row>
      <Row>
        <Label>Entrar</Label>
        <form onSubmit={submit}>
          <Input label="E-mail" type="text" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Senha" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" color="primary" fullWidth disabled={loadingSignIn}>Entrar</Button>
          <Button startIcon={<GoMarkGithub />} fullWidth onClick={githubLogin}>login com github</Button>
        </form>
      </Row>
      <Row>
        <Link to="/enroll">Não possui login? Inscreva-se</Link>
      </Row>
    </AuthLayout>
  );
} 
