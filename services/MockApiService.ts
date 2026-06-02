import type { IApiService, ReviewUpdate } from './interfaces';
import type { Landlord, Review } from '../types';
import { getAllCities } from '../utils/landlord';

// ---------------------------------------------------------------------------
// Clearly fake demo data used when the app runs in mock mode (no Supabase env).
//
// The data spans MULTIPLE CITIES so the city search/filter can be exercised
// without a real database. Every landlord name is prefixed "Demo:" and every
// review comment with "[DEMO REVIEW]" so it is obvious this is not real data.
//
// Note on multi-city landlords: a landlord can have properties in more than one
// city. Those landlords set `cities` to the full list (and `city` to a primary
// one for backward-compat). Single-city landlords just set `city`; helpers in
// utils/landlord.ts fall back to [city] when `cities` is absent.
// ---------------------------------------------------------------------------

const MOCK_LANDLORDS: Landlord[] = [
  // --- Pittsburgh, PA ---
  { id: 1, name: 'Demo: John Peterson', addresses: ['123 Forbes Ave', '125 Forbes Ave'], city: 'Pittsburgh, PA', status: 'approved', is_deleted: false, created_at: '2024-01-15T10:00:00Z' },
  { id: 2, name: 'Demo: Margaret Sullivan', addresses: ['456 Craig St'], city: 'Pittsburgh, PA', status: 'approved', is_deleted: false, created_at: '2024-02-03T14:30:00Z' },
  { id: 3, name: 'Demo: Steel City Rentals LLC', addresses: ['789 Atwood St', '791 Atwood St'], city: 'Pittsburgh, PA', status: 'approved', is_deleted: false, created_at: '2024-03-20T09:15:00Z' },

  // --- Philadelphia, PA ---
  { id: 4, name: 'Demo: Liberty Bell Properties', addresses: ['100 Market St', '102 Market St'], city: 'Philadelphia, PA', status: 'approved', is_deleted: false, created_at: '2024-02-18T10:00:00Z' },
  { id: 5, name: 'Demo: Rosa Delgado', addresses: ['55 Spruce St'], city: 'Philadelphia, PA', status: 'approved', is_deleted: false, created_at: '2024-04-02T13:00:00Z' },

  // --- Cleveland, OH ---
  { id: 6, name: 'Demo: Lakeside Management Co.', addresses: ['400 Euclid Ave'], city: 'Cleveland, OH', status: 'approved', is_deleted: false, created_at: '2024-01-28T08:30:00Z' },
  { id: 7, name: 'Demo: Erie Shore Homes', addresses: ['12 Detroit Ave', '14 Detroit Ave'], city: 'Cleveland, OH', status: 'approved', is_deleted: false, created_at: '2024-05-11T16:00:00Z' },

  // --- Columbus, OH ---
  { id: 8, name: 'Demo: Scarlet & Gray Rentals', addresses: ['77 Neil Ave'], city: 'Columbus, OH', status: 'approved', is_deleted: false, created_at: '2024-03-05T09:00:00Z' },

  // --- Multi-city: Buckeye Holdings owns property in Columbus AND Cleveland ---
  { id: 9, name: 'Demo: Buckeye Holdings Group', addresses: ['200 High St (Columbus)', '88 Superior Ave (Cleveland)'], city: 'Columbus, OH', cities: ['Columbus, OH', 'Cleveland, OH'], status: 'approved', is_deleted: false, created_at: '2024-02-22T11:00:00Z' },

  // --- Boston, MA ---
  { id: 10, name: 'Demo: Beacon Hill Leasing', addresses: ['9 Beacon St'], city: 'Boston, MA', status: 'approved', is_deleted: false, created_at: '2024-04-19T10:30:00Z' },
  { id: 11, name: 'Demo: Charles River Properties', addresses: ['300 Commonwealth Ave', '302 Commonwealth Ave'], city: 'Boston, MA', status: 'approved', is_deleted: false, created_at: '2024-06-07T14:00:00Z' },

  // --- Austin, TX ---
  { id: 12, name: 'Demo: Hill Country Homes', addresses: ['600 Congress Ave'], city: 'Austin, TX', status: 'approved', is_deleted: false, created_at: '2024-03-30T12:00:00Z' },
  { id: 13, name: 'Demo: Lone Star Leasing', addresses: ['21 Rainey St'], city: 'Austin, TX', status: 'approved', is_deleted: false, created_at: '2024-05-25T09:45:00Z' },

  // --- Chicago, IL ---
  { id: 14, name: 'Demo: Windy City Rentals', addresses: ['500 N State St'], city: 'Chicago, IL', status: 'approved', is_deleted: false, created_at: '2024-04-08T08:00:00Z' },

  // --- Denver, CO ---
  { id: 15, name: 'Demo: Mile High Property Co.', addresses: ['1600 Larimer St'], city: 'Denver, CO', status: 'approved', is_deleted: false, created_at: '2024-06-15T11:30:00Z' },

  // --- Multi-city: a regional manager operating in Austin, Denver, and Chicago ---
  { id: 16, name: 'Demo: Coast2Coast Property Mgmt', addresses: ['410 Brazos St (Austin)', '900 Champa St (Denver)', '233 W Wacker Dr (Chicago)'], city: 'Austin, TX', cities: ['Austin, TX', 'Denver, CO', 'Chicago, IL'], status: 'approved', is_deleted: false, created_at: '2024-01-09T10:00:00Z' },
];

