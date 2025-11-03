"""
Generate realistic mock business listings
This creates high-quality, realistic business data for testing
"""

import json
import csv
import random
from datetime import datetime

# Business templates with realistic data
BUSINESS_TEMPLATES = [
    {
        "name": "SaaS Analytics Platform",
        "industry": "Technology",
        "description": "Established SaaS platform providing advanced analytics and business intelligence tools for mid-market companies. Features include real-time dashboards, custom reporting, and API integrations. Strong recurring revenue with 200+ enterprise clients and 95% retention rate. Built on modern tech stack with scalable AWS infrastructure.",
        "asking_price": 12500000,
        "revenue": 2500000,
        "ebitda": 1250000,
        "cash_flow": 1000000,
        "year_established": 2018,
        "employees": 25,
        "location": "Austin, TX",
        "highlights": [
            "200+ enterprise clients with 95% retention rate",
            "40% YoY growth over the past 3 years",
            "Modern tech stack with scalable infrastructure",
            "Recurring revenue model with annual contracts",
            "Strong brand presence in the industry"
        ],
        "reason_for_selling": "Founder looking to pursue a new venture",
        "images": [
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
        ]
    },
    {
        "name": "Premium Outdoor Gear E-commerce",
        "industry": "Retail",
        "description": "Thriving e-commerce business specializing in premium outdoor gear and equipment. Strong brand loyalty with engaged customer base of 50,000+ outdoor enthusiasts. Excellent margins on curated product selection. Multiple revenue streams including direct sales, affiliate partnerships, and sponsored content.",
        "asking_price": 8000000,
        "revenue": 3200000,
        "ebitda": 960000,
        "cash_flow": 850000,
        "year_established": 2015,
        "employees": 12,
        "location": "Denver, CO",
        "highlights": [
            "50,000+ active customers with 65% repeat purchase rate",
            "Strong social media presence (100K+ followers)",
            "Diversified supplier relationships",
            "Owned warehouse and inventory system"
        ],
        "reason_for_selling": "Owner relocating out of state for family reasons",
        "images": [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
            "https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800&q=80"
        ]
    },
    {
        "name": "Medical Billing Services Company",
        "industry": "Healthcare",
        "description": "Professional medical billing and coding services serving 75+ healthcare providers across multiple states. Excellent relationships with insurance companies and proven track record of maximizing reimbursements. HIPAA compliant systems and experienced certified staff.",
        "asking_price": 5400000,
        "revenue": 1800000,
        "ebitda": 720000,
        "cash_flow": 650000,
        "year_established": 2012,
        "employees": 35,
        "location": "Phoenix, AZ",
        "highlights": [
            "75+ healthcare provider clients",
            "Average client relationship of 8+ years",
            "HIPAA compliant systems and processes",
            "Proprietary software for claims management"
        ],
        "reason_for_selling": "Retirement - owner ready to exit after 12 successful years",
        "images": [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
        ]
    },
    {
        "name": "Specialty Coffee Roastery Chain",
        "industry": "Food & Beverage",
        "description": "Popular coffee roastery with 5 retail locations and wholesale distribution to 50+ cafes and restaurants. Known for single-origin beans and expert roasting. Strong community following and excellent online presence. Opportunities for expansion.",
        "asking_price": 7500000,
        "revenue": 2800000,
        "ebitda": 840000,
        "cash_flow": 750000,
        "year_established": 2014,
        "employees": 28,
        "location": "Seattle, WA",
        "highlights": [
            "5 profitable retail locations",
            "Wholesale accounts with 50+ businesses",
            "Award-winning roasting techniques",
            "Strong brand recognition in region"
        ],
        "reason_for_selling": "Owner wants to focus on family",
        "images": [
            "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
            "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
        ]
    },
    {
        "name": "Digital Marketing Agency",
        "industry": "Professional Services",
        "description": "Full-service digital marketing agency specializing in B2B lead generation. Services include SEO, PPC, content marketing, and marketing automation. 40+ active retainer clients with average relationship of 3+ years. Fully remote team with strong systems and processes.",
        "asking_price": 6200000,
        "revenue": 2100000,
        "ebitda": 840000,
        "cash_flow": 780000,
        "year_established": 2016,
        "employees": 18,
        "location": "Remote (HQ: San Francisco, CA)",
        "highlights": [
            "40+ active retainer clients",
            "92% client retention rate",
            "Fully remote, location-independent",
            "Proven systems and SOPs"
        ],
        "reason_for_selling": "Founder starting new venture in different industry",
        "images": [
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
        ]
    },
    {
        "name": "Custom Packaging Manufacturing",
        "industry": "Manufacturing",
        "description": "B2B custom packaging manufacturer serving food and beverage industry. State-of-the-art facility with modern equipment. Long-term contracts with major brands. Strong margins and consistent cash flow. Opportunities for automation and expansion.",
        "asking_price": 15000000,
        "revenue": 4100000,
        "ebitda": 1640000,
        "cash_flow": 1500000,
        "year_established": 2010,
        "employees": 45,
        "location": "Chicago, IL",
        "highlights": [
            "30+ enterprise clients with multi-year contracts",
            "Modern 50,000 sq ft facility (owned)",
            "Eco-friendly product line gaining traction",
            "Consistent 15% profit margins"
        ],
        "reason_for_selling": "Owner pursuing larger acquisition opportunity",
        "images": [
            "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80"
        ]
    },
    {
        "name": "Physical Therapy Clinic Group",
        "industry": "Healthcare",
        "description": "Three established physical therapy clinics in growing suburban markets. Mix of cash and insurance patients. Experienced staff willing to stay. Strong reputation and referral network. Excellent opportunity for healthcare professional or practice management group.",
        "asking_price": 4800000,
        "revenue": 1600000,
        "ebitda": 640000,
        "cash_flow": 580000,
        "year_established": 2011,
        "employees": 22,
        "location": "Atlanta, GA",
        "highlights": [
            "3 profitable clinic locations",
            "Experienced staff with low turnover",
            "Strong referral network with physicians",
            "Mix of cash and insurance revenue"
        ],
        "reason_for_selling": "Owner health issues requiring retirement",
        "images": [
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
        ]
    },
    {
        "name": "Boutique Fitness Studio",
        "industry": "Health & Fitness",
        "description": "High-end boutique fitness studio with strong membership base and excellent retention. Offers small group training, personal training, and specialized classes. Prime location with 5-year lease. Turnkey operation with experienced staff.",
        "asking_price": 950000,
        "revenue": 480000,
        "ebitda": 192000,
        "cash_flow": 175000,
        "year_established": 2017,
        "employees": 8,
        "location": "Miami, FL",
        "highlights": [
            "250+ active members",
            "85% retention rate",
            "Prime location with parking",
            "Fully equipped and modern"
        ],
        "reason_for_selling": "Owner moving to different city",
        "images": [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
        ]
    },
    {
        "name": "Managed IT Services Provider",
        "industry": "Technology",
        "description": "Established MSP serving 80+ small and medium businesses. Comprehensive services including network management, cybersecurity, cloud solutions, and help desk. Recurring revenue model with excellent margins. Remote monitoring tools and NOC infrastructure in place.",
        "asking_price": 9200000,
        "revenue": 3100000,
        "ebitda": 1240000,
        "cash_flow": 1100000,
        "year_established": 2013,
        "employees": 32,
        "location": "Boston, MA",
        "highlights": [
            "80+ business clients with MRR of $260K",
            "95% recurring revenue",
            "Strong cybersecurity practice",
            "Experienced technical team"
        ],
        "reason_for_selling": "Founder accepting executive role at enterprise company",
        "images": [
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
        ]
    },
    {
        "name": "Craft Brewery & Taproom",
        "industry": "Food & Beverage",
        "description": "Award-winning craft brewery with popular taproom and distribution to 200+ retail accounts across three states. Known for innovative IPAs and seasonal releases. Food service partnership generates additional revenue. Great community engagement and brand loyalty.",
        "asking_price": 5600000,
        "revenue": 1900000,
        "ebitda": 570000,
        "cash_flow": 520000,
        "year_established": 2015,
        "employees": 19,
        "location": "Portland, OR",
        "highlights": [
            "Award-winning beers with loyal following",
            "200+ retail distribution accounts",
            "Popular taproom with food service",
            "Modern brewing equipment"
        ],
        "reason_for_selling": "Partners pursuing separate opportunities",
        "images": [
            "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=80"
        ]
    },
    {
        "name": "E-Learning Platform",
        "industry": "Education",
        "description": "B2C e-learning platform offering professional development courses. 15,000+ active students, 200+ courses covering business, technology, and creative skills. Subscription and course-based revenue model. Content created by 50+ expert instructors.",
        "asking_price": 8800000,
        "revenue": 2200000,
        "ebitda": 1100000,
        "cash_flow": 950000,
        "year_established": 2017,
        "employees": 15,
        "location": "Remote (HQ: New York, NY)",
        "highlights": [
            "15,000+ active paying students",
            "200+ high-quality courses",
            "70% gross margins",
            "Growing market demand"
        ],
        "reason_for_selling": "Founder wants to travel and work on passion projects",
        "images": [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        ]
    },
    {
        "name": "Commercial Cleaning Service",
        "industry": "Professional Services",
        "description": "Commercial cleaning company serving office buildings, medical facilities, and retail spaces. 120+ recurring clients with long-term contracts. Well-trained staff, modern equipment, and proven systems. Excellent reputation and high client satisfaction.",
        "asking_price": 3200000,
        "revenue": 1400000,
        "ebitda": 420000,
        "cash_flow": 380000,
        "year_established": 2009,
        "employees": 65,
        "location": "Dallas, TX",
        "highlights": [
            "120+ recurring contracts",
            "Avg client relationship of 5+ years",
            "Low employee turnover",
            "Strong operational systems"
        ],
        "reason_for_selling": "Retirement after 15 years",
        "images": [
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
        ]
    },
    {
        "name": "Pet Grooming & Daycare",
        "industry": "Retail",
        "description": "Upscale pet grooming salon and daycare facility in affluent neighborhood. State-of-the-art facility with modern equipment. Strong recurring revenue from daycare memberships. Excellent reputation and 5-star reviews. Opportunities for expansion.",
        "asking_price": 1800000,
        "revenue": 720000,
        "ebitda": 288000,
        "cash_flow": 250000,
        "year_established": 2016,
        "employees": 12,
        "location": "San Diego, CA",
        "highlights": [
            "Modern 4,000 sq ft facility",
            "250+ regular clients",
            "5-star reputation",
            "High-income demographic"
        ],
        "reason_for_selling": "Owner relocating for family reasons",
        "images": [
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"
        ]
    },
    {
        "name": "Mobile App Development Studio",
        "industry": "Technology",
        "description": "Boutique mobile app development studio specializing in iOS and Android apps for startups and SMBs. Portfolio of 100+ successful apps. Recurring revenue from maintenance contracts and ongoing projects. Talented team with low turnover.",
        "asking_price": 4500000,
        "revenue": 1500000,
        "ebitda": 600000,
        "cash_flow": 540000,
        "year_established": 2014,
        "employees": 16,
        "location": "Remote (HQ: Los Angeles, CA)",
        "highlights": [
            "100+ successful app launches",
            "35% recurring revenue from maintenance",
            "Strong portfolio and case studies",
            "Fully remote team"
        ],
        "reason_for_selling": "Founder accepting CTO role at startup",
        "images": [
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80"
        ]
    },
    {
        "name": "HVAC Service Company",
        "industry": "Construction",
        "description": "Established HVAC installation and service company serving residential and light commercial customers. 85% recurring revenue from maintenance contracts. Fleet of 12 vehicles, modern equipment, and skilled technicians. Strong reputation in local market.",
        "asking_price": 6800000,
        "revenue": 2400000,
        "ebitda": 960000,
        "cash_flow": 850000,
        "year_established": 2008,
        "employees": 28,
        "location": "Charlotte, NC",
        "highlights": [
            "1,800+ maintenance contract customers",
            "85% recurring revenue",
            "Fleet of 12 service vehicles",
            "Strong brand in market"
        ],
        "reason_for_selling": "Owner wants to semi-retire",
        "images": [
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
        ]
    }
]

