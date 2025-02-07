import { HamIcon, Menu } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContactUs from './contactus';
import { Image } from '@chakra-ui/react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate= useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
  };
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
};
useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  
  return (
    <Nav display={'flex'} ref={navbarRef}>
      <Image
      marginLeft={'auto'}
                    src='https://blackbucks-media.s3.ap-south-1.amazonaws.com/Rashmi%20group%20logo%20White%20Bar-1738846415526.png'
                    alt="Rashmi Seamless Logo"
                    maxWidth={ "170px" } 
                    height="auto" 
                    objectFit="contain"
                    display="block" 
                    mx="auto" 
                    userSelect={'none'}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    // mt={-3}
                />
      {/* <Logo>Rashmi Group</Logo> */}
      <MenuToggle onClick={toggleMenu}>
        <Menu isOpen={isMenuOpen} />
      </MenuToggle>
      <NavLinks isOpen={isMenuOpen}>
        <NavLink href="/">Home</NavLink>
        <NavLink onClick={()=> navigate('/raise-a-ticket')}>Raise A Ticket</NavLink>
        <NavLink href="#services">Approval</NavLink>
        <NavLink onClick={()=> navigate('/contact')}>Contact Us</NavLink>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  width:100%;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #333;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const MenuToggle = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Hamburger = styled.div`
  width: 25px;
  height: 25px;
  background-color: white;
  margin: 5px 0;
  transition: all 0.3s;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};

  &:nth-child(2) {
    opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
  }

  &:nth-child(3) {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    background-color: #333;
    width: 100%;
    padding: 20px;
    gap: 10px;
    box-sizing:border-box;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    color: #007bff;
  }
`;

export default Navbar;
