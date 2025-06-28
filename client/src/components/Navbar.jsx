import React, { useEffect } from "react";
import { Menu, School } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "@/features/authSlice";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseApi } from "@/features/api/courseApi";
import { authApi } from "@/features/api/authApi";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await logoutUser();
    dispatch(userLoggedOut());
    dispatch(purchaseApi.util.resetApiState());
    dispatch(courseApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
          <h1 className="hidden md:block font-extrabold text-2xl">
            PATASHALA
          </h1>
          </Link>
        </div>
        {/* User Icon and dark mode icon */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user?.role === "student" && (
                    <DropdownMenuItem>
                      <Link to="my-learning">My Learning</Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === "instructor" && (
                    <DropdownMenuItem>
                      <Link to="my-learning">My Courses</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link to="profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {
                  user?.role === "instructor" && (
                    <>
                  <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>navigate("admin/Dashboard")}>Dashboard</DropdownMenuItem>
                    </>
                  )}
                {user?.role === "superadmin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/superadmin/dashboard")}>Superadmin Dashboard</DropdownMenuItem>
                  </>
                )}
               
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
                <Button onClick={()=>navigate("/login")}>Signup</Button>
                <Link to="/contactUs">Contact Us</Link>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden justify-between items-center gap-2 h-full px-4">
        <h1 className="font-extrabold text-2xl" ><Link to="/">PATASHALA</Link></h1>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }) => {
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await logoutUser();
    dispatch(userLoggedOut());
    dispatch(purchaseApi.util.resetApiState());
    dispatch(courseApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 hover:bg-gary-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle><Link to="/">PATASHALA</Link></SheetTitle>

          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          {user?.role === "student" && <Link to="my-learning">My Learning</Link>}
          {user?.role === "instructor" && <Link to="my-learning">My Courses</Link>}
          <Link to="profile">Edit Profile</Link>
          <span onClick={logoutHandler}>Log Out</span>
        </nav>

        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={() => navigate("admin/Dashboard")}>Dash Board</Button>
            </SheetClose>
          </SheetFooter>
        )}
        {user?.role === "superadmin" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={() => navigate("/superadmin/dashboard")}>Superadmin Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
