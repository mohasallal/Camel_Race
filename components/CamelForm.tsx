import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Camel } from "@prisma/client";

interface Props {
  className?: string;
  userId: string;
  onClose: () => void;
  onAddCamel: (newCamel: Camel) => void;
}

const AddCamelsForm: React.FC<Props> = ({
  onClose,
  className,
  userId,
  onAddCamel,
}) => {
  const [camelDetails, setCamelDetails] = useState({
    name: "",
    camelID: "",
    ownerId: userId,
    age: "GradeOne",
    sex: "Male",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCamelDetails({ ...camelDetails, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCamelDetails({ ...camelDetails, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting camel details:", camelDetails);

    try {
      const response = await fetch("/api/camels/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(camelDetails),
      });

      const result = await response.json();
      console.log("Response from server:", result);

      if (response.ok) {
        onAddCamel(result);
        alert("Camel added successfully!");
        setTimeout(() => {
          onClose();
        }, 750);
      } else {
        alert(result.error || "Failed to add camel.");
      }
    } catch (error) {
      console.error("Error adding camel:", error);
      alert("An error occurred while adding camel.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ${className}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Camel</h2>
        <form onSubmit={handleSubmit}>
          <Input
            name="name"
            value={camelDetails.name}
            onChange={handleChange}
            placeholder="Camel Name"
            className="mb-2"
          />
          <Input
            name="camelID"
            type="number"
            value={camelDetails.camelID}
            onChange={handleChange}
            placeholder="Camel ID"
            className="mb-2"
          />

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
          </div>
          {successMessage && (
            <div className="mt-4 text-green-600 font-semibold text-center">
              {successMessage}
            </div>
          )}
          <Button type="submit" className="mr-2">
            Add Camel
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
