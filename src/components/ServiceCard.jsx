
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const ServiceCard = ({ service, selected, onSelect }) => {
  return (
    <Card className={`transition-all duration-200 ${selected ? 'border-laundry-500 shadow-lg' : 'border-gray-200'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">₹{service.price.toFixed(2)}<span className="text-sm text-gray-500 font-normal">{service.unit}</span></div>
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <Check className="h-5 w-5 shrink-0 text-laundry-500 mr-2" />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSelect(service)}
          className={`w-full ${selected ? 'bg-laundry-600 hover:bg-laundry-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant={selected ? 'default' : 'outline'}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
