import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploader from "./mediaUploader";
import MediaPreview from "./mediaPreview";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [fileName, setFileName] = useState(null);

  const categories = {
    Server: {
      Windows: [
        "Application Install / Uninstall",
        "Server Provisioning",
        "Server Decommission",
        "Capacity & Resources",
        "Configure Role / Service",
        "Operating System",
        "Patch Update",
        "Windows Others",
      ],
      Linux: [
        "Application Install / Uninstall",
        "Server Provisioning",
        "Server Decommission",
        "Capacity & Resources",
        "Configure Role / Service",
        "Operating System",
        "Patch Update",
        "Linux Others",
      ],
      "Physical Server": [
        "Capacity Upgrade",
        "Patch Update",
        "Firmware Upgrade",
        "Operating System",
        "Decommission",
        "Physical Server Others",
      ],
    },
    Network: {
      Switch: [
        "Implement",
        "Port Configuration",
        "Patch Update",
        "Firmware Upgrade",
        "Decommission",
        "Switch Others",
      ],
      Firewall: [
        "Implement",
        "Configure Policy",
        "VPN Configuration",
        "Patch Update",
        "Firmware Upgrade",
        "Decommission",
        "Firewall Others",
      ],
      "Load Balancer": [
        "Configure Policy",
        "Patch Update",
        "Firmware Upgrade",
        "Decommission",
        "Load Balancer Others",
      ],
      Internet: [
        "Internet Access",
        "Website Whitelisting",
        "Website Blacklisting",
        "Domain & Email Blacklist",
      ],
    },
    Storage: {
      NAS: [
        "Implement",
        "Enhance NAS Capacity",
        "Allocate/Additional Storage",
        "Deallocate/Reduce Storage",
        "New Shared Storage",
        "Patch Update",
        "Firmware Upgrade",
        "Decommission",
        "Access to existing storage",
        "NAS Others",
      ],
    },
    Backup: {
      Backup: [
        "Add/Modify New Backup",
        "Delete Existing Backup",
        "Configure Backup Application",
        "Configure Tape Library",
        "Request Additional Tapes",
      ],
      Restore: [
        "VM Restore",
        "Database Restore",
        "Document Restore",
        "Restore Others",
      ],
    },
    Helpdesk: {
      "Desktop & Laptop": [
        "Desktop & Laptop Request",
        "Configure Desktop",
        "Configure Laptop",
        "Software Install/Uninstall",
        "Laptop WiFi Request",
        "Desktop & Laptop Others",
        "New Keyboard",
        "New Mouse",
        "New Dockstation",
        "New Monitor",
      ],
      Others: [
        "Configure Printer & Scanner",
        "Print/Scan Documents",
        "Conference Room Setup",
        "Helpdesk Others",
      ],
    },
    Database: {
      Oracle: [
        "Implement",
        "Database Configuration",
        "Performance Tuning",
        "Create / Modify Database",
        "Delete / Drop Database",
        "Oracle Others",
      ],
      SQL: [
        "Implement",
        "Database Configuration",
        "Performance Tuning",
        "Create / Modify Database",
        "Delete / Drop Database",
        "SQL Others",
      ],
      "Database Others": ["Database Others"],
    },
    Applications: {
      SAP: [
        "Installation",
        "Configure",
        "Application Decommissioning",
        "SAP Others",
      ],
    },
    Security: {
      Antivirus: ["Implement", "Configure", "Decommission", "Antivirus Others"],
      "Security Other": ["Security Others"],
    },
    "ID Management": {
      "Create/Modify": [
        "Domain ID",
        "Windows Local ID",
        "Email ID",
        "SAP ID",
        "Mysetu ID",
        "ID - Others",
      ],
      "Delete/Disable": [
        "Domain ID",
        "Windows Local ID",
        "Email ID",
        "SAP ID",
        "ID - Others",
      ],
    },
    Telecom: {
      Telephone: [
        "New Telephone Request",
        "Telephone Location Change",
        "Telephone Special Number Allocation",
        "Dedicated PRI number Allocation",
      ],
    },
  };

  const subcategories = category ? Object.keys(categories[category]) : [];
  const items = subcategory ? categories[category][subcategory] : [];

  const handleUploadSuccess = ({ attachmentId, fileName }) => {
    setAttachmentId(attachmentId);
    setFileName(fileName);
    toast.success("File uploaded successfully!!");
  };

  const handleClearAttachment = () => {
    setAttachmentId(null);
    setFileName(null);
  };
  const handleSubmit = () => {
    if (!severity || !category || !subcategory || !item) {
      toast.error("Please fill all required fields!"); // Toast notification
      return;
    }

    const formData = new FormData();
    formData.append("type", "Service");
    formData.append("description", description);
    formData.append("severity", severity);
    formData.append("status", "pending");
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("item", item);

    const payload = {
      query: description,
      priority: severity,
      subCategory: subcategory,
      item: item,
      category,
      type: "Service",
      attachmentId: attachmentId || undefined,
    };

    const token = localStorage.getItem("token");
    axios
      .post("http://192.168.49.160:3000/tickets/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Ticket raised Successfully!!");

        navigate("/raise-a-ticket");
      })
      .catch((error) => console.error(error));
  };

  return (
    <FormContainer>
      <FormTitle>Service Request Form</FormTitle>

      <FormField required={true}>
        <Label required={true}>Category <span style={{ color: 'red' }}>*</span></Label>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory(""); // Reset subcategory when category changes
            setItem(""); // Reset item when category changes
          }}
          required
        >
          <option value="">Select a category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField>
        <Label>Subcategory <span style={{ color: 'red' }}>*</span></Label>
        <Select
          disabled={category === ""}
          value={subcategory}
          onChange={(e) => {
            setSubcategory(e.target.value);
            setItem(""); // Reset item when subcategory changes
          }}
        >
          <option value="">Select a subcategory</option>
          {subcategories.map((subcat) => (
            <option key={subcat} value={subcat}>
              {subcat}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField>
        <Label>Item <span style={{ color: 'red' }}>*</span></Label>
        <Select
          disabled={subcategory === ""}
          value={item}
          onChange={(e) => setItem(e.target.value)}
        >
          <option value="">Select an item</option>
          {items.map((it) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField>
        <Label>Severity <span style={{ color: 'red' }}>*</span></Label>
        <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Select a severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
      </FormField>
      <FormField>
        <Label>Description <span style={{ color: 'red' }}>*</span></Label>
        <TextArea
          placeholder="Enter request description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>
      {attachmentId && (
        <RamContainer>
          <X color={"red"} onClick={handleClearAttachment} />
        </RamContainer>
      )}
      {!attachmentId && (
        <FormField>
          <Label>Attach File (Optional)</Label>
          <MediaUploader
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => {
              toast.error("Error while uploading file");
              console.error(error);
            }}
            maxSizeMB={10}
            uploadUrl="http://192.168.49.160:3000/media/upload"
            acceptedFileTypes={[
              "application/pdf",
              "image/jpeg",
              "image/png",
              "image/gif",
            ]}
            disabled={!!attachmentId}
          />
        </FormField>
      )}

      {attachmentId && (
        <MediaPreviewWrapper>
          <MediaPreview mediaId={attachmentId} />
        </MediaPreviewWrapper>
      )}
      <ButtonContainer>
        <Button onClick={handleSubmit}>Submit</Button>
        <ButtonCancel>Cancel</ButtonCancel>
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

const InputFile = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }

  &::file-selector-button {
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
  }

  &::file-selector-button:hover {
    background-color: #0056b3;
  }
`;

const MediaPreviewWrapper = styled.div`
  padding: 5px 0 10px;
  width: 100%;
`;

const RamContainer = styled.div`
  display: flex;
  margin-bottom: -45px;
  cursor: pointer;
  z-index: 10;
  justify-content: flex-end;
  align-items: center;
  width: 100%; // Ensure it takes full width
  padding-right: 20px; // Optional: adjust padding to space out the cross icon
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
const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s ease, background-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }

  option {
    color: #555;
  }

  option:first-child {
    color: #999; // Placeholder option color (first item)
  }

  &:focus option:first-child {
    color: #007bff; // Change placeholder option color when focused
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonCancel = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #888;
  }
`;

export default ServiceRequestForm;
