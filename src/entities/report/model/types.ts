export interface RoleEntry {
  role: string;
  jobs: number;
  pct: number;
}

export interface DistributionEntry {
  value: string;
  jobs: number;
  pct: number;
}

export interface SkillEntry {
  rank: number;
  skill: string;
  category: string;
  jobs: number;
  pct: number;
}

export interface RoleSkillData {
  total_jobs: number;
  top_skills: SkillEntry[];
}

export interface SalaryStats {
  n: number;
  median: number;
  mean: number;
  p25: number;
  p75: number;
  p90?: number;
  min?: number;
  max?: number;
}

export interface SalaryByLevel extends SalaryStats {
  level: string;
}

export interface SalaryByCountry extends SalaryStats {
  country: string;
}

export interface SalaryByWorkMode extends SalaryStats {
  work_mode: string;
}

export interface SalaryByRole extends SalaryStats {
  role: string;
}

export interface ReportDocument {
  meta: {
    generated_at: string;
    source_file: string;
    total_offers: number;
    salary_cap_usd: number;
    params: { top_skills: number; top_countries: number; min_role_jobs: number };
  };
  overview: {
    total_offers: number;
    with_salary: number;
    with_salary_pct: number;
    with_technologies: number;
    with_technologies_pct: number;
    with_role: number;
    with_role_pct: number;
    salary_cap_usd: number;
    offers_with_valid_salary: number;
  };
  roles: RoleEntry[];
  distribution: {
    by_level: DistributionEntry[];
    by_work_mode: DistributionEntry[];
    by_country: DistributionEntry[];
    by_platform: DistributionEntry[];
    by_category: DistributionEntry[];
    by_contract: DistributionEntry[];
  };
  skills: {
    top_overall: SkillEntry[];
    by_role: Record<string, RoleSkillData>;
  };
  salary: {
    note: string;
    global: SalaryStats;
    by_level: SalaryByLevel[];
    by_country: SalaryByCountry[];
    by_work_mode: SalaryByWorkMode[];
    by_role: SalaryByRole[];
  };
  role_similarity: unknown[];
}
