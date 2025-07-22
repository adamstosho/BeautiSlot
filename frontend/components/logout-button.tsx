"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Clear auth context (implement in auth-context if not present)
    router.push("/auth/login");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
} 