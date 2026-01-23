"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Receipt } from "lucide-react";

interface BillingHistoryProps {
  history: any[] | null;
}

export function BillingHistory({ history }: BillingHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="space-y-6 p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-800/50 
            border border-gray-200 dark:border-gray-700 
            transition-all duration-300
            hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1
            animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          {isOpen ? (
            <>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Receipt className="h-7 w-7 text-green-600" />
                Billing History
              </h3>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Receipt className="h-7 w-7 text-green-600" />
                Billing History
              </h3>
            </>
          )}
        </Button>
      </div>

      {isOpen && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Package
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {history?.map((item: any) => {
                    const isExpired = new Date(item.end_date) < new Date();
                    const isActive = item.is_active && !isExpired;

                    return (
                      <tr
                        key={item.id}
                        className=" transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {item.package?.name || "Unknown Package"}
                        </td>
                        <td className="px-6 py-4">
                          {isActive ? (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Expired</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {new Date(item.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {new Date(item.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {item.package?.price
                            ? `$${item.package.price}`
                            : "Free"}
                        </td>
                      </tr>
                    );
                  })}
                  {(!history || history.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No billing history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
