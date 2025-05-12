
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WorkspaceMember } from "@/types/taskTypes";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreVertical, UserMinus, UserCog } from "lucide-react";

interface MembersListProps {
  members: WorkspaceMember[];
  currentUserId: string;
  isManager: boolean;
  onUpdateRole: (id: string, role: "member" | "manager") => Promise<void>;
  onRemoveMember: (id: string) => Promise<void>;
}

const MembersList: React.FC<MembersListProps> = ({
  members,
  currentUserId,
  isManager,
  onUpdateRole,
  onRemoveMember,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatJoinDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch (e) {
      return "Date inconnue";
    }
  };

  return (
    <div className="rounded-md border">
      <div className="p-4 bg-muted/50">
        <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
          <div className="col-span-5">Membre</div>
          <div className="col-span-3">Rôle</div>
          <div className="col-span-3">A rejoint</div>
          <div className="col-span-1"></div>
        </div>
      </div>
      <div className="divide-y">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-12 items-center p-4 hover:bg-muted/50"
          >
            <div className="col-span-5 flex items-center gap-3">
              <Avatar>
                {member.avatarUrl && (
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                )}
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">
                  {member.email}
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <Badge
                variant={member.role === "manager" ? "default" : "outline"}
                className="font-normal"
              >
                {member.role === "manager" ? "Gestionnaire" : "Membre"}
              </Badge>
            </div>
            <div className="col-span-3 text-sm text-muted-foreground">
              {formatJoinDate(member.joinedAt)}
            </div>
            <div className="col-span-1 flex justify-end">
              {isManager && member.id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onUpdateRole(
                          member.id,
                          member.role === "manager" ? "member" : "manager"
                        )
                      }
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>
                        {member.role === "manager"
                          ? "Définir comme Membre"
                          : "Définir comme Gestionnaire"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
