import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const RequiredSpan = styled.span`
  color: red;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: ''
  });

  const { mobileNumber, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login({ mobileNumber, password });
      navigate('/');
      alert('login successful');
    } catch (err) {
      console.error(err.message);
      alert('Login Failed');
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Label>
            Mobile Number
            <RequiredSpan>*</RequiredSpan>
          </Label>
          <Input type="text" name="mobileNumber" value={mobileNumber} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>
            Password
            <RequiredSpan>*</RequiredSpan>
          </Label>
          <Input type="password" name="password" value={password} onChange={onChange} required />
        </FormGroup>
        <Button type="submit">Login</Button>

      </Form>
      <p>Don't have an account?</p>
                <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Register
                </Link>
    </Container>
  );
};

export default Login;
