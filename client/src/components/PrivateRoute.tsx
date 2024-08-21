// PrivateRoute.tsx

import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useLoadUserQuery } from "@/redux/features/Api/apiSlice";
import { LoadingIcon } from "./ui/Icons/SelectMore";

interface PrivateRouteProps {
  allowedRoles: string[];
  userRole: string | null | undefined;
  children: ReactNode;
  loading: boolean;
  route: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles,
  children,
  route,
}) => {
  const { isLoading, data } = useLoadUserQuery(undefined, {});

  if (isLoading) {
    return (
      <div className="h-screen flex gap-2 items-center justify-center" >
        <LoadingIcon />
        <p>{"Loading..."}</p>
      </div>
    );
  }

  if (!data?.user?.role) {
    return <Navigate to={route || "/login"} replace />;
  }

  if (!allowedRoles.includes(data?.user?.role)) {
    return <Navigate to={route || "/login"} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