// Helper to keep the (large) review fixture compact and consistent.
type Ratings = [rating: number, communication: number, maintenance: number, respect: number];
function mkReview(
  id: number,
  landlordId: number,
  [rating, communication, maintenance, respect]: Ratings,
  comment: string,
  extra: Partial<Review> = {}
): Review {
  const createdAt = extra.created_at ?? '2024-07-01T12:00:00Z';
  return {
    id,
    landlord_id: landlordId,
    rating,
    communication,
    maintenance,
    respect,
    comment: `[DEMO REVIEW] ${comment}`,
    would_rent_again: rating >= 4,
    verification_status: 'unverified',
    created_by_student: false,
    is_deleted: false,
    created_at: createdAt,
    updated_at: createdAt,
    ...extra,
  };
}

const MOCK_REVIEWS: Record<number, Review[]> = {
  // Pittsburgh
  1: [
    mkReview(101, 1, [4, 5, 4, 4], 'John was generally a great landlord. Very responsive to maintenance requests and always professional.', { rent_amount: 1200, property_address: '123 Forbes Ave, Apt 2B', verification_status: 'verified', created_by_student: true, created_at: '2024-06-01T12:00:00Z' }),
    mkReview(102, 1, [3, 3, 2, 4], 'Decent overall. Took about two weeks to fix a leaky faucet, but always polite and returned the deposit on time.', { rent_amount: 1150, property_address: '125 Forbes Ave, Apt 1A', created_at: '2024-07-15T09:30:00Z' }),
  ],
  2: [
    mkReview(201, 2, [5, 5, 5, 5], 'Margaret is amazing! Fixed every issue within 24 hours and even left a welcome gift when we moved in.', { rent_amount: 950, property_address: '456 Craig St, Apt 3', verification_status: 'verified', created_by_student: true, created_at: '2024-08-20T15:00:00Z' }),
    mkReview(202, 2, [5, 4, 5, 5], 'One of the best renting experiences I have had. Clean unit, quick repairs, always fair.', { rent_amount: 1000, property_address: '456 Craig St, Apt 4', verification_status: 'verified', created_at: '2024-09-05T10:00:00Z' }),
  ],
  3: [
    mkReview(301, 3, [2, 1, 2, 2], 'Very hard to reach. Maintenance requests went unanswered for weeks.', { rent_amount: 1400, property_address: '789 Atwood St, Unit 5', created_at: '2024-05-10T08:00:00Z' }),
    mkReview(302, 3, [3, 2, 3, 3], 'Average. Communication could be better but they do fix things eventually. Great location for students.', { rent_amount: 1350, property_address: '791 Atwood St, Unit 2', created_by_student: true, created_at: '2024-06-22T14:00:00Z' }),
  ],

  // Philadelphia
  4: [
    mkReview(401, 4, [4, 4, 4, 5], 'Solid management company. Online portal made rent easy and repairs were handled within a few days.', { rent_amount: 1500, property_address: '100 Market St, Apt 7C', verification_status: 'verified', created_at: '2024-07-12T10:00:00Z' }),
    mkReview(402, 4, [3, 3, 4, 3], 'Building is well kept but parking is a nightmare. Staff were courteous though.', { rent_amount: 1450, property_address: '102 Market St, Apt 3B', created_at: '2024-08-30T09:00:00Z' }),
  ],
  5: [
    mkReview(501, 5, [5, 5, 5, 5], 'Rosa is the kindest landlord I have ever had. Felt like renting from family.', { rent_amount: 1100, property_address: '55 Spruce St, Unit 2', verification_status: 'verified', created_by_student: true, created_at: '2024-09-18T13:00:00Z' }),
  ],

  // Cleveland
  6: [
    mkReview(601, 6, [2, 2, 1, 3], 'Heat went out twice in winter and took days to fix. Disappointing for the price.', { rent_amount: 1300, property_address: '400 Euclid Ave, Apt 11', created_at: '2024-02-05T08:00:00Z' }),
    mkReview(602, 6, [3, 3, 3, 4], 'Mixed experience. Front office is friendly but maintenance is slow.', { rent_amount: 1250, property_address: '400 Euclid Ave, Apt 4', created_at: '2024-04-21T11:00:00Z' }),
  ],
  7: [
    mkReview(701, 7, [4, 5, 4, 4], 'Great communication. Always answered texts within the hour and the place was move-in ready.', { rent_amount: 1050, property_address: '12 Detroit Ave, Apt 1', verification_status: 'verified', created_at: '2024-06-30T15:00:00Z' }),
  ],

  // Columbus
  8: [
    mkReview(801, 8, [4, 4, 3, 4], 'Good value near campus. Repairs took a little while but they were thorough.', { rent_amount: 900, property_address: '77 Neil Ave, Apt 5', created_by_student: true, created_at: '2024-05-03T10:00:00Z' }),
    mkReview(802, 8, [5, 5, 4, 5], 'Renewed my lease twice. Honestly no complaints, very respectful of tenants.', { rent_amount: 950, property_address: '77 Neil Ave, Apt 8', verification_status: 'verified', created_by_student: true, created_at: '2024-08-14T12:00:00Z' }),
  ],

  // Buckeye Holdings (multi-city: Columbus + Cleveland)
  9: [
    mkReview(901, 9, [3, 2, 3, 3], 'Rented their Columbus unit. Big company feel — everything goes through a ticket system.', { rent_amount: 1200, property_address: '200 High St, Apt 14 (Columbus)', created_at: '2024-04-10T09:00:00Z' }),
    mkReview(902, 9, [4, 4, 4, 4], 'Their Cleveland building was well maintained and the leasing agent was responsive.', { rent_amount: 1150, property_address: '88 Superior Ave, Apt 6 (Cleveland)', verification_status: 'verified', created_at: '2024-07-22T14:00:00Z' }),
    mkReview(903, 9, [2, 2, 2, 3], 'Got bounced between offices when I had an issue across their two markets. Frustrating.', { rent_amount: 1180, property_address: '200 High St, Apt 9 (Columbus)', created_at: '2024-09-01T11:00:00Z' }),
  ],

  // Boston
  10: [
    mkReview(1001, 10, [5, 4, 5, 5], 'Beautiful historic building, impeccably maintained. Pricey but worth it.', { rent_amount: 2600, property_address: '9 Beacon St, Apt 2', verification_status: 'verified', created_at: '2024-06-25T10:00:00Z' }),
    mkReview(1002, 10, [3, 3, 3, 3], 'Fine, but the radiators are loud and they were slow to address it.', { rent_amount: 2500, property_address: '9 Beacon St, Apt 5', created_at: '2024-08-09T09:00:00Z' }),
  ],
  11: [
    mkReview(1101, 11, [4, 4, 5, 4], 'Quick with repairs and the laundry room is always clean. Would rent again.', { rent_amount: 2300, property_address: '300 Commonwealth Ave, Apt 3R', verification_status: 'verified', created_by_student: true, created_at: '2024-07-30T13:00:00Z' }),
  ],

  // Austin
  12: [
    mkReview(1201, 12, [4, 5, 4, 4], 'Downtown location is unbeatable and the staff are friendly. AC worked great through the summer.', { rent_amount: 1800, property_address: '600 Congress Ave, Apt 12', verification_status: 'verified', created_at: '2024-06-18T16:00:00Z' }),
    mkReview(1202, 12, [3, 3, 2, 4], 'Nice place but maintenance backlog in summer was rough.', { rent_amount: 1750, property_address: '600 Congress Ave, Apt 9', created_at: '2024-08-27T10:00:00Z' }),
  ],
  13: [
    mkReview(1301, 13, [2, 1, 2, 2], 'Hard to get anyone on the phone. Deposit return took three months.', { rent_amount: 1600, property_address: '21 Rainey St, Unit 4', created_at: '2024-07-05T09:00:00Z' }),
  ],

  // Chicago
  14: [
    mkReview(1401, 14, [4, 4, 4, 5], 'Responsive and respectful. The building is older but well cared for.', { rent_amount: 1700, property_address: '500 N State St, Apt 21', verification_status: 'verified', created_at: '2024-07-19T11:00:00Z' }),
    mkReview(1402, 14, [3, 4, 2, 3], 'Good communication but had to follow up several times to get the dishwasher fixed.', { rent_amount: 1650, property_address: '500 N State St, Apt 8', created_at: '2024-09-12T14:00:00Z' }),
  ],

  // Denver
  15: [
    mkReview(1501, 15, [5, 5, 5, 5], 'Best landlord in Denver, hands down. Repairs same-day and super respectful.', { rent_amount: 1900, property_address: '1600 Larimer St, Apt 30', verification_status: 'verified', created_by_student: true, created_at: '2024-08-02T12:00:00Z' }),
  ],

  // Coast2Coast (multi-city: Austin + Denver + Chicago)
  16: [
    mkReview(1601, 16, [3, 3, 3, 3], 'Rented from their Austin portfolio. Professional but very corporate.', { rent_amount: 1750, property_address: '410 Brazos St, Apt 5 (Austin)', created_at: '2024-03-15T10:00:00Z' }),
    mkReview(1602, 16, [4, 4, 4, 4], 'Their Denver building was great and transferring my lease from the Chicago unit was painless.', { rent_amount: 1850, property_address: '900 Champa St, Apt 12 (Denver)', verification_status: 'verified', created_at: '2024-06-11T13:00:00Z' }),
    mkReview(1603, 16, [2, 2, 3, 2], 'Chicago unit had ongoing plumbing issues and support felt impersonal.', { rent_amount: 1700, property_address: '233 W Wacker Dr, Apt 18 (Chicago)', created_at: '2024-09-20T09:00:00Z' }),
  ],
};