def generate_mock_businesses(num_businesses=15):
    """Generate mock business listings"""
    businesses = []

    for idx, template in enumerate(BUSINESS_TEMPLATES[:num_businesses], 1):
        business = {
            'id': str(idx),
            'name': template['name'],
            'industry': template['industry'],
            'location': template['location'],
            'askingPrice': template['asking_price'],
            'revenue': template['revenue'],
            'ebitda': template.get('ebitda'),
            'description': template['description'],
            'yearEstablished': template['year_established'],
            'employees': template.get('employees'),
            'matchScore': random.randint(75, 99),
            'isFeatured': idx <= 5,  # First 5 are featured
            'images': template.get('images', []),
            'status': 'active',
            'financials': {
                'cashFlow': template.get('cash_flow'),
                'assets': template['asking_price'] * 0.6,
                'liabilities': template['asking_price'] * 0.1
            },
            'highlights': template.get('highlights', []),
            'reasonForSelling': template.get('reason_for_selling'),
            'url': f'https://www.bizbuysell.com/business/{idx}',
            'scraped_at': datetime.now().isoformat()
        }
        businesses.append(business)

    return businesses

def export_json(businesses, filename='output/mock_businesses.json'):
    """Export to JSON"""
    os.makedirs('output', exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(businesses, f, indent=2, ensure_ascii=False)
    print(f"✓ Exported {len(businesses)} businesses to {filename}")

def export_csv(businesses, filename='output/mock_businesses.csv'):
    """Export to CSV"""
    os.makedirs('output', exist_ok=True)

    # Flatten for CSV
    csv_businesses = []
    for b in businesses:
        flat = {
            'id': b['id'],
            'name': b['name'],
            'industry': b['industry'],
            'location': b['location'],
            'askingPrice': b['askingPrice'],
            'revenue': b['revenue'],
            'ebitda': b.get('ebitda', ''),
            'yearEstablished': b['yearEstablished'],
            'employees': b.get('employees', ''),
            'matchScore': b['matchScore'],
            'isFeatured': b['isFeatured'],
            'description': b['description'][:200] + '...',
            'images': '; '.join(b.get('images', [])),
            'highlights': ' | '.join(b.get('highlights', [])),
            'reasonForSelling': b.get('reasonForSelling', '')
        }
        csv_businesses.append(flat)

    keys = csv_businesses[0].keys()
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(csv_businesses)

    print(f"✓ Exported {len(businesses)} businesses to {filename}")

def main():
    print("\n" + "="*60)
    print("MOCK BUSINESS DATA GENERATOR")
    print("="*60 + "\n")

    businesses = generate_mock_businesses(15)

    export_json(businesses)
    export_csv(businesses)

    print(f"\n{'='*60}")
    print("GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"Total businesses generated: {len(businesses)}")
    print(f"Industries covered: {len(set(b['industry'] for b in businesses))}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    import os
    main()
