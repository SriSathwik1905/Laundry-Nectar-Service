
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import OrderSummary from '../components/OrderSummary';
import GarmentSelector from '../components/GarmentSelector';
import { services } from '../data/services';
import { additionalServices } from '../data/additionalServices';
import { garmentTypes } from '../data/garmentTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [weight, setWeight] = useState(5); // Default in kg
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [garmentList, setGarmentList] = useState([]);

  useEffect(() => {
    // Check if there's reorder data in sessionStorage
    const reorderData = sessionStorage.getItem('reorderData');
    if (reorderData) {
      try {
        const parsedData = JSON.parse(reorderData);
        setSelectedService(parsedData.selectedService);
        setWeight(parsedData.weight || 5);
        setSelectedAdditionalServices(parsedData.additionalServices || []);
        setInstructions(parsedData.instructions || '');
        setGarmentList(parsedData.garmentList || []);
        
        // Clear the sessionStorage after loading
        sessionStorage.removeItem('reorderData');
        
        toast({
          title: "Previous Order Loaded",
          description: "You can review and modify your order before placing it.",
        });
      } catch (error) {
        console.error("Error loading reorder data:", error);
      }
    }
  }, []);

  const resetOrder = () => {
    setSelectedService(null);
    setWeight(5);
    setSelectedAdditionalServices([]);
    setInstructions('');
    setGarmentList([]);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    toast({
      title: "Service selected",
      description: `You've selected ${service.name}`,
    });
  };

  const handleAdditionalServiceToggle = (service) => {
    setSelectedAdditionalServices((prev) => {
      if (prev.some(s => s.id === service.id)) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleGarmentChange = (garmentId, quantity) => {
    setGarmentList(prevList => {
      const garment = garmentTypes.find(g => g.id === garmentId);
      
      if (quantity === 0) {
        return prevList.filter(item => item.id !== garmentId);
      }
      
      if (prevList.some(item => item.id === garmentId)) {
        return prevList.map(item => 
          item.id === garmentId ? { ...item, quantity } : item
        );
      }
      
      return [...prevList, { id: garmentId, name: garment.name, quantity }];
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.email}</h1>
        <p className="text-gray-600 mb-8">Place an order for laundry services below.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Service</CardTitle>
                <CardDescription>Choose the service that best fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <ServiceCard 
                      key={service.id}
                      service={service}
                      selected={selectedService?.id === service.id}
                      onSelect={handleServiceSelect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Select Garments</CardTitle>
                <CardDescription>Tell us what items you're sending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {garmentTypes.map((garment) => (
                    <GarmentSelector
                      key={garment.id}
                      garment={garment}
                      onChange={(quantity) => handleGarmentChange(garment.id, quantity)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estimate Weight</CardTitle>
                <CardDescription>Drag the slider to estimate your laundry weight</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>0 kg</span>
                    <span>25 kg</span>
                  </div>
                  <Slider
                    defaultValue={[5]}
                    max={25}
                    step={0.5}
                    onValueChange={(value) => setWeight(value[0])}
                  />
                </div>
                <div className="text-center font-medium">
                  Estimated Weight: {weight} kg
                </div>
                <div className="text-sm text-gray-500 text-center">
                  For reference: A full load of laundry is typically 4-6 kilograms
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
                <CardDescription>Enhance your laundry experience with these add-ons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalServices.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-md">
                      <Checkbox 
                        id={service.id} 
                        checked={selectedAdditionalServices.some(s => s.id === service.id)}
                        onCheckedChange={() => handleAdditionalServiceToggle(service)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={service.id} className="font-medium">{service.name} - ₹{service.price.toFixed(2)}</Label>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
                <CardDescription>Let us know if you have any specific requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="E.g., Use cold water for colored items, handle with care, etc."
                  className="min-h-[100px]"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:sticky lg:top-4 self-start">
            <OrderSummary 
              selectedService={selectedService}
              weight={weight}
              additionalServices={selectedAdditionalServices}
              instructions={instructions}
              garmentList={garmentList}
              resetOrder={resetOrder}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