// Start well above the seeded fixture IDs above so newly-created mock
// landlords/reviews never collide with the demo data.
let nextId = 100000;

export class MockApiService implements IApiService {
  async getLandlords(): Promise<Landlord[]> {
    return [...MOCK_LANDLORDS];
  }

  async getCities(): Promise<string[]> {
    // Derived from the data so the set updates automatically as landlords are
    // added during the session. (A real backend does this with a DISTINCT query
    // or a maintained lookup table — see SupabaseApiService / init.sql.)
    return getAllCities(MOCK_LANDLORDS.filter((l) => !l.is_deleted && l.status === 'approved'));
  }

  async getLandlordById(id: number): Promise<Landlord | undefined> {
    return MOCK_LANDLORDS.find((l) => l.id === id);
  }

  async getReviewsByLandlordId(landlordId: number, _includeDeleted = false): Promise<Review[]> {
    return MOCK_REVIEWS[landlordId] ?? [];
  }

  async getReviewById(reviewId: number): Promise<Review | undefined> {
    for (const reviews of Object.values(MOCK_REVIEWS)) {
      const found = reviews.find((r) => r.id === reviewId);
      if (found) return { ...found };
    }
    return undefined;
  }

  async getLatestReviewForLandlordByUser(
    _landlordId: number,
    _userId: string
  ): Promise<Review | undefined> {
    return undefined;
  }

