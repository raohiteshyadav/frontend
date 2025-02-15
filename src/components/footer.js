import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const Marquee = ({ text }) => {
  // Define keyframes for the marquee effect
  const marqueeAnimation = keyframes`
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  `;

  // Add some responsive behavior for the speed
  const speed = useBreakpointValue({
    base: '200s',
    md: '100s',
    lg: '50s',
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign={'center'}
      overflow="hidden"
      width="100%"
      py={4}
      bg={'gray.100'}
    >
      <Box
        as="div"
        display="inline-block"
        whiteSpace="nowrap"
        animation={`${marqueeAnimation} ${speed} linear infinite`}
        fontSize="xl"
        fontWeight="bold"
      >
        {text}
      </Box>
    </Box>
  );
};

const Footer = () => {
  return (
    <footer>
      <Marquee text="Rashmi Group, established in 1966, is a leading business conglomerate in Eastern India, specializing in iron and steel products, cement, power generation, and ferro alloys. Their Kharagpur facility, Rashmi Metaliks Ltd., operates a blast furnace and direct reduced iron steel plant, producing products like TMT bars, billets, and ductile iron pipes." />
    </footer>
  );
};

export default Footer;
