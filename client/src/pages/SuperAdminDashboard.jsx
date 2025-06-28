import {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
  } from "../features/superadminApi";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Badge } from "@/components/ui/badge";
  import { toast } from "sonner";
  import { useNavigate } from "react-router-dom";
  import { useSelector } from "react-redux";
  
  export default function SuperAdminDashboard() {
    const { data: users, isLoading } = useGetAllUsersQuery();
    const [updateRole] = useUpdateUserRoleMutation();
    const [deleteUser] = useDeleteUserMutation();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
  
    const handleRoleChange = (id, role, currentRole) => {
      // Prevent role change for super admin users
      if (currentRole === 'superadmin') {
        toast.error("Cannot change role of Super Admin users");
        return;
      }
      
      updateRole({ id, role })
        .unwrap()
        .then(() => toast.success("Role updated"))
        .catch(() => toast.error("Failed to update role"));
    };
  
    const handleDelete = (id, role) => {
      // Prevent deletion of super admin users
      if (role === 'superadmin') {
        toast.error("Cannot delete Super Admin users");
        return;
      }
      
      if (window.confirm("Are you sure you want to delete this user?")) {
        deleteUser(id)
          .unwrap()
          .then(() => toast.success("User deleted"))
          .catch(() => toast.error("Failed to delete user"));
      }
    };
  
    const viewUserDashboard = (user) => {
      // Prevent viewing dashboard for super admin users
      if (user.role === 'superadmin') {
        toast.error("Cannot view dashboard for Super Admin users");
        return;
      }
      
      navigate(`/superadmin/user-dashboard/${user._id}?role=${user.role}`);
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Super Admin – Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <div className="grid gap-4">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className={`flex justify-between items-center border p-4 rounded-xl shadow-sm ${
                    user.role === 'superadmin' ? 'bg-red-50 border-red-200' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{user.name}</p>
                      {user.role === 'superadmin' && (
                        <Badge variant="destructive" className="text-xs">
                          Super Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-blue-600 font-medium capitalize">{user.role}</p>
                  </div>
      
                  <div className="flex items-center gap-4">
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user._id, value, user.role)
                      }
                      disabled={user.role === 'superadmin'}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
      
                    <Button
                      variant="secondary"
                      onClick={() => viewUserDashboard(user)}
                      disabled={user.role === 'superadmin'}
                    >
                      View Dashboard
                    </Button>
      
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(user._id, user.role)}
                      disabled={user.role === 'superadmin'}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  