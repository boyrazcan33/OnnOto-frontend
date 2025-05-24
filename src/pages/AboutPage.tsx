// src/pages/AboutPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">About OnnOto</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            OnnOto is Estonia's premier electric vehicle charging station reliability platform, 
            designed to help EV drivers find reliable charging stations across the country.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">Our Mission</h2>
          <p className="mb-8">
            Our mission is to improve the electric vehicle charging experience by providing 
            accurate, real-time information about charging station reliability, availability, 
            and functionality.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-3 mb-6">
            <li>Real-time station status information</li>
            <li>Reliability ratings based on historical data</li>
            <li>User-submitted reports about station issues</li>
            <li>Offline access to critical charging station information</li>
            <li>Detailed connector information for each station</li>
          </ul>
          
          <br /><br />
          
          <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">Contact Us</h2>
          <p className="mb-2">
            For questions, feedback, or support, please contact us at:
          </p>
          <p className="font-medium">
            Email: <a href="mailto:onnotoservice@gmail.com" className="text-primary hover:underline">onnotoservice@gmail.com</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;