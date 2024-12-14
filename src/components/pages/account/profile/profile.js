"use client";

import moment from "moment";
import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";
import { I18nProvider } from "@react-aria/i18n";
import { Card, CardBody } from "@nextui-org/card";
import { parseDate } from "@internationalized/date";
import { Button, Badge, Input, Spacer, Textarea, DatePicker, Alert } from "@nextui-org/react";

import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@graphql/mutations";
import isEmail from "validator/lib/isEmail";
import { isMobilePhone } from "validator";

const ProfileSetting = React.forwardRef(
  ({ className, id, avatar, name, email, phone, birthday, bio, institution, is_plus, ...props }, ref) => {
    // Graphql
    //-> mutations
    const [updateProfile] = useMutation(UPDATE_PROFILE);

    // States
    // -> Database values
    const [nameValue, setNameValue] = React.useState(name || "");
    const [avatarUrl, setAvatarUrl] = React.useState(avatar || "");
    const [emailValue, setEmailValue] = React.useState(email || "");
    const [phoneValue, setPhoneValue] = React.useState(phone || "");
    const [birthdayValue, setBirthdayValue] = React.useState(birthday ? parseDate(birthday) : null);
    const [bioValue, setBioValue] = React.useState(bio || "");
    const [institutionValue, setInstitutionValue] = React.useState(institution || "");

    // -> State Reminders
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [updating, setUpdating] = React.useState(false);

    // State update handlers
    const handleNameChange = React.useCallback((e) => setNameValue(e.target.value), [nameValue]);
    const handlePhoneChange = React.useCallback((e) => setPhoneValue(e.target.value), [phoneValue]);
    const handleBirthdayChange = React.useCallback((value) => setBirthdayValue(value), [birthdayValue]);
    const handleBioChange = React.useCallback((e) => setBioValue(e.target.value), [bioValue]);
    const handleInstitutionChange = React.useCallback((e) => setInstitutionValue(e.target.value), [institutionValue]);

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

      const data = await updateProfile({
        variables: {
          id,
          name: nameValue,
          avatar: avatarUrl,
          email: emailValue,
          phone: phoneValue,
          //  to normal date
          birthday: moment(`${birthdayValue.year}-${birthdayValue.month}-${birthdayValue.day}`).format("YYYY-MM-DD"),
          bio: bioValue,
          institution: institutionValue,
        },
      });

      setUpdating(false);

      if (data.data.update_users.affected_rows > 0) {
        setSuccess("Profile updated successfully.");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Something went wrong. Please try again.");
        setTimeout(() => setError(false), 3000);
      }

      console.log("ProfileSetting", data);
    }, [nameValue, bioValue, birthdayValue, avatarUrl, institutionValue, phoneValue]);

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
                  <Badge
                    classNames={{
                      badge: "w-5 h-5",
                    }}
                    content={
                      <Button
                        isIconOnly
                        className="h-5 w-5 min-w-5 bg-background p-0 text-default-500"
                        radius="full"
                        size="sm"
                        variant="bordered"
                      >
                        <Icon className="h-[9px] w-[9px]" icon="solar:pen-linear" />
                      </Button>
                    }
                    placement="bottom-right"
                    shape="circle"
                  >
                    <Avatar className="h-16 w-16" src={avatarUrl} alt={nameValue} name={nameValue} />
                  </Badge>
                  <div>
                    <p className="text-sm font-medium text-default-600">{nameValue}</p>
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
          <p className="text-base font-medium text-default-700">Name</p>
          <p className="mt-1 text-sm font-normal text-default-400">Set your full name.</p>
          <Input className="mt-2" placeholder="e.g John Doe" value={nameValue} onChange={handleNameChange} required />
        </div>
        <Spacer y={4} />
        {/* Birthadate */}
        <div>
          <p className="text-base font-medium text-default-700">Birthdate</p>
          <p className="mt-1 text-sm font-normal text-default-400">Set your birthdate.</p>
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
            />
          </I18nProvider>
        </div>
        <Spacer y={4} />
        {/* Email */}
        <div>
          <p className="text-base font-medium text-default-700">Email Address</p>
          <p className="mt-1 text-sm font-normal text-default-400">Check your email address. (Read-only)</p>
          <Input className="mt-2" value={emailValue} disabled />
        </div>
        <Spacer y={4} />
        {/* Phone Number */}
        <div>
          <p className="text-base font-medium text-default-700">Phone Number</p>
          <p className="mt-1 text-sm font-normal text-default-400">Set your phone number.</p>
          <Input
            type="tel"
            className="mt-2"
            placeholder="e.g +1 234 567 890"
            required
            pattern="^\+(?:[0-9] ?){6,14}[0-9]$"
            validate={{ pattern: "Invalid phone number" }}
            value={phoneValue}
            onChange={handlePhoneChange}
          />
        </div>
        <Spacer y={4} />
        {/* School / College / University */}
        <div>
          <p className="text-base font-medium text-default-700">School / College / University</p>
          <p className="mt-1 text-sm font-normal text-default-400">Set your current school, college or university.</p>
          <Input
            className="mt-2"
            placeholder="e.g New York University"
            value={institutionValue}
            onChange={handleInstitutionChange}
          />
        </div>
        <Spacer y={4} />
        {/* Biography */}
        <div>
          <p className="text-base font-medium text-default-700">Biography</p>
          <p className="mt-1 text-sm font-normal text-default-400">Specify your present whereabouts.</p>
          <Textarea
            className="mt-2"
            classNames={{
              input: cn("min-h-[115px]"),
            }}
            placeholder="e.g., 'I am a student at New York University.'"
            value={bioValue}
            onChange={handleBioChange}
          />
        </div>
        {success && (
          <>
            <Spacer y={4} />
            <div className="flex items-center justify-center w-full">
              <Alert hideIconWrapper color="success" title={success} variant="bordered" />
            </div>
          </>
        )}
        {error && (
          <>
            <Spacer y={4} />
            <div className="flex items-center justify-center w-full">
              <Alert hideIconWrapper color="danger" title={error} variant="bordered" />
            </div>
          </>
        )}
        <Spacer y={4} />
        <div className="flex justify-end">
          <Button
            className="mt-4 bg-default-foreground text-background rounded-sm "
            size="md"
            radius="none"
            onClick={handleUpdateProfile}
            isLoading={updating}
          >
            Update Profile
          </Button>
        </div>
      </div>
    );
  }
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;
