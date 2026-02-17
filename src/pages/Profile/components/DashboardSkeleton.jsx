import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-pulse">
      
      {/* --- LEFT COLUMN: Daily Overview Skeleton --- */}
      <div className="lg:col-span-4 bg-slate-100 rounded-[2.5rem] min-h-125 p-8 flex flex-col items-center relative border border-slate-100">
        
        {/* Header (Title & Button placeholder) */}
        <div className="w-full flex justify-between items-center mb-10">
          <div className="h-8 w-32 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
        </div>

        {/* Date & Mood Status Text */}
        <div className="flex flex-col items-center gap-3 w-full mb-8">
          <div className="h-6 w-2/3 bg-slate-200 rounded-full"></div>
          <div className="h-10 w-1/2 bg-slate-300 rounded-full"></div>
        </div>

        {/* Big Icon Circle Placeholder */}
        <div className="w-36 h-36 md:w-44 md:h-44 bg-slate-200 rounded-full mb-auto shadow-sm"></div>

        {/* Tags Placeholder (Bottom) */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 w-full">
          <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
          <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: Side Widgets Skeleton --- */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-full">
        
        {/* Top: Recommended Module Skeleton */}
        <div className="bg-slate-100 rounded-[2.5rem] p-8 h-64 flex flex-col border border-slate-100">
          {/* Label Badge */}
          <div className="h-6 w-40 bg-slate-200 rounded-xl mb-6"></div>
          
          {/* Two Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 grow">
            <div className="bg-slate-200 rounded-3xl h-full w-full opacity-70"></div>
            <div className="bg-slate-200 rounded-3xl h-full w-full opacity-70"></div>
          </div>
        </div>

        {/* Bottom: Latest Journal Skeleton */}
        <div className="bg-slate-100 rounded-[2.5rem] p-8 grow min-h-75 flex flex-col border border-slate-100">
          {/* Label Badge */}
          <div className="h-6 w-32 bg-slate-200 rounded-xl mb-6"></div>
          
          {/* Text Block Placeholder */}
          <div className="bg-slate-200 rounded-3xl grow w-full p-6 flex flex-col justify-center gap-3 opacity-60">
             <div className="h-4 w-full bg-slate-300 rounded-full"></div>
             <div className="h-4 w-5/6 bg-slate-300 rounded-full mx-auto"></div>
             <div className="h-4 w-4/6 bg-slate-300 rounded-full mx-auto"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardSkeleton;