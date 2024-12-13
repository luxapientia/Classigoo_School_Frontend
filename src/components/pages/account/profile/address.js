"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import countrylist from "./country.json";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";
import {
  Button,
  Badge,
  Input,
  Spacer,
  Textarea,
  DatePicker,
  Select,
  SelectSection,
  SelectItem,
} from "@nextui-org/react";

const AddressSetting = React.forwardRef(({ className, ...props }, ref) => {
  const [selected, setSelected] = React.useState(new Set(["Select a country"]));

  return (
    <div ref={ref} className={cn("p-2", className)} {...props}>
      <div>
        <p className="text-base font-medium text-default-700">Address</p>
        <p className="mt-1 text-sm font-normal text-default-400">View and edit your address.</p>
      </div>
      <Spacer y={4} />
      <div className="flex-1 mr-1">
        <Input className="mt-2" label="Address Line 1" placeholder="e.g 1234 Main St" required />
      </div>
      <Spacer y={2} />
      <div className="flex-1 mr-1">
        <Input className="mt-2" label="Address Line 2" placeholder="e.g Apartment, studio, or floor" />
      </div>
      <Spacer y={2} />
      <div className="flex">
        <div className="flex-1 mr-1">
          <Input className="mt-2" label="City" placeholder="e.g New York" required />
        </div>
        <div className="flex-1 ml-1">
          <Input className="mt-2" label="Zip Code" placeholder="e.g 10001" required />
        </div>
      </div>
      <Spacer y={2} />
      <div>
        <Select className="mt-2" label="Country" placeholder="Select a country" value={selected} onChange={setSelected}>
          {countrylist.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Spacer y={2} />

      <div className="flex justify-end">
        <Button className="mt-4 bg-default-foreground text-background" size="sm">
          Update Profile
        </Button>
      </div>
    </div>
  );
});

AddressSetting.displayName = "AddressSetting";

export default AddressSetting;
