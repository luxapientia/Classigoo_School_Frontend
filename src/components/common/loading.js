import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_104px)]">
      <Spinner color="success" />
    </div>
  );
}
