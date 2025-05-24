// src/pages/PrivacyPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-sm text-gray-500 italic text-right mb-6">
            Last updated: May 24, 2025
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">Introduction</h2>
          <p className="mb-8">
            This Privacy Policy describes how OnnOto ("we", "us", or "our") collects, uses, and 
            discloses your information when you use our mobile application and website (the "Service").
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-700">Device Information</h3>
          <p className="mb-5">
            We generate and store a unique device ID to identify your device. This helps us provide 
            personalized features like favorite stations without requiring account creation.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-700">Location Data</h3>
          <p className="mb-5">
            With your permission, we collect your device's location to show nearby charging stations. 
            You can disable location access through your device settings at any time.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-700">Usage Data</h3>
          <p className="mb-6">
            We collect anonymous usage data to improve our service, including app interactions, 
            feature usage, and error reports.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-3 mb-6">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          
          <br /><br />
          
          <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">Data Retention</h2>
          <p className="mb-8">
            We will retain your information only for as long as is necessary for the purposes 
            set out in this Privacy Policy.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">Contact Us</h2>
          <p className="mb-2">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="font-medium">
            <a href="mailto:onnotoservice@gmail.com" className="text-primary hover:underline">onnotoservice@gmail.com</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;