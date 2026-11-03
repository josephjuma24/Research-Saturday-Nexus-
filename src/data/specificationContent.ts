/**
 * Research Saturday Nexus Platform — Complete Technical Blueprint & Developer Specification
 * Comprehensive reference document structured in 14 numbered sections.
 */

export interface SpecSection {
  id: string;
  number: number;
  title: string;
  summary: string;
  content: string;
  codeBlocks?: {
    language: string;
    filename: string;
    code: string;
  }[];
}

export const SPECIFICATION_SECTIONS: SpecSection[] = [
  {
    id: 'system-architecture',
    number: 1,
    title: 'System Architecture Overview',
    summary: 'High-level C4 container architecture, micro-service boundaries, data flow, and tier responsibilities for the Research Saturday Nexus platform.',
    content: `### 1.1 Architectural Philosophy & System Boundary
The **Research Saturday Nexus Platform** is designed as a hybrid event-driven and service-oriented research intelligence ecosystem. Unlike static directories or simple bulletin boards, Nexus actively indexes researcher competencies, project states, published datasets, methodological protocols, and external funding streams to provide continuous intelligent matching and lifecycle acceleration.

The architecture comprises five distinct functional layers:
1. **Presentation Tier (SPA)**: Modern React 19 single-page application built with Vite and Tailwind CSS. Provides instant reactivity, optimistic UI updates, and an accessible interface (WCAG 2.1 AA) prioritizing a light, clean academic aesthetic.
2. **API & Orchestration Tier**: Python 3.12 + Django 5.x + Django REST Framework (DRF). Enforces granular Object-Level Permissions, JWT authentication, and business validation rules.
3. **Intelligence & Vector Compute Tier**: Hybrid search engine combining PostgreSQL 16 \`pgvector\` vector similarity search (cosine distance over 1536-dimensional domain embeddings) and PostgreSQL Full-Text Search (tsvector with BM25-style weighting and English/French/Swahili stemming dictionaries).
4. **Asynchronous Execution Tier**: Distributed Celery 5.x workers backed by Redis 7.x as message broker and result backend. Handles vector embedding generation, query matching, email/webhook dispatch, and periodic data synchronization from open repositories (e.g. CrossRef, DataCite, Zenodo).
5. **Storage & Persistence Tier**: Managed PostgreSQL 16 instance with connection pooling (PgBouncer), encrypted object storage (S3 / Cloud Storage) with signed temporary URLs for datasets and preprints, and Redis for distributed caching.

### 1.2 C4 Container Diagram & Data Flow
\`\`\`
+-----------------------------------------------------------------------------------+
|                              USER BROWSER / CLIENT                                |
|  React 19 SPA (Vite, Tailwind CSS, TanStack Query, Motion)                         |
|  - "What do you need right now?" Natural Language Input Bar                       |
|  - 5 Lifecycle Modules: Discover | Build | Publish | Connect | Impact             |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / WSS
                                           v
+-----------------------------------------------------------------------------------+
|                        INGRESS & SECURITY GATEWAY (Nginx / Cloud Run)             |
|  - SSL Termination, Rate Limiting (Token Bucket), DDoS Shield, CORS Policy        |
+------------------------------------------+----------------------------------------+
                                           | Internal Proxy
                                           v
+-----------------------------------------------------------------------------------+
|                APPLICATION SERVER (Django 5.x + Django REST Framework)            |
|  - django-allauth (Google OAuth2 + Email/Password)                                 |
|  - Custom User Model + Role-Based Access Control (RBAC)                           |
|  - Object-Level Security Matrix Enforcer (Guardian / Custom Rules)                |
|  - RESTful API Endpoints (/api/v1/...) with OpenAPI 3.1 Schemas                   |
|  - Presigned URL Generator for Private Research Assets                            |
+--------------------+---------------------+--------------------+-------------------+
                     |                     |                    |
        Sync Read/Write Query        Queue Background Job   Cache & Session Lookup
                     |                     |                    |
                     v                     v                    v
+-----------------------------+  +--------------------+  +--------------------------+
| PRIMARY POSTGRESQL 16 DB    |  | REDIS 7.x BROKER   |  | REDIS DISTRIBUTED CACHE  |
| - Relational Entities       |  | - Celery Tasks     |  | - Hot Researcher Indices |
| - pgvector (Embeddings)     |  | - Matching Pipeline|  | - Session Tokens         |
| - tsvector (Full-Text)      |  +---------+----------+  | - Rate-Limit Windows     |
+-----------------------------+            |             +--------------------------+
                                           v
                         +------------------------------------+
                         | CELERY DISTRIBUTED WORKERS         |
                         | - Embedding Generator (Worker 1)   |
                         | - Intelligent Match Recalc (W2)    |
                         | - Notification & Mailer (W3)       |
                         | - External DOI Sync (Beat)         |
                         +------------------------------------+
\`\`\`
`
  },
  {
    id: 'data-models',
    number: 2,
    title: 'Detailed Data Models (Django)',
    summary: 'Production-ready Django models covering User, Profile, NeedStatement, ProjectWorkspace, ProjectMember, CollaborationInvite, Dataset, and ImpactRecord.',
    content: `### 2.1 Domain Model Design Principles
The platform's data models strictly enforce:
- **Auditability**: All models inherit from an abstract \`TimeStampedModel\` providing \`created_at\`, \`updated_at\`, and soft-deletion flags.
- **UUID Primary Keys**: Prevents sequential enumeration attacks and simplifies distributed data sharing.
- **Indexed Search Fields**: pgvector \`VectorField(dimensions=1536)\` with HNSW index for sub-50ms vector lookups, combined with GIN indexes on full-text vectors and JSONB tags.
- **Data Integrity Constraints**: \`CheckConstraint\` and \`UniqueConstraint\` to avoid duplicate collaboration invites and invalid states.`,
    codeBlocks: [
      {
        language: 'python',
        filename: 'nexus/apps/core/models.py',
        code: `import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.postgres.indexes import GinIndex
from pgvector.django import VectorField, HnswIndex

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is mandatory for all Nexus users.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'SYSTEM_MODERATOR')
        return self.create_user(email, password, **extra_fields)

class UserRole(models.TextChoices):
    RESEARCHER = 'RESEARCHER', 'Academic / Independent Researcher'
    MENTOR = 'MENTOR', 'Research Mentor / Senior Advisor'
    INDUSTRY_PARTNER = 'INDUSTRY_PARTNER', 'Industry Innovator / Commercial Partner'
    INSTITUTIONAL_ADMIN = 'INSTITUTIONAL_ADMIN', 'University / Institute Administrator'
    SYSTEM_MODERATOR = 'SYSTEM_MODERATOR', 'System Moderator / Superadmin'

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=32, choices=UserRole.choices, default=UserRole.RESEARCHER)
    is_verified = models.BooleanField(default=False)
    institution_name = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=128, default='Kenya')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        indexes = [
            models.Index(fields=['email', 'role']),
            models.Index(fields=['country', 'is_verified']),
        ]

class ResearcherProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='researcher_profile')
    title = models.CharField(max_length=128, help_text="e.g. Senior Agricultural Biostatistician")
    bio = models.TextField(blank=True)
    orcid_id = models.CharField(max_length=19, blank=True, null=True, unique=True)
    h_index = models.PositiveIntegerField(default=0)
    primary_domain = models.CharField(max_length=128, db_index=True)
    expertise_tags = models.JSONField(default=list, help_text="Array of skill strings")
    datasets_used = models.JSONField(default=list, help_text="Array of dataset names or IDs")
    methodology_specialties = models.JSONField(default=list)
    available_hours_per_week = models.PositiveIntegerField(default=10)
    is_accepting_collaborations = models.BooleanField(default=True)
    profile_embedding = VectorField(dimensions=1536, null=True, blank=True)
    completeness_score = models.PositiveIntegerField(default=40)

    class Meta:
        indexes = [
            HnswIndex(name='researcher_profile_vec_idx', fields=['profile_embedding'], m=16, ef_construction=64, opclasses=['vector_cosine_ops']),
            GinIndex(fields=['expertise_tags'], name='res_profile_tags_gin'),
        ]

    def calculate_completeness(self):
        score = 20
        if self.title: score += 15
        if self.bio and len(self.bio) > 100: score += 20
        if self.orcid_id: score += 15
        if len(self.expertise_tags) >= 3: score += 15
        if self.datasets_used: score += 15
        self.completeness_score = min(100, score)
        return self.completeness_score

class NeedStatement(models.Model):
    class Urgency(models.TextChoices):
        LOW = 'LOW', 'Flexible Timeline'
        MEDIUM = 'MEDIUM', 'Active Grant / Approaching Deadline'
        CRITICAL = 'CRITICAL', 'Urgent Grant Submission (< 3 Weeks)'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='needs')
    raw_query = models.TextField(help_text="“What do you need right now?” prompt")
    parsed_skills_needed = models.JSONField(default=list)
    target_geography = models.CharField(max_length=128, blank=True)
    target_domain = models.CharField(max_length=128, blank=True)
    urgency = models.CharField(max_length=16, choices=Urgency.choices, default=Urgency.MEDIUM)
    query_embedding = VectorField(dimensions=1536, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ProjectWorkspace(models.Model):
    class Stage(models.TextChoices):
        PLANNING = 'PLANNING', 'Ideation & Team Formation'
        DATA_COLLECTION = 'DATA_COLLECTION', 'Active Data Collection'
        ANALYSIS = 'ANALYSIS', 'Data Analysis & Synthesis'
        DRAFTING = 'DRAFTING', 'Academic Manuscript Drafting'
        PUBLISHED = 'PUBLISHED', 'Published / Policy Dissemination'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    abstract = models.TextField()
    domain = models.CharField(max_length=128, db_index=True)
    stage = models.CharField(max_length=32, choices=Stage.choices, default=Stage.PLANNING)
    lead_researcher = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='led_projects')
    irb_approval_number = models.CharField(max_length=64, blank=True, null=True)
    methodology_framework = models.CharField(max_length=255, blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProjectMember(models.Model):
    class MemberRole(models.TextChoices):
        PI = 'PRINCIPAL_INVESTIGATOR', 'Principal Investigator'
        CO_PI = 'CO_PRINCIPAL_INVESTIGATOR', 'Co-Principal Investigator'
        STATISTICIAN = 'LEAD_STATISTICIAN', 'Lead Statistician / Modeler'
        DATA_COLLECTOR = 'DATA_COLLECTOR', 'Field Data Coordinator'
        POLICY_LIAISON = 'POLICY_LIAISON', 'Policy & Impact Specialist'
        ADVISOR = 'ADVISOR', 'Scientific Advisor / Mentor'

    project = models.ForeignKey(ProjectWorkspace, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='project_memberships')
    role = models.CharField(max_length=32, choices=MemberRole.choices)
    joined_at = models.DateTimeField(auto_now_add=True)
    can_edit_workspace = models.BooleanField(default=True)

    class Meta:
        unique_together = ('project', 'user')

class CollaborationInvite(models.Model):
    class InviteStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        DECLINED = 'DECLINED', 'Declined'
        EXPIRED = 'EXPIRED', 'Expired'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(ProjectWorkspace, on_delete=models.CASCADE, related_name='invitations')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_invites')
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_invites')
    proposed_role = models.CharField(max_length=64)
    personalized_message = models.TextField()
    status = models.CharField(max_length=16, choices=InviteStatus.choices, default=InviteStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'recipient'], condition=models.Q(status='PENDING'), name='unique_pending_invite_per_user')
        ]`
      }
    ]
  },
  {
    id: 'api-specification',
    number: 3,
    title: 'API Specification & RESTful Endpoints',
    summary: 'Detailed endpoint contracts, request/response schemas, parameter validations, and DRF permission classes.',
    content: `### 3.1 Endpoint Taxonomy & Protocol
All endpoints are versioned under \`/api/v1/\` and enforce:
- Content-Type: \`application/json\`
- Bearer JWT Authorization: \`Authorization: Bearer <access_token>\`
- Standard pagination metadata: \`count\`, \`next\`, \`previous\`, \`results\`
- RFC 7807 Problem Details for HTTP 4xx/5xx error responses

### 3.2 Key Endpoint Registry
| Method | Endpoint | Description | Auth Requirement | Permission Class |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | \`/api/v1/matching/query/\` | Intelligent multi-attribute query engine | Authenticated | \`IsActiveResearcher\` |
| **GET** | \`/api/v1/researchers/\` | Search and filter researchers | Public / Auth | \`AllowAny\` |
| **GET** | \`/api/v1/researchers/{id}/\` | Detailed researcher profile & portfolio | Public / Auth | \`AllowAny\` |
| **POST** | \`/api/v1/projects/\` | Create new research workspace | Authenticated | \`IsVerifiedUser\` |
| **GET** | \`/api/v1/projects/{id}/\` | Fetch workspace state, members, milestones | Authenticated | \`IsProjectMemberOrPublic\` |
| **POST** | \`/api/v1/projects/{id}/invite/\` | Dispatch collaboration invitation | Authenticated | \`IsProjectLead\` |
| **PATCH** | \`/api/v1/invitations/{id}/respond/\` | Accept or decline collaboration invite | Authenticated | \`IsInviteRecipient\` |
| **GET** | \`/api/v1/datasets/\` | Filter open & licensed datasets | Authenticated | \`IsActiveUser\` |
| **GET** | \`/api/v1/funding/\` | Active grants & funding calls | Authenticated | \`IsActiveUser\` |
| **GET** | \`/api/v1/publish/journal-match/\` | Match project abstract to journals | Authenticated | \`IsActiveUser\` |
| **GET** | \`/api/v1/impact/dashboard/\` | Global & institutional SDG metrics | Authenticated | \`IsActiveUser\` |
`,
    codeBlocks: [
      {
        language: 'json',
        filename: 'OpenAPI_3_1_Schema_Matching_Query.json',
        code: `{
  "openapi": "3.1.0",
  "paths": {
    "/api/v1/matching/query/": {
      "post": {
        "summary": "Execute intelligent natural-language matching",
        "description": "Takes free-text need statement, parses skills, runs hybrid pgvector + full-text search, and returns ranked researchers, datasets, funding, and methodologies.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["query"],
                "properties": {
                  "query": {
                    "type": "string",
                    "example": "I need a statistician who understands agricultural finance and can work with Kenyan datasets."
                  },
                  "urgency": {
                    "type": "string",
                    "enum": ["LOW", "MEDIUM", "CRITICAL"],
                    "default": "MEDIUM"
                  },
                  "filters": {
                    "type": "object",
                    "properties": {
                      "target_country": { "type": "string", "example": "Kenya" },
                      "min_available_hours": { "type": "integer", "example": 8 }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Structured match results",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "query_id": { "type": "string", "format": "uuid" },
                    "ranked_researchers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "researcher_id": { "type": "string", "format": "uuid" },
                          "name": { "type": "string" },
                          "title": { "type": "string" },
                          "institution": { "type": "string" },
                          "match_percentage": { "type": "integer", "example": 94 },
                          "confidence_tier": { "type": "string", "enum": ["Exceptional", "Strong", "Moderate", "Complementary"] },
                          "match_rationale": { "type": "string" },
                          "shared_interests": { "type": "array", "items": { "type": "string" } },
                          "suggested_action": { "type": "string", "example": "invite_to_collaborate" }
                        }
                      }
                    },
                    "matching_datasets": { "type": "array" },
                    "matching_funding": { "type": "array" },
                    "suggested_methodologies": { "type": "array" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`
      }
    ]
  },
  {
    id: 'matching-engine',
    number: 4,
    title: 'Intelligent Matching Engine Design',
    summary: 'Hybrid ranking mathematics, pgvector cosine search, BM25 keyword score fusion, and multi-factor penalty weighting.',
    content: `### 4.1 Hybrid Ranking Formulation
The Matching Engine addresses the limitation of pure keyword search (which misses semantic synonyms like *econometrician* vs *statistician*) and pure vector search (which often ignores precise geographic or dataset constraints).

The composite match score $S_{\\text{final}}(q, r)$ between a natural language query $q$ and candidate researcher $r$ is computed as:
$$S_{\\text{final}} = w_v \\cdot S_{\\text{vector}} + w_t \\cdot S_{\\text{text}} + w_g \\cdot S_{\\text{geo}} + w_d \\cdot S_{\\text{dataset}} + w_a \\cdot S_{\\text{availability}}$$

Where:
- $w_v = 0.35$: Vector cosine similarity between normalized OpenAI \`text-embedding-3-small\` (1536d) query vector and researcher profile vector.
- $w_t = 0.25$: BM25 Full-text ranking score over researcher expertise tags, publications, and abstracts.
- $w_g = 0.15$: Geographic & regional institutional proximity score (1.0 for exact country/regional match, 0.5 for continental match, 0.2 otherwise).
- $w_d = 0.15$: Dataset familiarity match (exact or fuzzy overlap with datasets cited in the query).
- $w_a = 0.10$: Availability factor (penalizes researchers with 0 available hours or marked as non-accepting collaborations).

### 4.2 SQL Vector & Hybrid Retrieval Query
\`\`\`sql
-- Hybrid Vector + BM25 Query in PostgreSQL with pgvector
WITH vector_matches AS (
    SELECT 
        rp.id AS profile_id,
        rp.user_id,
        1 - (rp.profile_embedding <=> %(query_vector)s::vector) AS cosine_sim
    FROM core_researcherprofile rp
    WHERE rp.is_accepting_collaborations = TRUE
    ORDER BY rp.profile_embedding <=> %(query_vector)s::vector
    LIMIT 50
),
text_matches AS (
    SELECT 
        rp.id AS profile_id,
        ts_rank_cd(rp.search_vector, websearch_to_tsquery('english', %(query_text)s)) AS text_rank
    FROM core_researcherprofile rp
    WHERE rp.search_vector @@ websearch_to_tsquery('english', %(query_text)s)
)
SELECT 
    vm.profile_id,
    u.first_name || ' ' || u.last_name AS full_name,
    rp.title,
    u.country,
    u.institution_name,
    rp.expertise_tags,
    rp.available_hours_per_week,
    -- Reciprocal Rank Fusion / Composite Score Normalized to 0-100
    ROUND((
        (COALESCE(vm.cosine_sim, 0.0) * 40.0) +
        (COALESCE(tm.text_rank, 0.0) * 30.0) +
        (CASE WHEN LOWER(u.country) = LOWER(%(target_country)s) THEN 20.0 ELSE 5.0 END) +
        (CASE WHEN rp.available_hours_per_week >= 8 THEN 10.0 ELSE 2.0 END)
    )::numeric, 1) AS match_score
FROM vector_matches vm
FULL OUTER JOIN text_matches tm ON vm.profile_id = tm.profile_id
JOIN core_researcherprofile rp ON COALESCE(vm.profile_id, tm.profile_id) = rp.id
JOIN core_customuser u ON rp.user_id = u.id
ORDER BY match_score DESC
LIMIT 10;
\`\`\`
`
  },
  {
    id: 'frontend-architecture',
    number: 5,
    title: 'Frontend Architecture & Lifecycle UX',
    summary: 'Modular React 19 architecture, TanStack Query cache invalidation, state boundaries, accessibility contracts, and light-theme system.',
    content: `### 5.1 Route Tree & Page Hierarchy
The frontend leverages a structured layout with persistent navigation, breadcrumbs, and contextual action toolbars:
- \`/\`: Nexus Intelligent Hub & Main Dashboard (prominent "What do you need right now?" query box)
- \`/discover\`: Multi-entity exploration (Researchers, Datasets, Grants, Industry Partners)
- \`/build\`: Active Research Workspaces, Team Formation, Methodology Selector, Literature Binder
- \`/publish\`: Academic Writing Assistant, Journal Recommender, Co-Author Graph, DOI Registry
- \`/connect\`: Communities, Working Groups, Symposium Calendar, Mentorship Matcher
- \`/impact\`: SDG Alignment Tracker, Policy Output Registry, Spin-off/Commercialization Runway
- \`/spec\`: Technical Blueprint & Specification Interactive Engine

### 5.2 State Management Strategy
- **Server Cache & Synchronization**: TanStack Query (React Query) handles remote API data with 5-minute stale-time and optimistic updates for collaboration invites and milestone toggles.
- **Client Session State**: Lightweight Zustand store for current user role simulation, notification badges, active search filters, and query history.
- **Accessible UI Primitives**: Built strictly using semantic HTML elements (\`<button>\`, \`<nav>\`, \`<main>\`, \`<dialog>\`), aria-labels for icon buttons, and WCAG AA contrast standards.
`
  },
  {
    id: 'security-matrix',
    number: 6,
    title: 'Authentication & Security Matrix (RBAC & ABAC)',
    summary: 'Principle of Least Privilege enforcement matrix across all user roles and domain resources.',
    content: `### 6.1 Authentication Mechanism
- **Google OAuth 2.0**: Native sign-in utilizing Google Identity Services (GIS). Returns ID token verified on Django backend via \`google-auth\`.
- **Email/Password**: Argon2id password hashing with mandatory email verification before full profile indexing.
- **JWT Lifecycles**: 15-minute Short-Lived Access Token + 7-day Rotating Refresh Token stored in \`HttpOnly\`, \`SameSite=Strict\`, \`Secure\` cookies.

### 6.2 Security Matrix (Role × Resource × Actions)
Every API endpoint and frontend route guard strictly evaluates this matrix before returning or mutating data.`,
    codeBlocks: [
      {
        language: 'markdown',
        filename: 'NEXUS_SECURITY_MATRIX.md',
        code: `| Role | Resource | Read | Create | Update | Delete | Special Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Researcher** | Researcher Profile | All Public Profiles | Own Profile | Own Profile | Own Profile (Soft) | Profile completeness score must be >= 60% to appear in public match results |
| **Researcher** | Need Statement | Own + Public Aggregates | Yes | Yes (Own) | Yes (Own) | Max 5 active open needs per researcher |
| **Researcher** | Project Workspace | Member Projects + Public | Yes | Workspace Admin Only | Workspace Lead Only | Object-level permission checked via Django Guardian |
| **Researcher** | Collaboration Invite | Sent & Received | Yes (as PI/Lead) | Accept/Decline (Recipient) | Cancel (Sender) | Recipient must have verified ORCID or institutional email |
| **Researcher** | Datasets | All Public / CC-BY | Register Metadata | Own Dataset Record | Own Record | Uploaded files scanned via ClamAV background hook |
| **Mentor** | Mentorship Queue | Assigned Mentees | Yes (Feedback) | Yes (Feedback) | No | Read-only access to mentee project workspaces |
| **Industry Partner** | Research Needs | Public Needs & Proposals | Post R&D Challenge | Own Challenge | Own Challenge | Cannot access private datasets without signed NDA |
| **Institutional Admin**| Faculty Profiles | All University Members | Provision Faculty | University Faculty | Suspend Faculty | Scope restricted to matching institution domain |
| **System Moderator** | Audit Logs & Flags | Global Platform Audit | Audit Entry (Auto) | No (Immutable) | No (Immutable) | Full read access; all moderator actions logged to WORM log |`
      }
    ]
  },
  {
    id: 'database-schema',
    number: 7,
    title: 'Database Schema & Migration Strategy',
    summary: 'PostgreSQL 16 relational design, pgvector indexing, schema migrations, and zero-downtime deployment plan.',
    content: `### 7.1 Database Indexing & Partitioning
- **pgvector HNSW Indexing**: High-performance approximate nearest neighbor indexing (\`m=16\`, \`ef_construction=64\`) ensuring vector search latency remains under 45ms even at 500,000 researcher embeddings.
- **Audit Log Partitioning**: Monthly range partitioning on \`core_auditlog\` table on \`timestamp\` to maintain high query throughput and easy archival.
- **GIN Trigram Indexes**: Full-text searching on researcher names and institutional affiliations using \`gin_trgm_ops\`.

### 7.2 Zero-Downtime Migration Playbook
1. **Backward-Compatible Schema Alteration**: Never drop or rename columns in a single migration. Add nullable column in Phase 1.
2. **Dual Writing**: Update Django model to write to both old and new columns.
3. **Backfill Task**: Celery background task backfills historic rows in batches of 2,000.
4. **Deprecate & Cutover**: Point reads to the new column and drop the old column in a subsequent release.
`
  },
  {
    id: 'background-jobs',
    number: 8,
    title: 'Background Jobs & Asynchronous Processing',
    summary: 'Celery worker queues, task definitions, retry backoffs, and scheduled beat automation.',
    content: `### 8.1 Celery Queue Architecture
To isolate critical-path interactive tasks from heavy batch jobs, Celery workers are segregated into three queues:
1. \`high_priority\`: Transactional emails, collaboration invitation push notifications, instant match cache invalidation (Concurrency: 8).
2. \`intelligence\`: Vector embedding generation, batch recalculation of candidate affinity graphs (Concurrency: 4, GPU-enabled worker optional).
3. \`data_sync\`: Periodic scraping and indexing from Zenodo, CrossRef, and KNBS open portals (Concurrency: 2).`,
    codeBlocks: [
      {
        language: 'python',
        filename: 'nexus/apps/intelligence/tasks.py',
        code: `import logging
from celery import shared_task
from django.utils import timezone
from core.models import ResearcherProfile, NeedStatement
from intelligence.services import EmbeddingService, calculate_hybrid_match

logger = logging.getLogger(__name__)

@shared_task(queue='intelligence', bind=True, max_retries=3, default_retry_delay=60)
def generate_profile_embedding_task(self, profile_id: str):
    try:
        profile = ResearcherProfile.objects.select_related('user').get(id=profile_id)
        # Synthesize profile text representation
        text_corpus = f"""
        Name: {profile.user.get_full_name()}
        Title: {profile.title}
        Institution: {profile.user.institution_name}, {profile.user.country}
        Bio: {profile.bio}
        Expertise: {', '.join(profile.expertise_tags)}
        Methodologies: {', '.join(profile.methodology_specialties)}
        Datasets: {', '.join(profile.datasets_used)}
        """
        embedding = EmbeddingService.get_embedding(text_corpus)
        profile.profile_embedding = embedding
        profile.calculate_completeness()
        profile.save(update_fields=['profile_embedding', 'completeness_score'])
        logger.info(f"Successfully generated 1536d embedding for profile {profile_id}")
    except Exception as exc:
        logger.error(f"Error generating embedding for {profile_id}: {exc}")
        raise self.retry(exc=exc)

@shared_task(queue='high_priority')
def dispatch_collaboration_invitation_notification(invite_id: str):
    from core.models import CollaborationInvite
    from notifications.services import EmailNotificationService

    invite = CollaborationInvite.objects.select_related('sender', 'recipient', 'project').get(id=invite_id)
    EmailNotificationService.send_invite_email(
        recipient_email=invite.recipient.email,
        sender_name=invite.sender.get_full_name(),
        project_title=invite.project.title,
        role=invite.proposed_role,
        message=invite.personalized_message
    )`
      }
    ]
  },
  {
    id: 'security-compliance',
    number: 9,
    title: 'Security Considerations & Compliance Notes',
    summary: 'OWASP Top 10 mitigation, signed URLs for sensitive microdata, IRB ethics enforcement, and GDPR/NDPR alignment.',
    content: `### 9.1 Data Privacy & Regional Compliance (GDPR & Kenya Data Protection Act 2019)
- **Consent Tracking**: Explicit consent logging for all researcher directory listings, with one-click export of personal data (\`GET /api/v1/auth/my-data-export/\`) and Right-to-be-Forgotten erasure.
- **De-Identification of Microdata**: Raw research datasets uploaded to project workspaces must not contain Personally Identifiable Information (PII). Nexus provides automated column scanning that flags National ID, phone numbers, and unhashed household GPS coordinates before storage.
- **IRB Ethics Protocol Enforcement**: Projects utilizing human-subject microdata (e.g. household finance surveys, clinical trials) require a verified Institutional Review Board (IRB) approval number and expiry date before dataset sharing features are unlocked.

### 9.2 Infrastructure Hardening
- **Content Security Policy (CSP)**: Strict headers disallowing \`unsafe-eval\` and restricting script execution strictly to verified origin hashes.
- **Encrypted Object Storage**: Uploaded preprints and datasets are stored on AWS S3 with Server-Side Encryption (SSE-KMS) and accessed only via short-lived (15-minute) presigned URLs.
- **Rate Limiting**: Nginx + Django ratelimit enforcing 60 requests/minute on standard endpoints and 5 requests/minute on matching queries.
`
  },
  {
    id: 'mvp-roadmap',
    number: 10,
    title: 'MVP Implementation Roadmap',
    summary: 'Three-phase rollout schedule prioritizing the core matching flow first, followed by publication and impact modules.',
    content: `### 10.1 Phase 1 — Core Matching & Workspace MVP (Weeks 1–6)
*Goal: Establish end-to-end flow from query to collaboration.*
- **Milestone 1.1**: Django 5 Custom User Model + Google OAuth & Email authentication.
- **Milestone 1.2**: Researcher Profile onboarding & completeness scoring engine.
- **Milestone 1.3**: Natural Language Query parser + pgvector HNSW hybrid matching pipeline.
- **Milestone 1.4**: Collaboration Invitation dispatch modal & recipient acceptance workflow.
- **Milestone 1.5**: Project Workspace (Build module): team roster, milestone tracker, and methodology selector.

### 10.2 Phase 2 — Publish & Connect Modules (Weeks 7–10)
*Goal: Expand ecosystem into academic outputs and community networks.*
- **Milestone 2.1**: Journal Recommender Engine: Match paper abstracts to journal aims and impact factors.
- **Milestone 2.2**: Co-Author Graph visualization and DOI linking via CrossRef API.
- **Milestone 2.3**: Research Communities discussion channels and event calendar with one-click registration.
- **Milestone 2.4**: Mentorship Matching pairing early-career African scholars with senior advisors.

### 10.3 Phase 3 — Impact Tracking & Commercialization (Weeks 11–14)
*Goal: Connect research to policy, patents, and societal outcomes.*
- **Milestone 3.1**: Sustainable Development Goals (SDG) Alignment Matrix and automated classifier.
- **Milestone 3.2**: Policy Brief Repository and ministry citation tracker.
- **Milestone 3.3**: AgTech / BioTech Spin-off pathway tracker with industry partner licensing portal.
- **Milestone 3.4**: Institutional Executive Dashboard with aggregated research ROI metrics.
`
  },
  {
    id: 'non-functional-requirements',
    number: 11,
    title: 'Non-Functional Requirements (NFRs)',
    summary: 'Measurable latency budgets, throughput thresholds, accessibility standards, and uptime SLAs.',
    content: `### 11.1 Performance & Latency Budgets
- **Natural Language Matching Query**: P95 latency $\\le 450\\text{ms}$ under 50 concurrent searches.
- **Standard REST Endpoints**: P95 latency $\\le 80\\text{ms}$ (cached reads) and $\\le 200\\text{ms}$ (mutations).
- **Throughput Capacity**: Sustained 1,200 requests/second on standard 4-node container cluster.
- **Availability SLA**: 99.9% uptime excluding scheduled maintenance windows.

### 11.2 Accessibility & Usability (WCAG 2.1 AA)
- Contrast ratio $\\ge 4.5:1$ for normal text, $\\ge 3:1$ for large headings and UI boundaries.
- Full keyboard navigation support (logical tab ordering, visible focus rings with \`focus-visible:ring-2\`).
- Screen-reader compatibility with descriptive \`aria-label\` attributes on all icon controls.
- Light theme as crisp default with domain-native visual hierarchy (zero gratuitous pill badges).
`
  },
  {
    id: 'folder-structure',
    number: 12,
    title: 'Suggested Project & Folder Structure',
    summary: 'Monorepo architecture separating Django backend applications and React SPA frontend.',
    content: `### 12.1 Project Directory Organization
\`\`\`
research-saturday-nexus/
├── backend/                               # Django REST Framework Backend
│   ├── manage.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── config/                            # Django project configuration
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── celery.py                      # Celery instance configuration
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   └── urls.py
│   └── apps/                              # Domain-driven modular applications
│       ├── authentication/                # Allauth & JWT logic
│       ├── core/                          # User, Profile, Base models
│       ├── intelligence/                  # pgvector & BM25 matching engine
│       │   ├── services.py
│       │   ├── tasks.py
│       │   └── vector_utils.py
│       ├── projects/                      # Workspaces, Milestones, Literature
│       ├── discover/                      # Datasets, Funding Calls, Partners
│       ├── publish/                       # Journal matcher, DOI integrations
│       ├── connect/                       # Communities, Events, Mentorship
│       └── impact/                        # SDG tracking, Policy briefs
├── frontend/                              # React 19 + Vite Frontend SPA
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── assets/
│   │   ├── components/                    # Modular accessible UI components
│   │   │   ├── common/                    # Header, Footer, Tabs, Modals
│   │   │   ├── discover/                  # MatchResultsCard, FilterBar
│   │   │   ├── build/                     # WorkspaceBoard, MilestoneList
│   │   │   ├── publish/                   # JournalCard, ManuscriptEditor
│   │   │   ├── connect/                   # CommunityCard, EventRegister
│   │   │   └── impact/                    # SDGMatrix, PolicyBriefList
│   │   ├── hooks/                         # useMatchingQuery, useWorkspace
│   │   ├── services/                      # Axios / Fetch client with interceptors
│   │   ├── store/                         # Zustand state slices
│   │   ├── types/                         # TypeScript interfaces
│   │   └── utils/                         # Tokenizers, date formatters
│   └── public/
├── docker-compose.yml                     # Local orchestration (Postgres, Redis, Backend, Frontend)
└── README.md
\`\`\`
`
  },
  {
    id: 'env-configuration',
    number: 13,
    title: 'Environment Variables & Configuration',
    summary: 'Complete .env schema with production security parameters and validation constraints.',
    content: `### 13.1 Production Environment Variables Specification
Every variable is validated upon application startup using \`pydantic-settings\` or \`django-environ\`. Any missing critical secret halts deployment to prevent silent failures.`,
    codeBlocks: [
      {
        language: 'bash',
        filename: '.env.example',
        code: `# === Django Core Settings ===
DJANGO_SECRET_KEY="replace-with-minimum-50-char-cryptographically-secure-key"
DJANGO_DEBUG="False"
DJANGO_ALLOWED_HOSTS="nexus.researchsaturday.org,api.nexus.researchsaturday.org"
DJANGO_SETTINGS_MODULE="config.settings.production"

# === Database (PostgreSQL 16 + pgvector) ===
DATABASE_URL="postgres://nexus_user:nexus_secure_pass@db.internal:5432/nexus_production"
DATABASE_CONN_MAX_AGE="60"

# === Redis & Celery ===
REDIS_URL="redis://redis.internal:6379/0"
CELERY_BROKER_URL="redis://redis.internal:6379/1"
CELERY_RESULT_BACKEND="redis://redis.internal:6379/2"

# === Authentication & Google OAuth ===
GOOGLE_OAUTH_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET="GOCSPX-your-client-secret"
JWT_SIGNING_KEY="replace-with-jwt-signing-secret"
JWT_ACCESS_LIFETIME_MINUTES="15"
JWT_REFRESH_LIFETIME_DAYS="7"

# === Intelligence & Embeddings ===
OPENAI_API_KEY="sk-proj-your-api-key"
EMBEDDING_MODEL="text-embedding-3-small"
EMBEDDING_DIMENSIONS="1536"

# === AWS / Cloud Storage (Datasets & Papers) ===
AWS_ACCESS_KEY_ID="AKIA-YOUR-KEY"
AWS_SECRET_ACCESS_KEY="YOUR-SECRET-KEY"
AWS_STORAGE_BUCKET_NAME="nexus-research-assets-prod"
AWS_S3_REGION_NAME="af-south-1"

# === Email & Notifications ===
SENDGRID_API_KEY="SG.your-sendgrid-key"
DEFAULT_FROM_EMAIL="Research Saturday Nexus <notifications@researchsaturday.org>"

# === Frontend Configuration ===
VITE_API_BASE_URL="https://api.nexus.researchsaturday.org/api/v1"
VITE_APP_URL="https://nexus.researchsaturday.org"`
      }
    ]
  },
  {
    id: 'testing-strategy',
    number: 14,
    title: 'Testing Strategy & Quality Gates',
    summary: 'Pytest-django fixtures, factory_boy mock generators, Playwright E2E suites, and CI/CD quality gates.',
    content: `### 14.1 Test Pyramid & Target Coverage
1. **Unit Tests (Target: $\\ge 90\\%$ on Core Logic)**: Pure calculation functions (scoring, tokenizers, state transitions) executed in sub-second test runners.
2. **Integration Tests (Target: $\\ge 85\\%$ on API Endpoints)**: Testing DRF views with transactional database rollbacks using \`pytest-django\` and \`factory_boy\`.
3. **End-to-End Browser Tests**: Playwright CLI test suites covering the MVP user journey: Login $\\rightarrow$ Submit Need Statement $\\rightarrow$ Inspect Ranked Matches $\\rightarrow$ Send Invitation $\\rightarrow$ Verify Workspace Member.
4. **Load & Stress Testing**: Locust scenario executing 500 concurrent researchers issuing natural-language queries to verify P95 response latency under load.`,
    codeBlocks: [
      {
        language: 'python',
        filename: 'backend/tests/test_matching_api.py',
        code: `import pytest
from rest_framework.test import APIClient
from rest_framework import status
from core.models import CustomUser, ResearcherProfile

@pytest.mark.django_db
class TestMatchingEngineAPI:
    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="test.researcher@uonbi.ac.ke",
            password="SecurePassword123!",
            first_name="Jane",
            last_name="Doe",
            role="RESEARCHER",
            country="Kenya"
        )
        self.profile = ResearcherProfile.objects.create(
            user=self.user,
            title="Agricultural Economist",
            expertise_tags=["Agricultural Finance", "Applied Statistics", "Kenya"],
            available_hours_per_week=12,
            is_accepting_collaborations=True
        )
        self.client.force_authenticate(user=self.user)

    def test_natural_language_matching_endpoint_returns_ranked_results(self):
        url = "/api/v1/matching/query/"
        payload = {
            "query": "I need a statistician who understands agricultural finance and can work with Kenyan datasets."
        }
        response = self.client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "ranked_researchers" in data
        assert len(data["ranked_researchers"]) >= 1
        top_match = data["ranked_researchers"][0]
        assert top_match["match_percentage"] >= 75
        assert "confidence_tier" in top_match
        assert "shared_interests" in top_match`
      }
    ]
  }
];
