import { MockApiService } from "./MockApiService";
import type { CityDefinition, CityReview } from "../cities/types";
import type { IApiService, ReviewUpdate } from "./interfaces";

// A fresh instance belongs to one mounted city. No network or database writes.
export class CityDemoApiService extends MockApiService {
  private reviews: CityReview[];
  private nextId: number;
  constructor(
    private city: CityDefinition,
    allReviews: CityReview[],
  ) {
    super();
    this.reviews = structuredClone(allReviews);
    this.nextId = Math.max(10000, ...allReviews.map((review) => review.id)) + 1;
  }
  async getLandlords() {
    return structuredClone(this.city.landlords);
  }
  async getLandlordById(id: number) {
    return (await this.getLandlords()).find((l) => l.id === id);
  }
  async getReviewsByLandlordId(id: number, includeDeleted = false) {
    if (!(await this.getLandlordById(id))) return [];
    return structuredClone(
      this.reviews.filter(
        (r) =>
          r.landlord_id === id &&
          r.city_slug === this.city.slug &&
          (includeDeleted || !r.is_deleted),
      ),
    );
  }
  async getReviewById(id: number) {
    return structuredClone(
      this.reviews.find((r) => r.id === id && r.city_slug === this.city.slug),
    );
  }
  async getLatestReviewForLandlordByUser(id: number, userId: string) {
    return (await this.getReviewsByLandlordId(id))
      .filter((r) => r.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  }
  async addReview(
    data: Parameters<IApiService["addReview"]>[0],
  ): Promise<CityReview> {
    if (!(await this.getLandlordById(data.landlord_id)))
      throw new Error("Landlord not found in this city.");
    const now = new Date().toISOString();
    const review: CityReview = {
      ...data,
      id: this.nextId++,
      city_slug: this.city.slug,
      comment: `[DEMO REVIEW] ${data.comment}`,
      verification_status: "unverified",
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    this.reviews.push(review);
    return structuredClone(review);
  }
  async updateReview(id: number, data: ReviewUpdate) {
    const review = this.reviews.find(
      (r) => r.id === id && r.city_slug === this.city.slug,
    );
    if (!review) throw new Error("Review not found in this city.");
    Object.assign(review, data, {
      city_slug: this.city.slug,
      updated_at: new Date().toISOString(),
    });
  }
  async deleteReview(id: number) {
    const review = this.reviews.find(
      (r) => r.id === id && r.city_slug === this.city.slug,
    );
    if (!review) return false;
    review.is_deleted = true;
    return true;
  }
  async restoreReview(id: number) {
    const review = this.reviews.find(
      (r) => r.id === id && r.city_slug === this.city.slug,
    );
    if (!review) return false;
    review.is_deleted = false;
    return true;
  }
}
