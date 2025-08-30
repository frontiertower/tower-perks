"""
Enhanced demo backend for Frontier Loom - supports new job schema
Includes payment types, service types, and counter-offers
"""
import os
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Frontier Loom Enhanced API Demo", version="2.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced Enums and Models
class PaymentType(str, Enum):
    MONETARY = "MONETARY"
    IN_KIND = "IN_KIND" 
    HYBRID = "HYBRID"

class JobStatus(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class OfferStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"

class CreateJobInput(BaseModel):
    title: str
    category: str
    description: Optional[str] = ""
    budget_usd: Optional[float] = None
    payment_type: PaymentType = PaymentType.MONETARY
    in_kind_description: Optional[str] = None
    deadline_iso: Optional[str] = None
    posted_by_id: str
    posted_by_email: Optional[str] = None
    service_type: Optional[str] = None
    is_standard_rate: bool = False

class JobResponse(BaseModel):
    id: str
    title: str
    category: str
    description: Optional[str] = ""
    budget_usd: Optional[float] = None
    currency: str = "USD"
    deadline_iso: Optional[str] = None
    status: JobStatus = JobStatus.OPEN
    payment_type: PaymentType = PaymentType.MONETARY
    in_kind_description: Optional[str] = None
    posted_by_id: str
    posted_by_email: Optional[str] = None
    claimed_by_id: Optional[str] = None
    claimed_at_iso: Optional[str] = None
    completed_at_iso: Optional[str] = None
    deliverable_url: Optional[str] = None
    service_type: Optional[str] = None
    is_standard_rate: bool = False
    created_at: str
    updated_at: str

class CreateOfferInput(BaseModel):
    job_id: str
    offered_by_id: str
    offered_by_email: Optional[str] = None
    offer_amount_usd: Optional[float] = None
    offer_payment_type: PaymentType = PaymentType.MONETARY
    offer_in_kind_description: Optional[str] = None
    message: Optional[str] = None

class JobOfferResponse(BaseModel):
    id: str
    job_id: str
    offered_by_id: str
    offered_by_email: Optional[str] = None
    offer_amount_usd: Optional[float] = None
    offer_payment_type: PaymentType = PaymentType.MONETARY
    offer_in_kind_description: Optional[str] = None
    message: Optional[str] = None
    status: OfferStatus = OfferStatus.PENDING
    created_at: str
    updated_at: str

# In-memory storage
demo_jobs: Dict[str, JobResponse] = {}
demo_offers: Dict[str, JobOfferResponse] = {}
demo_counter = 1

# Standard rates
STANDARD_RATES = {
    'BAMBU_X1C': {'name': 'Bambu Lab X1 Carbon', 'base_rate': 5},
    'H2D': {'name': 'Bambu Lab H2D', 'base_rate': 7}, 
    'LASER': {'name': 'Laser Cutting', 'base_rate': 20}
}

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    # Extract user ID from Supabase-style Bearer token or use dev headers
    if authorization and authorization.startswith("Bearer "):
        # In real implementation, decode JWT to get user ID
        return "auth_user_123"
    return "demo_user_123"

def get_current_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

# Create some sample enhanced jobs
sample_jobs = [
    CreateJobInput(
        title="Custom Phone Stand with Wireless Charging",
        category="3D_PRINTING",
        description="Need a custom phone stand that supports wireless charging and works in both portrait and landscape orientations.",
        budget_usd=35.0,
        payment_type=PaymentType.MONETARY,
        posted_by_id="demo_user_456",
        posted_by_email="creator@example.com",
        service_type="BAMBU_X1C",
        is_standard_rate=True
    ),
    CreateJobInput(
        title="Arduino Project Consultation",
        category="CONSULTATION", 
        description="Looking for help debugging my smart home sensor project. Happy to trade some 3D printing services in return.",
        payment_type=PaymentType.HYBRID,
        budget_usd=25.0,
        in_kind_description="3D printing services (up to $15 value)",
        posted_by_id="demo_user_789",
        posted_by_email="maker@example.com"
    ),
    CreateJobInput(
        title="Wooden Box Laser Cutting",
        category="LASER_CUTTING",
        description="Need precision wooden box with finger joints. Will provide materials.",
        payment_type=PaymentType.IN_KIND,
        in_kind_description="High-quality plywood materials + coffee for the maker",
        posted_by_id="demo_user_101",
        posted_by_email="woodworker@example.com",
        service_type="LASER",
        is_standard_rate=True
    )
]

# Initialize with sample data
for sample_job in sample_jobs:
    job_id = f"job_{demo_counter}"
    demo_counter += 1
    
    job = JobResponse(
        id=job_id,
        **sample_job.model_dump(),
        created_at=get_current_timestamp(),
        updated_at=get_current_timestamp()
    )
    demo_jobs[job_id] = job

@app.get("/")
async def root():
    return {"message": "Frontier Loom Enhanced API Demo", "status": "running", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": get_current_timestamp()}

# Jobs endpoints
@app.post("/rest/v1/jobs", response_model=List[JobResponse])
async def create_job_supabase_style(
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Handle Supabase-style job creation"""
    global demo_counter
    
    body = await request.json()
    user_id = get_current_user_id(authorization)
    
    # Handle array input (Supabase .insert() sends arrays)
    jobs_to_create = body if isinstance(body, list) else [body]
    created_jobs = []
    
    for job_data in jobs_to_create:
        job_id = f"job_{demo_counter}"
        demo_counter += 1
        
        # Calculate budget for standard rate services
        if job_data.get('is_standard_rate') and job_data.get('service_type'):
            service_type = job_data['service_type']
            if service_type in STANDARD_RATES:
                job_data['budget_usd'] = STANDARD_RATES[service_type]['base_rate']
        
        job = JobResponse(
            id=job_id,
            title=job_data['title'],
            category=job_data['category'],
            description=job_data.get('description', ''),
            budget_usd=job_data.get('budget_usd'),
            payment_type=job_data.get('payment_type', PaymentType.MONETARY),
            in_kind_description=job_data.get('in_kind_description'),
            deadline_iso=job_data.get('deadline_iso'),
            posted_by_id=job_data.get('posted_by_id', user_id),
            posted_by_email=job_data.get('posted_by_email'),
            service_type=job_data.get('service_type'),
            is_standard_rate=job_data.get('is_standard_rate', False),
            created_at=get_current_timestamp(),
            updated_at=get_current_timestamp()
        )
        
        demo_jobs[job_id] = job
        created_jobs.append(job)
    
    return created_jobs

@app.get("/rest/v1/jobs", response_model=List[JobResponse])
async def get_jobs_supabase_style(
    status: Optional[str] = None,
    claimed_by_id: Optional[str] = None,
    posted_by_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Get jobs with filtering - Supabase style"""
    jobs = list(demo_jobs.values())
    
    # Apply filters
    if status:
        jobs = [job for job in jobs if job.status == status]
    if claimed_by_id:
        jobs = [job for job in jobs if job.claimed_by_id == claimed_by_id]
    if posted_by_id:
        jobs = [job for job in jobs if job.posted_by_id == posted_by_id]
    
    # Sort by created_at desc
    jobs.sort(key=lambda x: x.created_at, reverse=True)
    return jobs

@app.patch("/rest/v1/jobs")
async def update_job_supabase_style(
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Update job - Supabase style"""
    body = await request.json()
    user_id = get_current_user_id(authorization)
    
    # Extract job ID from query or body
    # In real Supabase, this would be handled by URL params
    job_id = body.get('id') or list(demo_jobs.keys())[0]  # Simplified for demo
    
    if job_id not in demo_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = demo_jobs[job_id]
    
    # Update allowed fields
    for key, value in body.items():
        if hasattr(job, key) and key != 'id':
            setattr(job, key, value)
    
    job.updated_at = get_current_timestamp()
    return [job]  # Supabase returns arrays

# Job offers endpoints
@app.post("/rest/v1/job_offers", response_model=List[JobOfferResponse])
async def create_offer_supabase_style(
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Create job offer - Supabase style"""
    global demo_counter
    
    body = await request.json()
    user_id = get_current_user_id(authorization)
    
    offers_to_create = body if isinstance(body, list) else [body]
    created_offers = []
    
    for offer_data in offers_to_create:
        offer_id = f"offer_{demo_counter}"
        demo_counter += 1
        
        offer = JobOfferResponse(
            id=offer_id,
            job_id=offer_data['job_id'],
            offered_by_id=offer_data.get('offered_by_id', user_id),
            offered_by_email=offer_data.get('offered_by_email'),
            offer_amount_usd=offer_data.get('offer_amount_usd'),
            offer_payment_type=offer_data.get('offer_payment_type', PaymentType.MONETARY),
            offer_in_kind_description=offer_data.get('offer_in_kind_description'),
            message=offer_data.get('message'),
            created_at=get_current_timestamp(),
            updated_at=get_current_timestamp()
        )
        
        demo_offers[offer_id] = offer
        created_offers.append(offer)
    
    return created_offers

@app.get("/rest/v1/job_offers", response_model=List[JobOfferResponse])
async def get_offers_supabase_style(
    job_id: Optional[str] = None,
    offered_by_id: Optional[str] = None,
    status: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Get job offers with filtering"""
    offers = list(demo_offers.values())
    
    # Apply filters
    if job_id:
        offers = [offer for offer in offers if offer.job_id == job_id]
    if offered_by_id:
        offers = [offer for offer in offers if offer.offered_by_id == offered_by_id]
    if status:
        offers = [offer for offer in offers if offer.status == status]
    
    offers.sort(key=lambda x: x.created_at, reverse=True)
    return offers

# Legacy API endpoints for compatibility
@app.post("/api/jobs", response_model=dict)
async def create_job_legacy(job_data: CreateJobInput):
    """Legacy job creation endpoint"""
    result = await create_job_supabase_style(Request, None)
    return {"job": result[0].model_dump(), "success": True}

@app.get("/api/bounties", response_model=List[JobResponse])  
async def list_bounties_legacy():
    """Legacy bounties endpoint"""
    return await get_jobs_supabase_style(status="OPEN")

# Standard rates endpoint
@app.get("/api/standard-rates")
async def get_standard_rates():
    """Get standard service rates"""
    return STANDARD_RATES

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)