
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const PersonalInfoForm = ({ profileData, handleInputChange, handleSubmit, loading }) => {
  const isMobile = useIsMobile();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Personal Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="displayName">Full Name</Label>
          <Input 
            id="displayName"
            name="displayName"
            value={profileData.displayName || ''}
            onChange={handleInputChange}
            placeholder="Your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="photoURL">Profile Photo URL</Label>
          <Input 
            id="photoURL"
            name="photoURL"
            value={profileData.photoURL || ''}
            onChange={handleInputChange}
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone"
            name="phone"
            value={profileData.phone || ''}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Address Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input 
            id="address"
            name="address"
            value={profileData.address || ''}
            onChange={handleInputChange}
            placeholder="123 Main St, Apt 4B"
          />
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-3 gap-4'}`}>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city"
              name="city"
              value={profileData.city || ''}
              onChange={handleInputChange}
              placeholder="New York"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state"
              name="state"
              value={profileData.state || ''}
              onChange={handleInputChange}
              placeholder="NY"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input 
              id="zipCode"
              name="zipCode"
              value={profileData.zipCode || ''}
              onChange={handleInputChange}
              placeholder="10001"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Laundry Preferences</h2>
        
        <div className="space-y-2">
          <Label htmlFor="preferredDetergent">Preferred Detergent</Label>
          <Input 
            id="preferredDetergent"
            name="preferredDetergent"
            value={profileData.preferredDetergent || ''}
            onChange={handleInputChange}
            placeholder="Brand name or 'Fragrance-free'"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fabricSoftener">Fabric Softener</Label>
          <select
            id="fabricSoftener"
            name="fabricSoftener"
            value={profileData.fabricSoftener || 'Yes'}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specialInstructions">Special Instructions</Label>
          <Textarea 
            id="specialInstructions"
            name="specialInstructions"
            value={profileData.specialInstructions || ''}
            onChange={handleInputChange}
            placeholder="Any special requests for your laundry service"
            rows={4}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-laundry-600 hover:bg-laundry-700" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Profile
          </>
        ) : "Save Profile"}
      </Button>
    </form>
  );
};

export default PersonalInfoForm;
