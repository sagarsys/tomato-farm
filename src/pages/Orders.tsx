"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DefaultLayout from "../layout/DefaultLayout";

export const ordersData = [
  {
    id: 1,
    farm_id: 1,
    date: "2021-03-15",
    quantity: 1020,
  }, {
    id: 2,
    farm_id: 3,
    date: "2021-01-02",
    quantity: 2200,
  }, {
    id: 3,
    farm_id: 2,
    date: "2021-02-25",
    quantity: 800,
  }, {
    id: 4,
    farm_id: 4,
    date: "2023-03-15",
    quantity: 1200,
  }, {
    id: 5,
    farm_id: 5,
    date: "2020-07-11",
    quantity: 1500,
  }, {
    id: 6,
    farm_id: 5,
    date: "2021-06-13",
    quantity: 2000,
  }, {
    id: 7,
    farm_id: 7,
    date: "2022-08-22",
    quantity: 1000,
  }, {
    id: 8,
    farm_id: 7,
    date: "2023-10-25",
    quantity: 1500,
  }, {
    id: 9,
    farm_id: 9,
    date: "2021-11-05",
    quantity: 1800,
  }, {
    id: 10,
    farm_id: 10,
    date: "2020-12-09",
    quantity: 2200,
    status: 'received',
  }, {
    id: 11,
    farm_id: 6,
    date: "2022-01-02",
    quantity: 1400,
  }, {
    id: 12,
    farm_id: 8,
    date: "2023-03-15",
    quantity: 1200,
  }, {
    id: 13,
    farm_id: 8,
    date: "2021-06-13",
    quantity: 2000,
  }, {
    id: 14,
    farm_id: 6,
    date: "2022-08-22",
    quantity: 1000,
  }, {
    id: 15,
    farm_id: 10,
    date: "2023-10-25",
    quantity: 1500,
  }, {
    id: 16,
    farm_id: 9,
    date: "2021-11-05",
    quantity: 1800,
  }, {
    id: 17,
    farm_id: 4,
    date: "2020-12-09",
    quantity: 2200,
  }, {
    id: 18,
    farm_id: 3,
    date: "2022-01-02",
    quantity: 1400,
  }
]

export default function Orders() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Farm</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-accent">
                <TableCell>
                  <div className="font-medium">Farm name</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  2023-06-23
                </TableCell>
                <TableCell className="text-right">250 kg</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
