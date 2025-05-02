import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import ReportForm from '../components/reports/ReportForm';
import ReportConfirmation from '../components/reports/ReportConfirmation';
import Loader from '../components/common/Loader';
import stationsApi from '../api/stationsApi';

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [stationName, setStationName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch station details
  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const stationData = await stationsApi.getStationById(id);
        setStationName(stationData.name);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching station details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [id]);

  const handleReportSuccess = () => {
    setSubmitted(true);
  };

  const handleBackToStation = () => {
    navigate(`/station/${id}`);
  };

  const handleSubmitAnotherReport = () => {
    setSubmitted(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="report-page__loading">
          <Loader text={t('reports.loading')} />
        </div>
      </MainLayout>
    );
  }

  if (error || !id) {
    return (
      <MainLayout>
        <div className="report-page__error">
          <h1>{t('reports.errorLoading')}</h1>
          <p>{error?.message || t('reports.stationNotFound')}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="report-page">
        {submitted ? (
          <ReportConfirmation
            stationName={stationName}
            onBackToStation={handleBackToStation}
            onSubmitAnotherReport={handleSubmitAnotherReport}
          />
        ) : (
          <ReportForm
            stationId={id}
            stationName={stationName}
            onSuccess={handleReportSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ReportPage;