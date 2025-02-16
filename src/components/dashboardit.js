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
  CloseButton,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const UserDetailsBox = ({ userDetails, onClose }) => (
    <Box
      position="absolute"
      top="20px"
      left="20px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      bgColor="#f7fafc"
      p={4}
      boxShadow="md"
      zIndex="overlay"
    >
      <CloseButton position="absolute" top={2} right={2} onClick={onClose} />
      <Text fontWeight="bold" textAlign="center">User Details</Text>
      <Text>
  <Text as="span" fontWeight="bold">Name:</Text> {userDetails.name}
</Text>
<Text>
  <Text as="span" fontWeight="bold">Email:</Text> {userDetails.email}
</Text>
<Text>
  <Text as="span" fontWeight="bold">Employee Id:</Text> {userDetails.id}
</Text>
<Text>
  <Text as="span" fontWeight="bold">Contact No.:</Text> {userDetails.contact}
</Text>
<Text>
  <Text as="span" fontWeight="bold">Department:</Text> {userDetails.department}
</Text>
<Text>
  <Text as="span" fontWeight="bold">Reporting Manager:</Text> {userDetails.reportingTo}
</Text>
<Text>
  <Text as="span" fontWeight="bold">Role:</Text> {userDetails.role}
</Text>


      {/* Add more user details as needed */}
    </Box>
  );
const DashboardIt = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const apiIp = process.env.REACT_APP_API_IP;
  const [lists, setLists] = useState([]);
  const [userDetails,setUserDetails]= useState();
  const pageSize = 50;

  // const totalPages = Math.ceil(recentRequests.length / itemsPerPage);
  const handleRowClick = (id) => {
    navigate(`/service-request-form-dept/${id}`);
  };
  const handleCreatedBy= async(createdById) =>{
    try {const token=localStorage.getItem("token");
       const response=await axios.get(
        `http://${apiIp}:3000/user/info?id=${createdById}`,
        {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        }
       );
       const data=response.data;
       setUserDetails(data);}
       catch(err){
        console.error("Error in getting user details",err);
       }
       finally{
        setLoading(false)
       }
  }
  const handleCloseUserDetails = () => {
    setUserDetails(null);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}:3000/tickets/it?pageNumber=${currentPage}&pageSize=${pageSize}`,
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
  }, [currentPage]);

  return (
    <Box p={6}>
      {/* <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
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
                <StatLabel>All</StatLabel>
                <StatNumber color="blue.500">{openIncident+closeIncident}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Open</StatLabel>
                <StatNumber color="red.500">{openIncident}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Closed</StatLabel>
                <StatNumber color="green.500">{closeIncident}</StatNumber>
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
                <StatLabel>All</StatLabel>
                <StatNumber color="blue.500">{openService+closeService}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Open</StatLabel>
                <StatNumber color="red.500">{openService}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Closed</StatLabel>
                <StatNumber color="green.500">{closeService}</StatNumber>
              </Stat>
            </Stack>
          </CardBody>
        </Card>
      </Grid> */}

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
                  <Th> Level of Approvement</Th>
                  <Th>Remark by Head</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.map((request) => (
                  <Tr key={request.id}>
                    <Td>{request.sequenceNo}</Td>
                    <Td>{request.createdAt}</Td>
                    <Td>{request.query}</Td>
                    <Td cursor="pointer" onClick={()=> handleCreatedBy(request.createdById)}>{request.createdBy}</Td>
                    <Td color={request.resolvedAt ? "green.500" : "red.500"}>
                      {request.resolvedAt ? "Resolved" : "Open"}
                    </Td>
                    <Td>{request.type}</Td>
                    <Td>
                      <Box display={"flex"} gap={2}>
                        <Button
                          onClick={() => handleRowClick(request.id)}
                          style={{ cursor: "pointer" }}
                          _hover={{ bg: "gray.50" }}
                          p={2}
                          color={"green.400"}
                        >
                          Resolve
                        </Button>
                      </Box>
                    </Td>                  
                    <Td>{request.type === "Incident"?"":request.itHeadApprovedAt ? "L2 Approved":request.itHeadRejectedAt?"L2 Rejected":request.headApprovedAt?"L1 Approved":request.headRejectedAt?"L1 Rejected":"Waiting for L1 Approval"}</Td><td>{request.itHeadRemark}</td>
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

      {userDetails && (
        <UserDetailsBox
          userDetails={userDetails}
          onClose={handleCloseUserDetails}
        />
      )}
    </Box>
  );
};

export default DashboardIt;
