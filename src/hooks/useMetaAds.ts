import { useState, useCallback } from 'react';
import { MetaCampaign, MetaAdSet, MetaAd } from '@/lib/meta-types';

interface UseMetaAdsOptions {
  userId: string;
}

export function useMetaAds({ userId }: UseMetaAdsOptions) {
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [adSets, setAdSets] = useState<MetaAdSet[]>([]);
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/meta/campaigns?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      setCampaigns(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchAdSets = useCallback(async (campaignId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/meta/adsets?user_id=${userId}&campaign_id=${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch ad sets');
      const data = await response.json();
      setAdSets(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchAds = useCallback(async (adSetId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/meta/ads?user_id=${userId}&adset_id=${adSetId}`);
      if (!response.ok) throw new Error('Failed to fetch ads');
      const data = await response.json();
      setAds(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createCampaign = useCallback(async (campaignData: Partial<MetaCampaign>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/meta/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, campaignData }),
      });
      if (!response.ok) throw new Error('Failed to create campaign');
      const result = await response.json();
      await fetchCampaigns();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchCampaigns]);

  return {
    campaigns,
    adSets,
    ads,
    isLoading,
    error,
    fetchCampaigns,
    fetchAdSets,
    fetchAds,
    createCampaign,
  };
}
