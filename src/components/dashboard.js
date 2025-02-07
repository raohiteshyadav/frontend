import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  //const itemsPerPage = 10;

  const incidentStats = { open: 12, closed: 45 };
  const serviceStats = { open: 8, closed: 30 };

  const [lists, setLists] = useState([]);

  // const totalPages = Math.ceil(recentRequests.length / itemsPerPage);

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
      // toast({
      //     title: "Error",
      //     description: "Error Fetching list of tickets.",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={6}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
        <Card bg="blue.50">
          <CardHeader>
            <Heading size="md">Incident Requests</Heading>
          </CardHeader>
          <CardBody>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justifyContent={{ md: "space-between" }}
              align="center"
            >
              <Stat>
                <StatLabel>Open</StatLabel>
                <StatNumber color="red.500">{incidentStats.open}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Closed</StatLabel>
                <StatNumber color="green.500">
                  {incidentStats.closed}
                </StatNumber>
              </Stat>
            </Stack>
          </CardBody>
        </Card>

        <Card bg="gray.50">
          <CardHeader>
            <Heading size="md">Service Requests</Heading>
          </CardHeader>
          <CardBody>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justifyContent={{ md: "space-between" }}
              align="center"
            >
              <Stat>
                <StatLabel>Open</StatLabel>
                <StatNumber color="red.500">{serviceStats.open}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Closed</StatLabel>
                <StatNumber color="green.500">{serviceStats.closed}</StatNumber>
              </Stat>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card overflow={"hidden"}>
        <CardBody position="relative">
          {/* Table Container */}
          <Box overflowX="auto" maxWidth="100%" mb={4}>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Serial No.</Th>
                  <Th>Created At</Th>
                  <Th>Description</Th>
                  <Th>Created By</Th>
                  <Th>Status</Th>
                  <Th>Type</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.map((request) => (
                  <Tr key={request.serialNo}>
                    <Td>{request.serialNo}</Td>
                    <Td>{request.createdAt}</Td>
                    <Td>{request.query}</Td>
                    <Td>{request.createdBy}</Td>
                    <Td color={request.itApprovedAt ? "green.500" : "red.500"}>
                      {request.itApprovedAt ? "Resolved" : "Open"}
                    </Td>
                    <Td>{request.type}</Td>
                    <Td>
                      <Box display={"flex"} gap={2}>
                        <Button p={2} color={"green.400"}>
                          Resolve
                        </Button>
                        <Button color={"red.400"} p={2}>
                          Cancel
                        </Button>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box width={"full"} h={10}></Box>
        </CardBody>
        {/* Pagination and Chevron Buttons */}
        <Box
          display="flex"
          position="absolute"
          bottom={4}
          m={"auto"}
          width="full"
          justifyContent="space-between"
        >
          <IconButton
            icon={<ChevronLeft />}
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          />
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            icon={<ChevronRight />}
            isDisabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;
