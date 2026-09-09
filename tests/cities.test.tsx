import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { cities, findCity } from "../cities/registry";
import { CityDemoApiService } from "../services/CityDemoApiService";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});
const apiFor = (slug: string) =>
  new CityDemoApiService(
    findCity(slug)!,
    cities.flatMap((city) => city.reviews),
  );
const open = (path: string) => {
  window.history.replaceState({}, "", path);
  return render(<App />);
};

describe("City review boundaries", () => {
  it("shows one landlord identity with different local reviews and ratings", async () => {
    const pitt = apiFor("pittsburgh");
    const arbor = apiFor("ann-arbor");
    expect((await pitt.getLandlordById(900))?.name).toBe(
      (await arbor.getLandlordById(900))?.name,
    );
    const p = await pitt.getReviewsByLandlordId(900);
    const a = await arbor.getReviewsByLandlordId(900);
    expect(p).toHaveLength(2);
    expect(a).toHaveLength(2);
    expect(p.every((r) => r.city_slug === "pittsburgh")).toBe(true);
    expect(a.every((r) => r.city_slug === "ann-arbor")).toBe(true);
    expect(p.reduce((sum, r) => sum + r.rating, 0)).not.toBe(
      a.reduce((sum, r) => sum + r.rating, 0),
    );
    expect(await pitt.getReviewById(a[0].id)).toBeUndefined();
    expect(await pitt.getLandlordById(21)).toBeUndefined();
    expect(await pitt.getReviewsByLandlordId(21)).toEqual([]);
    expect(await pitt.deleteReview(a[0].id)).toBe(false);
    await expect(
      pitt.updateReview(a[0].id, { comment: "wrong city" }),
    ).rejects.toThrow("Review not found");
  });
  it("assigns new reviews to the active city and resets them with a new service", async () => {
    const api = apiFor("pittsburgh");
    const seed = (await api.getReviewsByLandlordId(900))[0];
    const added = await api.addReview({
      ...seed,
      city_slug: "ann-arbor",
      comment: "Temporary test review",
    } as typeof seed);
    expect(added.city_slug).toBe("pittsburgh");
    expect(await api.getReviewsByLandlordId(900)).toHaveLength(3);
    expect(await apiFor("ann-arbor").getReviewById(added.id)).toBeUndefined();
    expect(await apiFor("pittsburgh").getReviewsByLandlordId(900)).toHaveLength(
      2,
    );
  });
  it("discovers five towns, excludes the template, and keeps fixture IDs unambiguous", () => {
    expect(cities.map((c) => c.slug)).toEqual(
      expect.arrayContaining([
        "pittsburgh",
        "ann-arbor",
        "austin",
        "college-park",
        "madison",
      ]),
    );
    const ids = cities.flatMap((c) => c.reviews.map((r) => r.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(findCity("your-town")).toBeUndefined();
  });
});

describe("City site navigation", () => {
  it("filters campuses and opens the existing Pittsburgh homepage", async () => {
    const user = userEvent.setup();
    open("/");
    await user.type(screen.getByRole("searchbox"), "Michigan");
    expect(
      screen.getByRole("region", { name: "Ann Arbor landlords" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Pittsburgh landlords" }),
    ).not.toBeInTheDocument();
    await user.clear(screen.getByRole("searchbox"));
    await user.click(
      screen.getByRole("link", { name: "Browse all Pittsburgh landlords" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: /Rent with Confidence in the Steel City/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/pittsburgh/login",
    );
  });
  it("shows review previews immediately and searches a shared landlord without merging city ratings", async () => {
    const user = userEvent.setup();
    open("/");
    expect(
      screen.getAllByText(/heating repair took several follow-ups/).length,
    ).toBeGreaterThan(0);
    await user.type(screen.getByRole("searchbox"), "Lantern");
    expect(
      screen.getByRole("link", {
        name: "Lantern Housing Group in Pittsburgh, 3.5 out of 5, 2 reviews",
      }),
    ).toHaveAttribute("href", "/pittsburgh/landlord/900");
    await user.click(
      screen.getByRole("link", {
        name: "Lantern Housing Group in Ann Arbor, 4.5 out of 5, 2 reviews",
      }),
    );
    await screen.findByText(/FICTIONAL ANN ARBOR REVIEW.*repair request/);
    expect(window.location.pathname).toBe("/ann-arbor/landlord/900");
    expect(
      screen.queryByText(/FICTIONAL PITTSBURGH REVIEW/),
    ).not.toBeInTheDocument();
  });
  it("finds addresses and offers recovery from an empty search", async () => {
    const user = userEvent.setup();
    open("/");
    await user.type(screen.getByRole("searchbox"), "102 Fictional Lane");
    expect(
      screen.getAllByRole("link", { name: /Juniper Homes in/ }),
    ).toHaveLength(cities.length);
    expect(
      screen.queryByRole("link", { name: /Lantern Housing Group in/ }),
    ).not.toBeInTheDocument();
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "no-such-landlord");
    expect(
      screen.getByRole("heading", { name: "No landlords found" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(
      screen.getByRole("region", { name: "Pittsburgh landlords" }),
    ).toBeInTheDocument();
  });
  it("keeps profile navigation scoped and clears cached reviews on city changes", async () => {
    const user = userEvent.setup();
    open("/pittsburgh/landlord/900");
    await screen.findByText(/FICTIONAL PITTSBURGH REVIEW.*repair request/);
    await user.click(screen.getByRole("link", { name: "Ann Arbor" }));
    await screen.findByText(/FICTIONAL ANN ARBOR REVIEW.*repair request/);
    expect(window.location.pathname).toBe("/ann-arbor/landlord/900");
    expect(
      screen.queryByText(/FICTIONAL PITTSBURGH REVIEW/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Write a Review" }),
    ).toHaveAttribute("href", "/ann-arbor/landlord/900/add-review");
    await user.click(screen.getByRole("link", { name: "Write a Review" }));
    await screen.findByRole("button", { name: /Submit Review/i });
    for (const link of screen.getAllByRole("link", { name: "Log in" })) {
      expect(link).toHaveAttribute("href", "/ann-arbor/login");
    }
  });
  it("submits a guest review locally with no network access", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("Network forbidden in prototype"));
    open("/college-park/landlord/900/add-review");
    const comment = await screen.findByRole("textbox", {
      name: /comment|review|experience/i,
    });
    await user.type(comment, "This is a temporary fictional test review.");
    await user.click(screen.getByRole("button", { name: /Submit Review/i }));
    await screen.findByText(
      "[DEMO REVIEW] This is a temporary fictional test review.",
    );
    expect(window.location.pathname).toBe("/college-park/landlord/900");
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(["/missing-city", "/_template"])(
    "handles unknown city %s without falling back to Pittsburgh",
    async (path) => {
      open(path);
      expect(
        screen.getByRole("heading", { name: "City not found" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Choose a supported city/ }),
      ).toHaveAttribute("href", "/");
    },
  );
  it("handles unknown pages within a city", async () => {
    open("/austin/not-a-page");
    await waitFor(() => expect(document.title).toContain("Austin"));
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/austin/",
    );
  });
});
