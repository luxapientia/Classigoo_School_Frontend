"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@lib/axios";
import SchoolItem from "./item";

export default function SelectSchoolMain() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Fetch schools on component mount
  useEffect(() => {
    fetchSchools();
  }, []);

  // Filter schools based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSchools(schools);
      return;
    }

    const filtered = schools.filter(school =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchQuery, schools]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      // const { data } = await axios.get("/v1/schools");
      // mock data
      const data = {
        schools: [
          {
            id: "1",
            name: "School 1",
            address: "123 Main St, Anytown, USA"
          },
          {
            id: "2",
            name: "School 2",
            address: "456 Elm St, Anytown, USA"
          },
          {
            id: "3",
            name: "School 3",
            address: "789 Oak St, Anytown, USA"
          }
        ]
      };
      setSchools(data.schools || []);
      setFilteredSchools(data.schools || []);
    } catch (err) {
      setError("Failed to fetch schools. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const handleContinue = async () => {
    if (!selectedSchool) return;
    
    try {
      setConfirmLoading(true);
      setError("");
      
      // Get stored signup data
      const signupData = JSON.parse(localStorage.getItem("teacherSignupData"));
      if (!signupData) {
        throw new Error("Signup data not found. Please try again.");
      }

      const { data } = await axios.post("/v1/auth/otp/send", {
        ...signupData,
        isSignup: true,
        school_id: selectedSchool.id,
        ip: "127.0.0.1", // This should be handled by the backend
      });

      if (data.status === "success" && data.session_token) {
        // Clean up stored data
        localStorage.removeItem("teacherSignupData");
        // Store session token and email for OTP verification
        localStorage.setItem("session_token", data.session_token);
        localStorage.setItem("email", signupData.email);
        // Navigate to OTP verification page
        router.push("/auth/teacher/verify-otp");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setConfirmLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Image src="/images/brand/logo-c.png" alt="logo" width={50} height={50} className="mb-4" />
          <p className="text-xl font-medium">Find your school</p>
          <p className="text-small text-default-500">Search and select your school to continue</p>
        </div>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Search by school name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="bordered"
            className="mb-2"
          />

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <p className="text-center text-small text-default-500">Loading schools...</p>
            ) : error ? (
              <p className="text-center text-small text-danger">{error}</p>
            ) : filteredSchools.length === 0 ? (
              <p className="text-center text-small text-default-500">No schools found</p>
            ) : (
              filteredSchools.map((school) => (
                <SchoolItem
                  key={school.id}
                  school={school}
                  onSelect={handleSchoolSelect}
                />
              ))
            )}
          </div>
        </div>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          className="max-w-md"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">{selectedSchool?.name}</h3>
            </ModalHeader>
            <ModalBody>
              <p className="text-base">Join your colleagues already on Classigoo</p>
              {error && <p className="mt-2 text-tiny text-danger">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                className="w-full"
                onClick={handleContinue}
                isLoading={confirmLoading}
              >
                Continue
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
