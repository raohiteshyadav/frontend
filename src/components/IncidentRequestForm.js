import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploader from "./mediaUploader";
import MediaPreview from "./mediaPreview";
import { Box, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IncidentRequestForm = () => {

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
        "Login Issue",
        "System Error",
        "Hardware Issue",
        "Software Issue",
        "Disk / Partition Issue",
        "Operating System",
        "Cluster",
        "Service & Process",
        "Patch & Firmware",
        "AD/ADFS/DNS",
        "Virtualization",
        "Physical Host",
        "Windows Others",
      ],
      Linux: [
        "Login Issue",
        "System Error",
        "Hardware Issue",
        "Software Issue",
        "Disk / Partition Issue",
        "Operating System",
        "Service & Process",
        "Patch & Firmware",
        "AD/ADFS/DNS",
        "Virtualization",
        "Physical Host",
        "Linux Others",
      ],
    },
    Network: {
      Switch: [
        "Login Issue",
        "Port Issue",
        "DHCP",
        "Policy/Configuration Issue",
        "VLAN",
        "Patch & Firmware",
        "System Error",
        "Hardware Issue",
        "Switch Others",
      ],
      Firewall: [
        "Login Issue",
        "Policy/Configuration Issue",
        "Patch & Firmware",
        "VPN",
        "System Error",
        "Hardware Issue",
        "Firewall Others",
      ],
      "Load Balancer": [
        "Login Issue",
        "Policy/Configuration Issue",
        "Patch & Firmware",
        "System Error",
        "Hardware Issue",
        "Load Balancer Others",
      ],
      Internet: ["Link Down", "Packet Drops", "Internet Others"],
    },
    Storage: {
      "NAS Storage": [
        "Login Issue",
        "System Error",
        "Storage Full",
        "LUN Issue",
        "Shared Storage",
        "Patch & Firmware",
        "Hardware Issue",
        "NAS Others",
      ],
    },
    Backup: {
      Jobs: ["Job Fail", "Start / Restart / Stop Job", "Job Others"],
      "Backup Application": [
        "System Error",
        "Backup Master",
        "Backup Client",
        "Backup Application Others",
      ],
      "Tape & Library": [
        "Tape Library",
        "LTO Tape",
        "Hardware Issue",
        "Tape & Library Others",
      ],
      "Backup Others": ["Backup Others"],
    },
    Helpdesk: {
      Desktop: [
        "Software Issue",
        "Hardware Issue",
        "Operating System",
        "Network & WiFi",
        "Antivirus",
        "VPN",
        "Desktop Others",
      ],
      Laptop: [
        "Software Issue",
        "Hardware Issue",
        "Operating System",
        "Network & WiFi",
        "Antivirus",
        "VPN",
        "Laptop Others",
      ],
      "Other Devices": [
        "Printer Issue",
        "Scanner Issue",
        "Display Issue",
        "Conference Room Issue",
        "Projector & Speaker Issue",
        "Devices Others",
      ],
    },
    Database: {
      Oracle: [
        "Login Issue",
        "System Error",
        "Performance",
        "Cluster & Replication",
        "Storage, Partition & Mount Point",
        "Backup & Restore",
        "Table Space & DB Lock",
        "Session Process",
        "Oracle Others",
      ],
      SQL: [
        "Login Issue",
        "System Error",
        "Performance",
        "Cluster & Replication",
        "Storage, Partition & Mount Point",
        "Backup & Restore",
        "Table Space & DB Lock",
        "Session Process",
        "SQL Others",
      ],
      OtherDB: [
        "Login Issue",
        "System Error",
        "Performance",
        "Backup & Restore",
        "Others DB",
      ],
    },
    SAP: {
      MM: ["Technical", "Functional", "Administration"],
      FICO: ["Technical", "Functional", "Administration"],
      SD: ["Technical", "Functional", "Administration"],
      PM: ["Technical", "Functional", "Administration"],
      Security: ["Password Reset", "Role Addition", "Role Removal"],
      QM: ["Technical", "Functional", "Administration"],
      PP: ["Technical", "Functional", "Administration"],
      PS: ["Technical", "Functional", "Administration"],
    },
    "Application Others": {
      "Application Others": ["Application Others"],
    },
    Security: {
      AntiVirus: ["Signature Update", "Alert", "Antivirus Others"],
      "Security Others": ["Security Others"],
    },
    CCTV: {
      CCTV: ["Camera issue", "Clarity issue"],
    },
    Telecom: {
      Telephone: ["Telephone Issue", "Incoming issue", "Outgoing issue"],
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
      toast.error("Please fill all required fields!"); 
      return;
    }
    const formData = new FormData();
    formData.append("type", "Incident");
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
      type: "Incident",
      attachmentId: attachmentId  || undefined,
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
      <FormTitle>Incident Request Form</FormTitle>

      <FormField>
        <Label>Category<span style={{ color: 'red' }}>*</span></Label>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory(""); // Reset subcategory when category changes
            setItem(""); // Reset item when category changes
          }}
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
        <Label>Description<span style={{ color: 'red' }}>*</span></Label>
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

export default IncidentRequestForm;
