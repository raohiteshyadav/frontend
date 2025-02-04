import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <homeContainer>
      <Title>Employee Dashboard</Title>
      <ButtonContainer>
        <Button onClick={() => navigate("/service-request")}>
          Service Request
        </Button>
        <Button onClick={() => navigate("/incident-request")}>
          Incident Request
        </Button>
      </ButtonContainer>
    </homeContainer>
  );
};

const homeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  height: 100vh;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  color: #333;
  margin-top: 0px;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background-color: rgb(0,0,0);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #007bff;
    transform: scale(1.2);
  }

  &:focus {
    outline: none;
  }
`;

export default Home;
