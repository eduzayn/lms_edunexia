import * as React from "react";

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-6"></div>
      
      {/* User Stats Loading */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
      
      {/* Tabs Loading */}
      <div className="flex border-b mb-6">
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded mr-4"></div>
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded mr-4"></div>
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
      
      {/* Chat Loading */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="border rounded-md overflow-hidden h-[600px]">
            <div className="p-4 border-b">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="border rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
