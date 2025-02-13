import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaPreview from "./mediaPreview";
import { useNavigate, useParams } from "react-router-dom";

const apiIp = process.env.REACT_APP_API_IP;

const PreviewHead = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  // Form state
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [approved, setApproved] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch pre-filled form data using the ID from the URL
    if (id) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://${apiIp}:3000/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setDescription(data.query);
          setSeverity(data.priority);
          setCategory(data.category);
          setSubcategory(data.subCategory);
          setItem(data.item);
          setAttachmentId(data.attachmentId);
          setFileName(data.attachmentName);
          setApproved(data.approvedByHeadAt);
        })
        .catch((error) => {
          console.error("Error fetching prefilled data:", error);
          toast.error("Error fetching data for prefill");
        });
    }
  }, [id]);

  const handleSubmit = (action) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://${apiIp}:3000/tickets/approve-head/${id}`,
        { query: description, action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Ticket Approved Successfully!!");
        navigate("/approval");
      })
      .catch((error) => console.error(error));
  };

  return (
    <FormContainer>
      <FormTitle>Service Request Form</FormTitle>

      {/* Displaying static values for category, subcategory, item, and severity */}
      <FormField>
        <Label>Category</Label>
        <ReadOnlyInput>{category}</ReadOnlyInput>
      </FormField>

      <FormField>
        <Label>Subcategory</Label>
        <ReadOnlyInput>{subcategory}</ReadOnlyInput>
      </FormField>

      <FormField>
        <Label>Item</Label>
        <ReadOnlyInput>{item}</ReadOnlyInput>
      </FormField>

      <FormField>
        <Label>Severity</Label>
        <ReadOnlyInput>{severity}</ReadOnlyInput>
      </FormField>

      {/* Description field */}
      <FormField>
        <Label>
          Description <span style={{ color: "red" }}>*</span>
        </Label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      {/* Media preview */}
      {attachmentId && (
        <MediaPreviewWrapper>
          <MediaPreview mediaId={attachmentId} />
        </MediaPreviewWrapper>
      )}

      {/* Submit and cancel buttons */}
      <ButtonContainer>
        <Button  onClick={() => handleSubmit("approved")}>
          Approve
        </Button>
        <Button disabled={approved} onClick={() => handleSubmit("rejected")}>
          Reject
        </Button>
      </ButtonContainer>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
      />
    </FormContainer>
  );
};

// Styled components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const MediaPreviewWrapper = styled.div`
  padding: 5px 0 10px;
  width: 100%;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
`;

const FormField = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 8px;
`;

const ReadOnlyInput = styled.div`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: border 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
    font-style: italic;
    transition: color 0.3s ease;
  }

  &:focus {
    border-color: #007bff;
  }

  &:focus::placeholder {
    color: #007bff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    color: rgb(27, 199, 70);
    background-color: #d6d6d6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

export default PreviewHead;
