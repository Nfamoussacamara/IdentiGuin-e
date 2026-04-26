import React from 'react';

const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between">
        <div className="h-6 w-48 skeleton rounded"></div>
        <div className="h-10 w-64 skeleton rounded-lg"></div>
      </div>
      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dashboard-border">
              <th className="p-4"><div className="h-4 w-24 skeleton rounded"></div></th>
              <th className="p-4"><div className="h-4 w-16 skeleton rounded"></div></th>
              <th className="p-4"><div className="h-4 w-20 skeleton rounded"></div></th>
              <th className="p-4"><div className="h-4 w-32 skeleton rounded"></div></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, i) => (
              <tr key={i} className="border-b border-dashboard-border">
                <td className="p-4"><div className="h-8 w-40 skeleton rounded-full"></div></td>
                <td className="p-4"><div className="h-8 w-24 skeleton rounded-full"></div></td>
                <td className="p-4"><div className="h-8 w-20 skeleton rounded-full"></div></td>
                <td className="p-4"><div className="h-8 w-full skeleton rounded-full"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;
