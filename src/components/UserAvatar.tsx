import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Verified } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  showVerified?: boolean;
  showName?: boolean;
  className?: string;
}

export function UserAvatar({
  size = "md",
  showVerified = false,
  showName = false,
  className,
}: UserAvatarProps) {
  const { user } = useUser();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>

        {showVerified && user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <Verified className="h-3 w-3 text-blue-500" />
          </div>
        )}
      </div>

      {showName && (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </span>
          {showVerified && user.isVerified && (
            <Verified className="h-4 w-4 text-blue-500" />
          )}
        </div>
      )}
    </div>
  );
}
