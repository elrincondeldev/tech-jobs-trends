import type { EndpointDef } from "../ui/EndpointCard";

const BASE = "https://elrincondeldev.com";

export const endpoints: EndpointDef[] = [
  {
    method: "GET",
    path: "/api/overview",
    description: "Returns report metadata and global overview statistics: total offers, salary coverage, and technology coverage.",
    examples: [
      {
        lang: "javascript",
        code: `const res = await fetch("${BASE}/api/overview");
const data = await res.json();

console.log(data.overview.total_offers);   // 5102
console.log(data.overview.with_salary_pct); // 31.4`,
      },
      {
        lang: "python",
        code: `import requests

res = requests.get("${BASE}/api/overview")
data = res.json()

print(data["overview"]["total_offers"])    # 5102
print(data["overview"]["with_salary_pct"]) # 31.4`,
      },
      {
        lang: "bash",
        code: `curl -s ${BASE}/api/overview | jq '.overview'`,
      },
    ],
    response: `{
  "meta": {
    "generated_at": "2026-04-21T21:21:42Z",
    "source_file": "job_offers.json",
    "total_offers": 5102,
    "salary_cap_usd": 500000
  },
  "overview": {
    "total_offers": 5102,
    "with_salary": 1603,
    "with_salary_pct": 31.4,
    "with_technologies": 4963,
    "with_technologies_pct": 97.3
  }
}`,
  },

  {
    method: "GET",
    path: "/api/roles",
    description: "Returns all tech roles with job counts and their market share percentage, ordered by number of postings.",
    params: [
      { name: "limit", type: "integer", desc: "Maximum number of roles to return. Defaults to 20." },
    ],
    examples: [
      {
        lang: "javascript",
        code: `const res = await fetch("${BASE}/api/roles?limit=10");
const { roles } = await res.json();

roles.forEach(({ role, jobs, pct }) => {
  console.log(\`\${role}: \${jobs} jobs (\${pct}%)\`);
});
// backend: 388 jobs (7.6%)
// devops: 218 jobs (4.3%)`,
      },
      {
        lang: "python",
        code: `import requests

res = requests.get("${BASE}/api/roles", params={"limit": 10})
data = res.json()

for role in data["roles"]:
    print(f"{role['role']}: {role['jobs']} jobs ({role['pct']}%)")
# backend: 388 jobs (7.6%)
# devops: 218 jobs (4.3%)`,
      },
      {
        lang: "bash",
        code: `curl -s "${BASE}/api/roles?limit=10" | jq '.roles[] | {role, jobs, pct}'`,
      },
    ],
    response: `{
  "total": 31,
  "roles": [
    { "role": "software engineer", "jobs": 512, "pct": 10.0 },
    { "role": "full stack",        "jobs": 447, "pct": 8.8  },
    { "role": "backend",           "jobs": 388, "pct": 7.6  },
    { "role": "marketing",         "jobs": 339, "pct": 6.6  },
    { "role": "frontend",          "jobs": 265, "pct": 5.2  }
  ]
}`,
  },

  {
    method: "GET",
    path: "/api/skills",
    description: "Returns the top skills overall, or filtered to a specific role. Percentages indicate the share of job postings requiring that skill.",
    params: [
      { name: "role", type: "string", desc: "Filter by role. E.g. backend, devops, frontend, data engineer, ai engineer." },
      { name: "limit", type: "integer", desc: "Maximum number of skills to return. Defaults to 20." },
    ],
    examples: [
      {
        lang: "javascript",
        code: `// Top skills overall
const res = await fetch("${BASE}/api/skills?limit=5");
const { skills } = await res.json();

// Top skills for a specific role
const roleRes = await fetch("${BASE}/api/skills?role=devops&limit=5");
const roleData = await roleRes.json();

console.log(\`\${roleData.role} — \${roleData.total_jobs} jobs\`);
roleData.skills.forEach(s => {
  console.log(\`  \${s.skill}: \${s.pct}%\`);
});`,
      },
      {
        lang: "python",
        code: `import requests

# Top skills overall
res = requests.get("${BASE}/api/skills", params={"limit": 5})
data = res.json()
print([s["skill"] for s in data["skills"]])

# Top skills for a role
res = requests.get("${BASE}/api/skills", params={"role": "devops", "limit": 5})
data = res.json()
for s in data["skills"]:
    print(f"  {s['skill']}: {s['pct']}%")
# Terraform: 50.0%
# Python: 47.7%
# AWS: 42.7%`,
      },
      {
        lang: "bash",
        code: `# Overall top skills
curl -s "${BASE}/api/skills?limit=5" | jq '.skills[].skill'

# Role-specific
curl -s "${BASE}/api/skills?role=devops" | jq '.skills[] | "\(.skill): \(.pct)%"'`,
      },
    ],
    response: `{
  "role": "devops",
  "total_jobs": 218,
  "skills": [
    { "rank": 1, "skill": "Terraform",  "category": "DevOps/CI-CD", "jobs": 109, "pct": 50.0 },
    { "rank": 2, "skill": "Python",     "category": "Language",     "jobs": 104, "pct": 47.7 },
    { "rank": 3, "skill": "AWS",        "category": "Cloud",        "jobs": 93,  "pct": 42.7 },
    { "rank": 4, "skill": "Docker",     "category": "Container",    "jobs": 91,  "pct": 41.7 },
    { "rank": 5, "skill": "CI/CD",      "category": "DevOps/CI-CD", "jobs": 88,  "pct": 40.4 }
  ]
}`,
  },

  {
    method: "GET",
    path: "/api/distribution",
    description: "Returns job distribution broken down by a given dimension. Without a type param, returns all dimensions at once.",
    params: [
      {
        name: "type",
        type: "string",
        desc: "Dimension to filter. One of: level · work_mode · country · platform · category · contract",
      },
    ],
    examples: [
      {
        lang: "javascript",
        code: `// Work mode split
const res = await fetch("${BASE}/api/distribution?type=work_mode");
const { data } = await res.json();

data.forEach(({ value, jobs, pct }) => {
  console.log(\`\${value}: \${pct}%\`);
});
// remote: 57.7%
// on-site: 35.1%
// hybrid: 7.1%`,
      },
      {
        lang: "python",
        code: `import requests

# Country breakdown
res = requests.get(
    "${BASE}/api/distribution",
    params={"type": "country"}
)
data = res.json()

for entry in data["data"]:
    if entry["value"] != "unknown":
        print(f"{entry['value']}: {entry['jobs']} jobs")`,
      },
      {
        lang: "bash",
        code: `# Seniority level breakdown
curl -s "${BASE}/api/distribution?type=level" | \\
  jq '.data[] | select(.value != "unknown") | "\(.value): \(.pct)%"'`,
      },
    ],
    response: `{
  "type": "work_mode",
  "data": [
    { "value": "remote",  "jobs": 2945, "pct": 57.7 },
    { "value": "on-site", "jobs": 1793, "pct": 35.1 },
    { "value": "hybrid",  "jobs": 364,  "pct": 7.1  }
  ]
}`,
  },

  {
    method: "GET",
    path: "/api/salary",
    description: "Returns salary statistics (yearly USD) globally and broken down by level, country, work mode, or role. Entries above $500k are excluded as data errors.",
    params: [
      {
        name: "by",
        type: "string",
        desc: "Breakdown dimension. One of: level · country · work_mode · role",
      },
    ],
    examples: [
      {
        lang: "javascript",
        code: `// Global salary stats
const res = await fetch("${BASE}/api/salary");
const { salary } = await res.json();
console.log(\`Median: $\${salary.global.median.toLocaleString()}\`);

// By role — sorted by median
const roleRes = await fetch("${BASE}/api/salary?by=role");
const { data } = await roleRes.json();

const sorted = data
  .filter(r => r.n >= 10)
  .sort((a, b) => b.median - a.median);

sorted.slice(0, 3).forEach(r => {
  console.log(\`\${r.role}: $\${r.median.toLocaleString()} median\`);
});`,
      },
      {
        lang: "python",
        code: `import requests

# Salary by seniority level
res = requests.get("${BASE}/api/salary", params={"by": "level"})
data = res.json()

for entry in data["data"]:
    print(f"{entry['level']:10} median=\${entry['median']:,}")
# junior     median=$14,976
# mid-level  median=$25,200
# senior     median=$37,200`,
      },
      {
        lang: "bash",
        code: `# Median salary by country
curl -s "${BASE}/api/salary?by=country" | \\
  jq '.data[] | select(.country != "unknown") | "\(.country): $\(.median)"'`,
      },
    ],
    response: `{
  "by": "level",
  "note": "Yearly USD. Entries above $500,000 excluded as data errors.",
  "data": [
    { "level": "junior",    "n": 19,  "median": 14976, "mean": 16248, "p25": 12000, "p75": 22800 },
    { "level": "mid-level", "n": 124, "median": 25200, "mean": 29817, "p25": 19200, "p75": 30000 },
    { "level": "senior",    "n": 170, "median": 37200, "mean": 49896, "p25": 29400, "p75": 50400 },
    { "level": "expert",    "n": 11,  "median": 45000, "mean": 51381, "p25": 39000, "p75": 64800 }
  ]
}`,
  },
];
