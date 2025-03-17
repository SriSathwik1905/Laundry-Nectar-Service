
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const PasswordChangeForm = ({ 
  passwordData, 
  handlePasswordChange, 
  handlePasswordSubmit, 
  passwordLoading, 
  passwordError 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-4">
      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input 
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter your current password"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input 
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter your new password"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input 
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm your new password"
            required
          />
        </div>
        
        {passwordError && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{passwordError}</div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-laundry-600 hover:bg-laundry-700" 
        disabled={passwordLoading}
      >
        {passwordLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Password
          </>
        ) : "Change Password"}
      </Button>
    </form>
  );
};

export default PasswordChangeForm;
