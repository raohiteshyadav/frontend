import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploader from "./mediaUploader";
import MediaPreview from "./mediaPreview";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
const apiIp = process.env.REACT_APP_API_IP;

const PreviewIncSerIt = () => {
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
  const [approved, setApproved] = useState('');
  const [remark, setRemark]= useState("");

  
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch pre-filled form data using the ID from the URL
    if (id) {
      
    const token = localStorage.getItem("token");
      axios
      .get(`http://${apiIp}:3000/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          setApproved(data.itApprovedAt);
          setRemark(data.remark);
        })
        .catch((error) => {
          console.error("Error fetching prefilled data:", error);
          toast.error("Error fetching data for prefill");
        });
    }
    console.log(approved);
  }, [id]);

  // Handle category, subcategory, and item fetching (if necessary)
  const subcategories = category ? Object.keys(categories[category] || {}) : [];
  const items = subcategory ? categories[category][subcategory] : [];

  const handleSubmit = () => {
    const payload = {
        query: description,
        priority: severity,
        subCategory: subcategory,
        item: item,
        category,
        type: "Service",
        attachmentId: attachmentId || undefined,
        remark:remark,
        request:'resolved',
        action:'approved'
      };
    const token = localStorage.getItem("token");
    axios
      .post(`http://${apiIp}:3000/tickets/${id}`,payload,  {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Ticket Approved Successfully!!");
        navigate("/home");
      })
      .catch((error) => console.error(error));
  };

  return (
    <FormContainer>
      <FormTitle>Service Request Form</FormTitle>

      {/* Category field */}
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

      {/* Subcategory field */}
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

      {/* Item field */}
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

      {/* Severity field */}
      <FormField>
        <Label>Severity <span style={{ color: 'red' }}>*</span></Label>
        <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Select a severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
      </FormField>

      {/* Description field */}
      <FormField>
        <Label>Description <span style={{ color: 'red' }}>*</span></Label>
        <TextArea
          value={description}
          readOnly
          className="read-only"
        />
      </FormField>

      {/* Media preview */}
      {attachmentId && (
        <MediaPreviewWrapper>
          <MediaPreview mediaId={attachmentId} />
        </MediaPreviewWrapper>
      )}
       <FormField>
        <Label>Remark <span style={{ color: 'red' }}>*</span></Label>
        <TextArea
          placeholder="Enter request description"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormField>

      {/* Submit and cancel buttons */}
      <ButtonContainer >
        <Button disabled={approved} onClick={handleSubmit}>Resolve</Button>
      </ButtonContainer>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} closeOnClick />
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

   &.read-only {
    background-color: #f1f1f1;  /* Light gray background */
    color: #888;  /* Dull text color */
    cursor: not-allowed;  /* Change cursor to indicate it's not clickable */
    border-color: #ddd;  /* Light border color */
    pointer-events: none; /* Disable mouse interaction */
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
  &:disabled {
    color:rgb(27, 199, 70);
    background-color: #d6d6d6;  // Grey out the button
    cursor: not-allowed;       // Change cursor to indicate it's disabled
    opacity: 0.6;              // Make it less visible
  }

  &:hover {
    background-color: #0056b3;
  }
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

const ButtonCancel = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #888;
  }
`;

export default PreviewIncSerIt;
