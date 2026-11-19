export interface NavItem {
  label: string;
  href: string;
}

export interface MetricItem {
  id: string;
  value: string;
  unit?: string;
  label: string;
  sublabel: string;
}

export interface ExperienceItem {
  id: string;
  index: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  focus: string;
  highlights: string[];
  tags: string[];
}

export interface LeadershipItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  category: string;
  description: string;
  span?: 'wide' | 'tall' | 'standard';
  featured?: boolean;
}

export interface IeltsScoreItem {
  skill: string;
  shortLabel: string;
  score: number;
  maxScore: number;
}

export interface IeltsBreakdown {
  overall: number;
  maxScore: number;
  cefrLevel: string;
  testDate: string;
  scores: IeltsScoreItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  minor?: string;
  period: string;
  location: string;
  gpa?: string;
  details: string[];
}

export interface LanguageItem {
  name: string;
  proficiency: string;
  detail: string;
  levelPercent: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  phoneHref: string;
  linkedin: string;
  linkedinHandle: string;
  resumeUrl: string;
  resumeFilename: string;
  location: string;
}

export interface PortfolioContent {
  meta: {
    monogram: string;
    name: string;
    firstName: string;
    lastName: string;
    location: string;
    headline: string;
    availability: string;
    portraitUrl: string;
    portraitAlt: string;
    heroSummary: string;
    editorialNote: string;
  };
  navigation: NavItem[];
  metrics: MetricItem[];
  experience: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ExperienceItem[];
  };
  leadership: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: LeadershipItem[];
  };
  education: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: EducationItem[];
    ielts: IeltsBreakdown;
  };
  skills: {
    technical: string[];
    competencies: string[];
    languages: LanguageItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    availabilityNote: string;
    info: ContactInfo;
  };
  footer: {
    note: string;
  };
}
