import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Stack,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../providers/authProvider";

const Raise = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAuth();
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.49.160:3000/tickets/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setLists(data.lists);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPage);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      bg="gray.50"
      minH="100vh"
    >
      <Text fontSize={["2xl", "3xl", "4xl"]} mb={10} color="gray.700">
        Welcome to Rashmi Group
      </Text>

      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={8}
        mb={10}
        justify="center"
        align="center"
        w="full"
        maxW="900px"
      >
        <VStack
          spacing={4}
          w={{ base: "full", md: "350px" }}
          border="2px"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
          bg="white"
          shadow="lg"
          transition="all 0.3s"
          _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
        >
          <Button
            onClick={() => navigate("/incident-request")}
            w="full"
            h="70px"
            fontSize="xl"
            fontWeight="bold"
            bg="red.500"
            color="white"
            borderRadius="lg"
            _hover={{
              bg: "red.600",
              transform: "scale(1.02)",
            }}
            _active={{
              bg: "red.700",
              transform: "scale(0.98)",
            }}
            transition="all 0.2s"
          >
            Incident Request
          </Button>
          <Text
            color="red.600"
            fontSize="lg"
            fontWeight="medium"
            textAlign="center"
          >
            I have an issue!!
          </Text>
        </VStack>
        <VStack
          spacing={4}
          w={{ base: "full", md: "350px" }}
          border="2px"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
          bg="white"
          shadow="lg"
          transition="all 0.3s"
          _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
        >
          <Button
            onClick={() => navigate("/service-request")}
            w="full"
            h="70px"
            fontSize="xl"
            fontWeight="bold"
            bg="blue.500"
            color="white"
            borderRadius="lg"
            _hover={{
              bg: "blue.600",
              transform: "scale(1.02)",
            }}
            _active={{
              bg: "blue.700",
              transform: "scale(0.98)",
            }}
            transition="all 0.2s"
          >
            Service Request
          </Button>
          <Text
            color="blue.600"
            fontSize="lg"
            fontWeight="medium"
            textAlign="center"
          >
            I need something!!
          </Text>
        </VStack>

      </Stack>

      <Card
        w="full"
        maxW="1200px"
        shadow="md"
        borderRadius="xl"
        overflow="hidden"
      >
        <CardBody position="relative" pb={16}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Serial No.</Th>
                  <Th>Query</Th>
                  <Th>Created By</Th>
                  <Th>Status</Th>
                  <Th>Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.map((request) => (
                  <Tr key={request.serialNo} _hover={{ bg: "gray.50" }}>
                    <Td>{request.serialNo}</Td>
                    <Td>{request.query}</Td>
                    <Td>{request.createdBy}</Td>
                    <Td color={request.itApprovedAt ? "green.500" : "red.500"}>
                      {request.itApprovedAt ? "Resolved" : "Open"}
                    </Td>
                    <Td>{request.type}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box
            position="absolute"
            bottom={4}
            left={0}
            right={0}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={6}
          >
            <IconButton
              icon={<ChevronLeft />}
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              variant="ghost"
              colorScheme="blue"
            />
            <Text fontWeight="medium">
              Page {currentPage} of {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRight />}
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="ghost"
              colorScheme="blue"
            />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Raise;
