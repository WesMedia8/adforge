import axios from 'axios';

const META_API_VERSION = 'v18.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaAPIClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, method = 'GET', data?: any): Promise<T> {
    const url = `${META_API_BASE}${endpoint}`;
    
    try {
      const response = await axios({
        method,
        url,
        params: method === 'GET' ? { access_token: this.accessToken, ...data } : { access_token: this.accessToken },
        data: method !== 'GET' ? data : undefined,
      });
      return response.data;
    } catch (error: any) {
      const metaError = error.response?.data?.error;
      if (metaError) {
        throw new Error(`Meta API Error: ${metaError.message} (Code: ${metaError.code})`);
      }
      throw error;
    }
  }

  async getAdAccounts(): Promise<any> {
    return this.request('/me/adaccounts?fields=id,name,account_status,currency,timezone_name');
  }

  async getCampaigns(adAccountId: string): Promise<any> {
    return this.request(`/act_${adAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time`);
  }

  async createCampaign(adAccountId: string, campaignData: any): Promise<any> {
    return this.request(`/act_${adAccountId}/campaigns`, 'POST', campaignData);
  }

  async getAdSets(campaignId: string): Promise<any> {
    return this.request(`/${campaignId}/adsets?fields=id,name,status,targeting,daily_budget,bid_amount,optimization_goal`);
  }

  async createAdSet(campaignId: string, adSetData: any): Promise<any> {
    // Get the ad account from the campaign
    const campaign = await this.request<any>(`/${campaignId}?fields=account_id`);
    return this.request(`/act_${campaign.account_id}/adsets`, 'POST', {
      ...adSetData,
      campaign_id: campaignId,
    });
  }

  async getAds(adSetId: string): Promise<any> {
    return this.request(`/${adSetId}/ads?fields=id,name,status,creative,tracking_specs`);
  }

  async createAd(adSetId: string, adData: any): Promise<any> {
    const adSet = await this.request<any>(`/${adSetId}?fields=account_id`);
    return this.request(`/act_${adSet.account_id}/ads`, 'POST', {
      ...adData,
      adset_id: adSetId,
    });
  }

  async createAdCreative(adAccountId: string, creativeData: any): Promise<any> {
    return this.request(`/act_${adAccountId}/adcreatives`, 'POST', creativeData);
  }

  async getInsights(objectId: string, datePreset = 'last_30d'): Promise<any> {
    return this.request(`/${objectId}/insights?fields=impressions,clicks,spend,ctr,cpm,cpp,reach,frequency,actions&date_preset=${datePreset}`);
  }

  async uploadImage(adAccountId: string, imageUrl: string): Promise<any> {
    return this.request(`/act_${adAccountId}/adimages`, 'POST', {
      url: imageUrl,
    });
  }
}

export function createMetaClient(accessToken: string): MetaAPIClient {
  return new MetaAPIClient(accessToken);
}
