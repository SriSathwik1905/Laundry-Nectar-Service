
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileHeader = ({ displayName, email, photoURL }) => {
  const isMobile = useIsMobile();
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <CardHeader className="space-y-1">
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-center space-x-4'}`}>
        <Avatar className={`${isMobile ? 'h-16 w-16 mb-3' : 'h-20 w-20'}`}>
          {photoURL ? (
            <AvatarImage src={photoURL} alt={displayName} />
          ) : (
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          )}
        </Avatar>
        <div className={isMobile ? "text-center" : ""}>
          <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'}`}>{displayName || email}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};

export default ProfileHeader;
