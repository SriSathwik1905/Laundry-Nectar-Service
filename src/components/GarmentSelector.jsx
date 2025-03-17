
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

const GarmentSelector = ({ garment, onChange }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 0;
    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  // Reset quantity when garmentList is reset
  useEffect(() => {
    const garmentListItem = document.querySelector(`[data-garment-id="${garment.id}"]`);
    if (garmentListItem === null || garmentListItem === undefined) {
      setQuantity(0);
    }
  }, [garment.id]);

  return (
    <Card className="border border-gray-200" data-garment-id={garment.id}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{garment.name}</p>
            <p className="text-sm text-gray-500">{garment.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full"
              onClick={handleDecrement}
              disabled={quantity <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              min="0"
              className="h-8 w-14 text-center"
            />
            
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GarmentSelector;
