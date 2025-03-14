export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-96 bg-gray-200 animate-pulse rounded mt-2"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="h-[600px] bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
}
