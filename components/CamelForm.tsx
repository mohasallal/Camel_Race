import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Age, Camel, Sex } from "@prisma/client";
import { AiOutlineClose } from "react-icons/ai"; // استيراد أيقونة X

interface Props {
  className?: string;
  userId: string;
  onClose: () => void;
  onAddCamel: (newCamel: Camel) => void;
  onUpdateCamel?: (updatedCamel: Camel) => void;
  editingCamel?: {
    id: number;
    name: string;
    camelID: number;
    age: Age;
    sex: Sex;
    ownerId: string;
  } | null; // يضمن وجود ownerId أو null
}

const AddCamelsForm: React.FC<Props> = ({
  onClose,
  className,
  userId,
  onAddCamel,
  onUpdateCamel,
  editingCamel,
}) => {
  const [camelDetails, setCamelDetails] = useState({
    name: "",
    camelID: "",
    ownerId: userId,
    age: "GradeOne",
    sex: "Male",
  });

  const [errors, setErrors] = useState({
    name: "",
    camelID: "",
    age: "",
    sex: "",
  });

  useEffect(() => {
    if (editingCamel) {
      setCamelDetails({
        name: editingCamel.name || "",
        camelID: editingCamel.camelID.toString() || "", 
        ownerId: editingCamel.ownerId || userId, // التأكد من أن ownerId موجود
        age: editingCamel.age || "GradeOne",
        sex: editingCamel.sex || "Male",
      });
    }
  }, [editingCamel, userId]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCamelDetails({ ...camelDetails, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setCamelDetails({ ...camelDetails, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      name: camelDetails.name ? "" : "Camel Name is required",
      camelID: camelDetails.camelID ? "" : "Camel ID is required",
      age: camelDetails.age ? "" : "Camel Age is required",
      sex: camelDetails.sex ? "" : "Camel Sex is required",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Do not submit the form if there are validation errors
    }
    
    const camelToSubmit = {
      ...camelDetails,
      camelID: parseInt(camelDetails.camelID, 10), // تحويل camelID إلى عدد صحيح
      ownerId: userId,
    };

    try {
      if (editingCamel) {
        if (onUpdateCamel) {
          await onUpdateCamel({
            ...editingCamel,
            ...camelToSubmit,
          });
        }
        alert("Camel updated successfully!");
      } else {
        const response = await fetch("/api/camels/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(camelToSubmit),
        });

        const result = await response.json();
        if (response.ok) {
          onAddCamel(result);
          alert("Camel added successfully!");
        } else {
          alert(result.error || "Failed to add camel.");
        }
      }
      onClose(); // إغلاق النموذج بعد التعديل أو الإضافة
    } catch (error) {
      console.error("Error adding/updating camel:", error);
      alert("An error occurred while adding/updating camel.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ${className}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingCamel ? "Edit Camel" : "Add Camel"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <Input
              name="name"
              value={camelDetails.name}
              onChange={handleChange}
              placeholder="Camel Name"
              className="w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="mb-2">
            <Input
              name="camelID"
              type="number"
              value={camelDetails.camelID}
              onChange={handleChange}
              placeholder="Camel ID"
              className="w-full"
            />
            {errors.camelID && <p className="text-red-500 text-sm">{errors.camelID}</p>}
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Camel Age</label>
            <Select
              value={camelDetails.age}
              onValueChange={(value) => handleSelectChange("age", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GradeOne">Grade One</SelectItem>
                <SelectItem value="GradeTwo">Grade Two</SelectItem>
                <SelectItem value="GradeThree">Grade Three</SelectItem>
                <SelectItem value="GradeFour">Grade Four</SelectItem>
                <SelectItem value="GradeFive">Grade Five</SelectItem>
                <SelectItem value="GradeSixMale">Grade Six Male</SelectItem>
                <SelectItem value="GradeSixFemale">Grade Six Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Camel Sex</label>
            <Select
              value={camelDetails.sex}
              onValueChange={(value) => handleSelectChange("sex", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
          </div>

          <Button type="submit" className="mr-2">
            {editingCamel ? "Update Camel" : "Add Camel"}
          </Button>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddCamelsForm;
