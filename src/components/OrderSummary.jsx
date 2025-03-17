
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { saveOrder } from '../lib/firebaseService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrderSummary = ({ selectedService, weight, additionalServices, instructions, garmentList, resetOrder }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Calculate base price
  const basePrice = selectedService ? selectedService.price * weight : 0;
  
  // Calculate additional services cost
  const additionalCost = additionalServices.reduce((total, service) => total + service.price, 0);
  
  // Calculate total
  const total = basePrice + additionalCost;

  const handlePlaceOrder = async () => {
    if (!selectedService) {
      toast({
        title: "Error",
        description: "Please select a service before placing an order.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create order object
      const orderData = {
        service: selectedService,
        weight,
        additionalServices,
        instructions,
        garmentList,
        basePrice,
        additionalCost,
        total,
        status: 'Placed',
        orderDate: new Date()
      };
      
      // Save order to Firestore
      await saveOrder(orderData);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your ${selectedService?.name} order has been placed. You will receive a confirmation shortly.`,
      });
      
      // Reset all selections
      if (resetOrder) {
        resetOrder();
      }

      // Navigate to order history
      navigate('/order-history');
    } catch (error) {
      // Show detailed error message in toast
      const errorMessage = error.message || "Unknown error occurred";
      
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Error placing order:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedService ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{selectedService.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Weight:</span>
              <span className="font-medium">{weight} kg</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium">₹{basePrice.toFixed(2)}</span>
            </div>
            
            {garmentList && garmentList.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-gray-600">Garment Details:</span>
                  {garmentList.map((item, idx) => (
                    <div key={idx} className="flex justify-between pl-4">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">{item.quantity} {item.quantity === 1 ? 'piece' : 'pieces'}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {additionalServices.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-gray-600">Additional Services:</span>
                  {additionalServices.map((service, idx) => (
                    <div key={idx} className="flex justify-between pl-4">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium">₹{service.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {instructions && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-gray-600">Special Instructions:</span>
                  <p className="text-sm pl-4 text-gray-500">{instructions}</p>
                </div>
              </>
            )}
            
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">Select a service to see pricing details</p>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <Button 
            className="w-full bg-laundry-600 hover:bg-laundry-700" 
            disabled={!selectedService}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/order-history')}
          >
            View Order History
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
