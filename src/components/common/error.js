export default function Error({ message }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_104px)]">
      <p className="text-red-500">{message}</p>
    </div>
  );
}