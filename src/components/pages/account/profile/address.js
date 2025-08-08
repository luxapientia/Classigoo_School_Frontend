"use client";

import * as React from "react";
import axios from "@lib/axios";
import { cn } from "@heroui/react";
import countrylist from "./country.json";
import { Button, Input, Spacer, Select, SelectItem, Alert } from "@heroui/react";

const AddressSetting = React.forwardRef(({ className, id, address, ...props }, ref) => {

  // States
  // -> Database values
  const [address1, setAddress1] = React.useState(address?.address1 || "");
  const [address2, setAddress2] = React.useState(address?.address2 || "");
  const [city, setCity] = React.useState(address?.city || "");
  const [zip, setZip] = React.useState(address?.zip || "");
  const [country, setCountry] = React.useState(address?.country || new Set(["Select a country"]));

  // -> State Reminders
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  // State update handlers
  const handleAddress1Change = (e) => setAddress1(e.target.value);
  const handleAddress2Change = (e) => setAddress2(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handleZipChange = (e) => setZip(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);

  // validator function
  const validate = () => {
    let isValid = true;
    if (address1.trim() === "") {
      setError("Address Line 1 is required.");
      isValid = false;
    } else if (city.trim() === "") {
      setError("City is required.");
      isValid = false;
    } else if (zip.trim() === "") {
      setError("Zip Code is required.");
      isValid = false;
    } else if (!countrylist.includes(country)) {
      setError("Country is required.");
      isValid = false;
    }

    if (!isValid) {
      setTimeout(() => setError(false), 3000);
    }

    return isValid;
  };

  // action handlers
  const handleUpdateAddress = React.useCallback(async () => {
    console.log("Updating Address");
    setUpdating(true);

    if (!validate()) {
      setUpdating(false);
      return;
    }
    const { data: response } = await axios.put(`/v1/account/address/${id}`, {
      address1,
      address2,
      city,
      zip,
      country,
    });

    setUpdating(false);

    if (response.status === "success") {
      setSuccess("Address updated successfully.");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(false), 3000);
    }

  }, [address1, address2, city, zip, country]);

  return (
    <div ref={ref} className={cn("p-2", className)} {...props}>
      {/* <div>
        <p className="text-base font-medium text-default-700">Address</p>
        <p className="mt-1 text-sm font-normal text-default-400">View and edit your address.</p>
      </div>
      <Spacer y={4} /> */}
      <div className="flex-1 mr-1">
        <Input
          className="mt-2"
          label="Address Line 1"
          placeholder="e.g 1234 Main St"
          value={address1}
          onChange={handleAddress1Change}
          required
        />
      </div>
      <Spacer y={2} />
      <div className="flex-1 mr-1">
        <Input
          className="mt-2"
          label="Address Line 2"
          placeholder="e.g Apartment, studio, or floor"
          value={address2}
          onChange={handleAddress2Change}
        />
      </div>
      <Spacer y={2} />
      <div className="flex">
        <div className="flex-1 mr-1">
          <Input
            className="mt-2"
            label="City"
            placeholder="e.g New York"
            value={city}
            onChange={handleCityChange}
            required
          />
        </div>
        <div className="flex-1 ml-1">
          <Input
            className="mt-2"
            label="Zip Code"
            placeholder="e.g 10001"
            value={zip}
            onChange={handleZipChange}
            required
          />
        </div>
      </div>
      <Spacer y={2} />
      <div>
        <Select
          className="mt-2"
          label="Country"
          placeholder="Select a country"
          selectedKeys={[country]}
          onChange={handleCountryChange}
          value={country}
        >
          {countrylist.map((country) => (
            <SelectItem key={country}>{country}</SelectItem>
          ))}
        </Select>
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
          onPress={handleUpdateAddress}
          isLoading={updating}
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
});

AddressSetting.displayName = "AddressSetting";

export default AddressSetting;
