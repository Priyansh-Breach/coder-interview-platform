import { CircleUser } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ExploreIcon,
  ProfileIcon,
  LogoutIcon,
  LoadingIcon,
} from "./ui/Icons/SelectMore";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useSelector } from "react-redux";
import { useUserLoggedOutMutation } from "@/redux/features/Auth/authApi";

export const ProfileComponent = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [logout, { isLoading }] = useUserLoggedOutMutation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-sm">
          {user ? <>{user?.email}</> : <>My Account</>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!user && (
          <DropdownMenuItem onClick={() => navigate("/login")}>
            <ProfileIcon />
            Login
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => navigate("/explore")}>
          <ExploreIcon />
          Explore
        </DropdownMenuItem>
        {user && (
          <DropdownMenuItem
            onClick={async () => {
              await logout(() => {});
              location.reload();
            }}
          >
            {isLoading && (
              <>
                {" "}
                <LoadingIcon /> {"Logout"}{" "}
              </>
            )}
            {!isLoading && (
              <>
                <LogoutIcon />
                {"Logout"}
              </>
            )}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="p-0 mt-2">
          <ModeToggle />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
