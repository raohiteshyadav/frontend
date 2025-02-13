import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  //Spinner,
  useToast,
} from "@chakra-ui/react";
const apiIp = process.env.REACT_APP_API_IP;
const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${apiIp}:3000/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");
      setShowOtp(true);
    } catch (err) {
    //    toast({
    //      title: "Error",
    //      description: "Failed to send OTP. Please try again.",
    //      status: "error",
    //      duration: 3000,
    //      isClosable: true,
    //    });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://${apiIp}:3000/user/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, passkey: otp }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/raise-a-ticket");
    } catch (err) {
       toast({
         title: "Error",
         description: "Invalid OTP. Please try again.",
         status: "error",
         duration: 3000,
         isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/raise-a-ticket");
  }, [navigate]);

  return (
    <Box
      minH="85vh"
      mt={'auto'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" w="full" maxW="md">
        <Text fontSize={"xl"} textAlign="center" mb={6}>
          {showOtp ? "Enter OTP" : "Login"}
        </Text>

        <form onSubmit={showOtp ? handleOtpSubmit : handleEmailSubmit}>
          <Stack spacing={4}>
            {!showOtp ? (
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Mail size={20} />
                </InputLeftElement>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>
            ) : (
              <>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Mail size={20} />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    onDoubleClick={() => setShowOtp(false)}
                    placeholder="Enter your email"
                    color="gray.500"
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Lock size={20} />
                  </InputLeftElement>
                  <Input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 4-digit OTP"
                    required
                    maxLength={4}
                  />
                </InputGroup>
              </>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="Processing..."
              rightIcon={!loading && <ArrowRight size={16} />}
            >
              {showOtp ? "Verify OTP" : "Continue"}
            </Button>

            {showOtp && (
              <Button variant="outline" onClick={() => setShowOtp(false)}>
                Back to Email
              </Button>
            )}
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
