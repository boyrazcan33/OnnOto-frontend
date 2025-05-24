// src/pages/TermsPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';

const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Terms of Use</h1>
        
        <div className="prose max-w-none">
          <p className="text-sm text-gray-500 italic text-right mb-6">
            Last updated: May 24, 2025
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">1. Acceptance of Terms</h2>
          <p className="mb-8">
            By accessing and using the OnnOto application and website (the "Service"), 
            you agree to be bound by these Terms of Use ("Terms"). If you do not agree 
            to these Terms, please do not use our Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">2. Changes to Terms</h2>
          <p className="mb-8">
            We may modify these Terms at any time. We will provide notice of any material 
            changes through the Service. Your continued use of the Service after such notice 
            constitutes your acceptance of the modified Terms.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">3. Using Our Service</h2>
          <p className="mb-8">
            Our Service provides information about electric vehicle charging stations. 
            While we strive for accuracy, we cannot guarantee that the information is 
            always up-to-date or error-free.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">4. User Contributions</h2>
          <p className="mb-8">
            You may submit reports about charging stations. By submitting content, you 
            grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
            modify, and display such content in connection with the Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">5. Prohibited Activities</h2>
          <p className="mb-2">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-6">
            <li>Use the Service for any unlawful purpose</li>
            <li>Submit false or misleading information</li>
            <li>Interfere with the proper operation of the Service</li>
            <li>Attempt to bypass any security measures</li>
            <li>Use the Service in any way that could damage or overburden it</li>
          </ul>
          
          <br /><br />
          
          <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">6. Disclaimer of Warranties</h2>
          <p className="mb-8">
            The Service is provided "as is" without warranties of any kind, either express 
            or implied. We do not guarantee the accuracy, completeness, or reliability of 
            the content available through our Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">7. Limitation of Liability</h2>
          <p className="mb-8">
            To the maximum extent permitted by law, OnnOto shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages resulting 
            from your use of or inability to use the Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-primary border-b pb-2">8. Contact Information</h2>
          <p className="mb-2">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="font-medium">
            <a href="mailto:onnotoservice@gmail.com" className="text-primary hover:underline">onnotoservice@gmail.com</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;