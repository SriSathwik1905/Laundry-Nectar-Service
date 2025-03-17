
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateUserProfileData } from '../lib/firebaseService';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import PasswordChangeForm from '../components/profile/PasswordChangeForm';

const Profile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // User profile data state
  const [profileData, setProfileData] = useState({
    displayName: '',
    photoURL: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    specialInstructions: '',
    preferredDetergent: '',
    fabricSoftener: 'Yes'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Load existing profile data whenever userProfile changes
    if (userProfile) {
      setProfileData(prevData => ({
        ...prevData,
        displayName: userProfile.displayName || '',
        photoURL: userProfile.photoURL || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        zipCode: userProfile.zipCode || '',
        phone: userProfile.phone || '',
        specialInstructions: userProfile.specialInstructions || '',
        preferredDetergent: userProfile.preferredDetergent || '',
        fabricSoftener: userProfile.fabricSoftener || 'Yes'
      }));
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user types
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update auth profile (display name and photo)
      await updateUserProfile(profileData.displayName, profileData.photoURL);
      
      // Update additional profile data in Firestore
      const additionalData = {
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zipCode: profileData.zipCode,
        phone: profileData.phone,
        specialInstructions: profileData.specialInstructions,
        preferredDetergent: profileData.preferredDetergent,
        fabricSoftener: profileData.fabricSoftener
      };
      
      await updateUserProfileData(additionalData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err.message || "There was an error updating your profile.",
        icon: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password inputs
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setPasswordLoading(true);
    setPasswordError('');
    
    try {
      const user = auth.currentUser;
      
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        user.email, 
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Then update password
      await updatePassword(user, passwordData.newPassword);
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError(error.message || 'Failed to update password');
      }
      
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: error.message || "There was an error updating your password.",
        icon: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-laundry-700">Your Profile</h1>
        
        <Card className="shadow-md">
          {userProfile && (
            <ProfileHeader 
              displayName={profileData.displayName} 
              email={userProfile.email}
              photoURL={profileData.photoURL}
            />
          )}
          
          <CardContent className="pt-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="text-sm md:text-base">Profile Information</TabsTrigger>
                <TabsTrigger value="password" className="text-sm md:text-base">Change Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <PersonalInfoForm 
                  profileData={profileData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  loading={loading}
                />
              </TabsContent>
              
              <TabsContent value="password">
                <PasswordChangeForm 
                  passwordData={passwordData}
                  handlePasswordChange={handlePasswordChange}
                  handlePasswordSubmit={handlePasswordSubmit}
                  passwordLoading={passwordLoading}
                  passwordError={passwordError}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
