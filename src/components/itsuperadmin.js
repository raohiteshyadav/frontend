import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Card,
  CardBody,
  HStack,
} from "@chakra-ui/react";

const UserList = () => {
  const [data, setData] = useState([]);
  const apiIp = process.env.REACT_APP_API_IP;
  const toast = useToast();
  const token = localStorage.getItem("token");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map the Excel data to the format required by the backend
        const formattedData = jsonData.map((row) => ({
          id: String(row["ID"]),
          name: row["Name"],
          email: row["Email"],
          contact: String(row["Contact"]),
          department: row["Dept"],
          reportingTo: row["Reporting To"]
            ? String(row["Reporting To"])
            : undefined,
          role: row["Role"],
        }));
        setData(formattedData); // Store the data for further processing
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handlePostData = () => {
    const payload = {
      data,
    };
    axios
      .post(`http://${apiIp}:3000/user/bulk-user`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data uploaded successfully:", response.data);
        toast({
          title: "Data Uploaded",
          description: "Employee data has been successfully uploaded.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error uploading data:", error);
        toast({
          title: "Error Uploading Data",
          description:
            "There was an error uploading the data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Box p={5} maxW="7xl" mx="auto" mt={5} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Upload Employee Data
        </Text>

        <HStack>
          {/* File Upload Input */}
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            variant="flushed"
          />

          {/* Upload Button */}
          <Button
            colorScheme="teal"
            onClick={handlePostData}
            isDisabled={data.length === 0}
          >
            Upload Data
          </Button>
        </HStack>

        {/* Display Excel Data in a Table */}
        <Box
          w="full"
          p={4}
          bg="gray.50"
          borderRadius="md"
          mt={4}
          overflowX="auto"
        >
          <Text
            fontSize="xl"
            display={"flex"}
            justifyContent={"center"}
            width="full"
            color="gray.600"
            mb={2}
            fontWeight="bold"
          >
            Preview Data:
          </Text>

          {data.length > 0 ? (
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Serial Number</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Contact</Th>
                  <Th>Department</Th>
                  <Th>Reporting To</Th>
                  <Th>Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.id}</Td>
                    <Td>{item.serial_number}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.contact}</Td>
                    <Td>{item.department}</Td>
                    <Td>{item.reporting_to_id}</Td>
                    <Td>{item.role}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No data available to preview</Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default UserList;