  async uploadVerificationFile(_file: File, _userId: string, _reviewId: number): Promise<string> {
    return 'demo/mock-verification-file.pdf';
  }

  async deleteVerificationFile(_filePath: string): Promise<void> {}

  async getVerificationFileUrl(_filePath: string): Promise<string> {
    return '#';
  }

  async addLandlord(
    landlordData: Omit<Landlord, 'id' | 'is_deleted' | 'created_at' | 'status'>
  ): Promise<Landlord> {
    const newLandlord: Landlord = {
      ...landlordData,
      id: ++nextId,
      // Approve immediately in demo mode so the new landlord (and any brand-new
      // city) is visible right away; a real backend keeps this 'pending'.
      status: 'approved',
      is_deleted: false,
      created_at: new Date().toISOString(),
    };
    // Persist in-memory so getLandlords()/getCities() reflect the addition and
    // newly-introduced cities are automatically tracked for the session.
    MOCK_LANDLORDS.push(newLandlord);
    return newLandlord;
  }

  async addReview(
    reviewData: Omit<Review, 'id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>
  ): Promise<Review> {
    return {
      ...reviewData,
      id: ++nextId,
      is_deleted: false,
      verification_file_url: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateReview(_reviewId: number, _data: ReviewUpdate): Promise<void> {}

  async deleteReview(_reviewId: number): Promise<boolean> {
    return true;
  }

  async restoreReview(_reviewId: number): Promise<boolean> {
    return true;
  }

  async getPendingLandlords(): Promise<Landlord[]> {
    return [];
  }

  async getPendingReviews(): Promise<Review[]> {
    return [];
  }

  async updateLandlordStatus(
    _landlordId: number,
    _status: 'pending' | 'approved' | 'rejected'
  ): Promise<boolean> {
    return true;
  }

  async updateReviewVerificationStatus(
    _reviewId: number,
    _verificationStatus: 'unverified' | 'pending' | 'verified'
  ): Promise<boolean> {
    return true;
  }

  async updateLandlordAddresses(_landlordId: number, _addresses: string[]): Promise<boolean> {
    return true;
  }
}
