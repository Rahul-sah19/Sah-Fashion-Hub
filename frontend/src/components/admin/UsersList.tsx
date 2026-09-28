import { useEffect, useState } from "react";
import { ErrorMessage, formatDate } from "@/components/ui";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<{ users: User[] }>("/admin/users")
      .then((r) => setUsers(r.users))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} />
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${u.role === "admin" ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
