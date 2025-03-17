
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ShirtIcon, Sparkles, Tag, MessageSquare, Clock } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-laundry-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Fresh. Clean. <span className="text-laundry-600">Delivered.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional laundry service that makes your life easier. We pick up, clean, and deliver your laundry right to your door.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button className="bg-laundry-600 hover:bg-laundry-700 text-white text-lg py-6 px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-laundry-600 text-laundry-600 hover:bg-laundry-50 text-lg py-6 px-8">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How LaundryNectar Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <ShirtIcon className="h-12 w-12 text-laundry-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Services</h3>
              <p className="text-gray-600">Select from our range of laundry services based on your needs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <MessageSquare className="h-12 w-12 text-laundry-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Instructions</h3>
              <p className="text-gray-600">Provide special instructions for handling your garments.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Tag className="h-12 w-12 text-laundry-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">See Clear Pricing</h3>
              <p className="text-gray-600">No hidden fees. Know exactly what you're paying for.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 text-laundry-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Fresh Clothes</h3>
              <p className="text-gray-600">Receive your clean, fresh laundry delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-laundry-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Never Do Laundry Again?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who have reclaimed their time.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-laundry-600 hover:bg-gray-100 text-lg py-6 px-8">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
