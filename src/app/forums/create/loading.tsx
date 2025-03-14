import * as React from "react";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <div className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span className="h-4 w-24 bg-gray-200 animate-pulse rounded"></span>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-96 bg-gray-200 animate-pulse rounded mt-2"></div>
      </div>
      
      <div className="border rounded-md overflow-hidden mb-8">
        <div className="p-4 bg-muted">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded mt-1"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mt-1"></div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
          
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}
