import { Project } from './types';

export { Project };

export const defaultProject: Project = {
  id: '',
  businessName: '',
  website: '',
  industry: '',
  product: '',
  targetAudience: '',
  valueProposition: '',
  competitors: [],
  goals: [],
  budget: '',
  research: null,
  ads: [],
  selectedAds: [],
  images: [],
  metaConnection: null,
  status: 'setup',
};
