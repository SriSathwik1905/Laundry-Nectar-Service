
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getUserOrders } from '../lib/firebaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Failed to load orders",
          description: "There was an error loading your order history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    // Store the order data in sessionStorage to use it on the dashboard
    sessionStorage.setItem('reorderData', JSON.stringify({
      selectedService: order.service,
      weight: order.weight,
      additionalServices: order.additionalServices,
      instructions: order.instructions,
      garmentList: order.garmentList
    }));
    
    // Navigate to dashboard
    navigate('/dashboard');
    
    toast({
      title: "Order Loaded",
      description: "Previous order details have been loaded. You can review and place your order.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-500 mb-4">You don't have any orders yet</p>
              <Button onClick={() => navigate('/dashboard')}>Place Your First Order</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{order.service.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(order.timestamp), 'PPP')} at {format(new Date(order.timestamp), 'p')}
                      </CardDescription>
                    </div>
                    <Badge>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span>{order.service.name}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span>{order.weight} kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span>₹{order.basePrice.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Additional Services:</span>
                          <span>₹{order.additionalCost.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      {order.garmentList && order.garmentList.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-900 mb-2">Garments</h3>
                          <ul className="space-y-1 text-sm">
                            {order.garmentList.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span className="text-gray-600">{item.name}:</span>
                                <span>{item.quantity} {item.quantity === 1 ? 'piece' : 'pieces'}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {order.additionalServices && order.additionalServices.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-900 mb-2">Additional Services</h3>
                          <ul className="space-y-1 text-sm">
                            {order.additionalServices.map((service, idx) => (
                              <li key={idx} className="text-gray-600">{service.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {order.instructions && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Special Instructions</h3>
                          <p className="text-sm text-gray-600">{order.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => handleReorder(order)}>
                      Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;
