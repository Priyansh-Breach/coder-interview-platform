import React, { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles: string[];
  userRole: string;
  children: ReactNode;
  path: any;
  loading: any;
  route: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles,
  userRole,
  children,
  path,
  loading,
  route,
}) => {
  if (loading) {
    return;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={route || "/"} replace />;
  }

  // User has the required role, render the Route component
  return <>{children}</>;
};

export default PrivateRoute;