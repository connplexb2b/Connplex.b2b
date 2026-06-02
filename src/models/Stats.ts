import mongoose, { Schema } from 'mongoose';

const StatsSchema = new Schema({
  homepage: {
    annualFootfall: { type: String, default: "10M+" },
    premiumScreens: { type: String, default: "125+" },
    citiesCovered: { type: String, default: "Metro + Tier 1, 2, 3" },
    experiencesDelivered: { type: String, default: "Immersive" }
  },
  aboutPage: {
    screens: { type: String, default: "125+" },
    franchiseLocations: { type: String, default: "42+" },
    yearsOfExcellence: { type: String, default: "8+" },
    vision: { type: String, default: "1" },
    happyMoviegoers: { type: String, default: "10M+" }
  },
  advertisePage: {
    ageRange: { type: String, default: "70%" },
    premiumIncome: { type: String, default: "65%" },
    frequentMoviegoers: { type: String, default: "80%" },
    engagementRate: { type: String, default: "4.7/5" },
    cities: { type: String, default: "50+" },
    screens: { type: String, default: "125+" }
  },
  franchisePage: {
    cinemasNationwide: { type: String, default: "42+" },
    happyMoviegoers: { type: String, default: "10M+" },
    citiesCovered: { type: String, default: "50+" },
    partnerSatisfaction: { type: String, default: "98%" }
  },
  bookEventPage: {
    iconicVenues: { type: String, default: "42+" },
    premiumSpaces: { type: String, default: "125+" },
    possibilities: { type: String, default: "∞" }
  },
  caseStudiesPage: {
    smartCinemas: { type: String, default: "42+" },
    screensDeployed: { type: String, default: "125+" },
    guestsImpressed: { type: String, default: "10M+" },
    citiesAcrossIndia: { type: String, default: "50+" },
    yearsOfExcellence: { type: String, default: "8+" }
  },
  galleryPage: {
    screens: { type: String, default: "125+" },
    locations: { type: String, default: "42+" },
    years: { type: String, default: "8+" },
    experiences: { type: String, default: "10M" }
  }
}, { timestamps: true });

export const Stats = mongoose.models.Stats || mongoose.model('Stats', StatsSchema);
export default Stats;
