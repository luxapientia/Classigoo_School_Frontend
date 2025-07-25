"use client";

import axios from "@lib/axios";
import moment from "moment";
import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { isMobilePhone } from "validator";
import isEmail from "validator/lib/isEmail";
import { Avatar } from "@heroui/avatar";
import { I18nProvider } from "@react-aria/i18n";
import { Card, CardBody } from "@heroui/card";
import { parseDate } from "@internationalized/date";
import { FileUploader } from "react-drag-drop-files";
import {
  Button,
  Badge,
  Input,
  Spacer,
  Textarea,
  DatePicker,
  Alert,
} from "@heroui/react";


const ProfileSetting = React.forwardRef(
  (
    {
      className,
      id,
      avatar,
      name,
      email,
      phone,
      birthday,
      bio,
      institution,
      is_plus,
      ...props
    },
    ref
  ) => {
    // constans
    const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

    // States
    // -> Database values
    const [nameValue, setNameValue] = React.useState(name || "");
    const [avatarUrl, setAvatarUrl] = React.useState(avatar?.url || "");
    const [emailValue, setEmailValue] = React.useState(email || "");
    const [phoneValue, setPhoneValue] = React.useState(phone || "");
    const [birthdayValue, setBirthdayValue] = React.useState(
      birthday ? parseDate(birthday) : null
    );
    const [bioValue, setBioValue] = React.useState(bio || "");
    const [institutionValue, setInstitutionValue] = React.useState(
      institution || ""
    );

    // -> State Reminders
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [updating, setUpdating] = React.useState(false);
    const [filePicker, setFilePicker] = React.useState(false);
    const [profileFile, setProfileFile] = React.useState(null);
    const [profileFilePreview, setProfileFilePreview] = React.useState(null);

    // State update handlers
    const handleNameChange = React.useCallback(
      (e) => setNameValue(e.target.value),
      [nameValue]
    );
    const handlePhoneChange = React.useCallback(
      (e) => setPhoneValue(e.target.value),
      [phoneValue]
    );
    const handleBirthdayChange = React.useCallback(
      (value) => setBirthdayValue(value),
      [birthdayValue]
    );
    const handleBioChange = React.useCallback(
      (e) => setBioValue(e.target.value),
      [bioValue]
    );
    const handleInstitutionChange = React.useCallback(
      (e) => setInstitutionValue(e.target.value),
      [institutionValue]
    );

    // validator function
    const validate = () => {
      let isValid = true;
      if (!nameValue) {
        setError("Name is required.");
        isValid = false;
      } else if (!phoneValue) {
        setError("Phone number is required.");
        isValid = false;
      } else if (!birthdayValue) {
        setError("Birthday is required.");
        isValid = false;
      } else if (!institutionValue) {
        setError("Institution is required.");
        isValid = false;
      } else if (!bioValue) {
        setError("Biography is required.");
        isValid = false;
      } else if (!isMobilePhone(phoneValue)) {
        setError("Invalid phone number.");
        isValid = false;
      } else if (!isEmail(emailValue)) {
        setError("Invalid email address.");
        isValid = false;
      }
      setTimeout(() => setError(false), 5000);
      return isValid;
    };

    // action handlers
    const handleUpdateProfile = React.useCallback(async () => {
      setUpdating(true);

      if (!validate()) {
        setUpdating(false);
        return;
      }

      const { data: response } = await axios.put(`/v1/account/profile/${id}`, {
        name: nameValue,
        // avatar: {
        //   bucketKey: avatar.bucketKey,
        //   url: avatarUrl,
        // },
        email: emailValue,
        phone: phoneValue,
        birthday: moment(
          `${birthdayValue.year}-${birthdayValue.month}-${birthdayValue.day}`
        ).format("YYYY-MM-DD"),
        bio: bioValue,
        institution: institutionValue,
      });

      setUpdating(false);

      if (response.status === "success") {
        setSuccess("Profile updated successfully.");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Something went wrong. Please try again.");
        setTimeout(() => setError(false), 3000);
      }
    }, [
      nameValue,
      bioValue,
      birthdayValue,
      avatarUrl,
      institutionValue,
      phoneValue,
    ]);

    // handle file change
    const handleFileChange = React.useCallback(
      (file) => {
        setProfileFile(file);
      },
      [profileFile]
    );

    // handle file upload
    React.useEffect(() => {
      if (profileFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileFilePreview(reader.result);
        };
        reader.readAsDataURL(profileFile);
      }
    }, [profileFile]);

    const handleFileUpload = React.useCallback(async () => {
      setUpdating(true);
      let formData = new FormData();
      formData.append("files", profileFile);
      formData.append("fileFolder", "profile");

      // // post form data image
      const {data: response} = await axios.post("/v1/account/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "success") {
        setAvatarUrl(response.avatar.url);
        setSuccess("Profile picture updated successfully.");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Something went wrong. Please try again.");
        setTimeout(() => setError(false), 3000);
      }

      setProfileFile(null);
      setFilePicker(false);
      setUpdating(false);
    }, [profileFile, profileFilePreview]);

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        <div>
          <Card className="mt-4 bg-default-100" shadow="none">
            <CardBody>
              <Badge
                classNames={{
                  badge: `py-0.5 px-3`,
                }}
                content={is_plus ? "Plus" : "Free"}
                placement="top-right"
                shape="rectangle"
                className={`text-background text-xs font-semibold rounded-md ${
                  is_plus ? "bg-[#fdcb6e] text-gray-700" : "bg-[#e74c3c]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    className="grid justify-center content-center"
                    onClick={() => setFilePicker(true)}
                  >
                    <Badge
                      classNames={{
                        badge: "w-5 h-5",
                      }}
                      content={
                        <div className="h-5 w-5 min-w-5 bg-background p-0 text-default-500 rounded-full border-2 grid justify-center content-center">
                          <Icon
                            className="h-[9px] w-[9px]"
                            icon="solar:pen-linear"
                          />
                        </div>
                      }
                      placement="bottom-right"
                      shape="circle"
                    >
                      <Avatar
                        className="h-16 w-16"
                        src={avatarUrl}
                        alt={nameValue}
                        name={nameValue}
                      />
                    </Badge>
                  </button>
                  <div>
                    <p className="text-sm font-medium text-default-600">
                      {nameValue}
                    </p>
                    <p className="text-xs text-default-400">{emailValue}</p>
                  </div>
                </div>
              </Badge>
            </CardBody>
          </Card>
        </div>
        <Spacer y={4} />
        {/* Title */}
        <div>
          {/* <p className="text-base font-medium text-default-700">Name</p>
          <p className="mt-1 text-sm font-normal text-default-400">Set your full name.</p> */}
          <Input
            className="mt-2"
            placeholder="e.g John Doe"
            value={nameValue}
            onChange={handleNameChange}
            isRequired
            label="Full Name"
          />
        </div>
        <Spacer y={4} />
        {/* Birthadate */}
        <div>
          {/* <p className="text-base font-medium text-default-700">Birthdate</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Set your birthdate.
          </p> */}
          <I18nProvider locale="en-GB">
            <DatePicker
              showMonthAndYearPickers
              format="dd/MM/yyyy"
              className="mt-2"
              value={birthdayValue}
              onChange={handleBirthdayChange}
              // format="dd/MM/yyyy"
              maxValue={parseDate(moment().format("YYYY-MM-DD"))}
              isRequired
              label="Birthdate"
            />
          </I18nProvider>
        </div>
        <Spacer y={4} />
        {/* Email */}
        <div>
          {/* <p className="text-base font-medium text-default-700">
            Email Address
          </p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Check your email address. (Read-only)
          </p> */}
          <Input
            className="mt-2"
            value={emailValue}
            isReadOnly
            label="Email Address"
          />
        </div>
        <Spacer y={4} />
        {/* Phone Number */}
        <div>
          {/* <p className="text-base font-medium text-default-700">Phone Number</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Set your phone number.
          </p> */}
          <Input
            type="tel"
            className="mt-2"
            placeholder="e.g +1 234 567 890"
            required
            pattern="^\+(?:[0-9] ?){6,14}[0-9]$"
            validate={{ pattern: "Invalid phone number" }}
            value={phoneValue}
            onChange={handlePhoneChange}
            label="Phone Number"
          />
        </div>
        <Spacer y={4} />
        {/* School / College / University */}
        <div>
          {/* <p className="text-base font-medium text-default-700">
            School / College / University
          </p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Set your current school, college or university.
          </p> */}
          <Input
            className="mt-2"
            placeholder="e.g New York University"
            value={institutionValue}
            onChange={handleInstitutionChange}
            label="School / College / University"
          />
        </div>
        <Spacer y={4} />
        {/* Biography */}
        <div>
          {/* <p className="text-base font-medium text-default-700">Biography</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Specify your present whereabouts.
          </p> */}
          <Textarea
            className="mt-2"
            classNames={{
              input: cn("min-h-[115px]"),
            }}
            placeholder="e.g., 'I am a student at New York University.'"
            value={bioValue}
            onChange={handleBioChange}
            label="Biography"
          />
        </div>
        {success && (
          <>
            <Spacer y={4} />
            <div className="flex items-center justify-center w-full">
              <Alert
                hideIconWrapper
                color="success"
                title={success}
                variant="bordered"
              />
            </div>
          </>
        )}
        {error && (
          <>
            <Spacer y={4} />
            <div className="flex items-center justify-center w-full">
              <Alert
                hideIconWrapper
                color="danger"
                title={error}
                variant="bordered"
              />
            </div>
          </>
        )}
        <Spacer y={4} />
        <div className="flex justify-end">
          <Button
            className="mt-4 bg-default-foreground text-background rounded-sm "
            size="md"
            radius="none"
            onPress={handleUpdateProfile}
            isLoading={updating}
          >
            Update Profile
          </Button>
        </div>
        {filePicker && (
          <div className="bg-black/5 fixed inset-0 z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[5px]">
            <div className="bg-white dark:bg-black p-5 rounded-xl max-w-[90%] w-[512px]">
              {profileFile ? (
                <div className="flex justify-center content-center">
                  <img
                    src={profileFilePreview}
                    alt="Profile"
                    className="h-48 w-auto object-cover rounded-lg"
                  />
                </div>
              ) : (
                <FileUploader
                  fileTypes={fileTypes}
                  handleChange={handleFileChange}
                  maxSize={2}
                >
                  <div className="border-2 border-dotted border-default-200 rounded-lg flex items-center justify-center px-4 py-8">
                    <Icon
                      icon="akar-icons:upload"
                      className="h-8 w-8 text-default-400"
                    />
                    <p className="text-sm text-default-400">
                      Drag and drop your profile picture here or click to
                      upload.
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-default-400">
                    <span className="text-danger-500">*</span>
                    Allowed File types: {fileTypes.join(", ")}
                  </p>
                  <p className="text-xs text-default-400">
                    <span className="text-danger-500">*</span>
                    Max file size: 2MB
                  </p>
                </FileUploader>
              )}
              <div className="flex justify-end w-full">
                <Button
                  className="mt-4 bg-danger text-background rounded-sm mr-2"
                  size="sm"
                  variant="text"
                  onPress={() => {
                    setProfileFile(null);
                    setFilePicker(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="mt-4 bg-default-foreground text-background rounded-sm"
                  size="sm"
                  variant="text"
                  onPress={handleFileUpload}
                  isDisabled={!profileFile}
                  isLoading={updating}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;
