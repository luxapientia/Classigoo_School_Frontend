"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
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

const ProfileSetting = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2", className)} {...props}>
    {/* Profile */}
    <div>
      <Card className="mt-4 bg-default-100" shadow="none">
        <CardBody>
          <Badge
            classNames={{
              badge: `py-0.5 px-3`,
            }}
            content={!props.is_plus ? "Plus" : "Free"}
            placement="top-right"
            shape="rectangle"
            className={`text-background text-xs font-semibold rounded-md ${
              props.is_plus == "true" ? "bg-[#fdcb6e] text-gray-700" : "bg-[#6c5ce7]"
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
                <Avatar className="h-16 w-16" src={props.avatar} alt="Profile Picture" name="Kate Moore" />
              </Badge>
              <div>
                <p className="text-sm font-medium text-default-600">
                  {props.name}
                  {/* badge showing free o plus */}
                </p>
                <p className="text-xs text-default-400">{props.email}</p>
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
      <Input className="mt-2" placeholder="e.g John Doe" required />
    </div>
    <Spacer y={4} />
    {/* Birthadate */}
    <div>
      <p className="text-base font-medium text-default-700">Birthdate</p>
      <p className="mt-1 text-sm font-normal text-default-400">Set your birthdate.</p>
      <DatePicker format="dd/MM/yyyy" required />
    </div>
    <Spacer y={4} />
    {/* Email */}
    <div>
      <p className="text-base font-medium text-default-700">Email Address</p>
      <p className="mt-1 text-sm font-normal text-default-400">Check your email address. (Read-only)</p>
      <Input className="mt-2" value={props.email} disabled />
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
      />
    </div>
    <Spacer y={4} />
    {/* School / College / University */}
    <div>
      <p className="text-base font-medium text-default-700">School / College / University</p>
      <p className="mt-1 text-sm font-normal text-default-400">Set your current school, college or university.</p>
      <Input className="mt-2" placeholder="e.g New York University" required />
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
      />
    </div>
    <div className="flex justify-end">
      <Button className="mt-4 bg-default-foreground text-background" size="sm">
        Update Profile
      </Button>
    </div>
  </div>
));

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;
