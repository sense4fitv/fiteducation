import { createClient } from "@/lib/supabase/server";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function EnrollmentsPage() {
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, products(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Enrollments</h1>
      </div>

      {!enrollments || enrollments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No enrollments yet
          </h3>
          <p className="text-gray-500">
            Enrollments will appear here once users start signing up for courses and workshops.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="text-gray-900">
                    {enrollment.user_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {(enrollment.products as { title: string } | null)?.title ?? "\u2014"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        enrollment.status === "paid_stripe" || enrollment.status === "paid_manual"
                          ? "default"
                          : enrollment.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {enrollment.amount_paid
                      ? `${enrollment.amount_paid} RON`
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {enrollment.created_at
                      ? new Date(enrollment.created_at).toLocaleDateString("ro-RO")
                      : "\u2014"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
