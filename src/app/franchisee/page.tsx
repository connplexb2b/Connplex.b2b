'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './franchisee.css';
import AhilyanagarApiIntegration from '../../components/conncloud/AhilyanagarApiIntegration';
import AhilyanagarFranchiseDashboard from '../../components/conncloud/AhilyanagarFranchiseDashboard';
import {
  verifyFranchiseeCredentials,
  storeFranchiseeSession,
  getStoredFranchiseeUser,
  clearFranchiseeSession,
  FranchiseeUser
} from '../../lib/franchiseeAuth';

// TypeScript Interfaces
interface Metric {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  sparkline: number[];
}

interface ScreenShow {
  screen: string;
  movie: string;
  time: string;
  occupancy: number;
  seatsBooked?: number;
  totalSeats?: number;
}

interface EventItem {
  date: string;
  month: string;
  title: string;
  type: string;
  tagColor?: string;
}

interface NewsItem {
  tag: string;
  title: string;
  time: string;
}

interface CampaignItem {
  name: string;
  reach: string;
  ctr: string;
  status: 'ACTIVE' | 'SCHEDULED';
}

interface LocationConfig {
  id: string;
  name: string;
  shortLabel: string;
  fullName: string;
  city: string;
  state: string;
  cinemaId: string;
  totalScreens: number;
  totalSeats: number;
  partnerName: string;
  partnerRole: string;
  partnerInitials: string;
  hasApiIntegration?: boolean;
  screens: ScreenShow[];
  metrics: Metric[];
  events: EventItem[];
  campaigns: CampaignItem[];
  newsList: NewsItem[];
}

const LOCATIONS: Record<string, LocationConfig> = {
  ahilyanagar: {
    id: 'ahilyanagar',
    name: 'Ahilyanagar',
    shortLabel: 'Ahilyanagar (Vista API Ready)',
    fullName: 'CONNPLEX LUXURIANCE, AHILYANAGAR',
    city: 'Ahilyanagar',
    state: 'Maharashtra',
    cinemaId: 'c5',
    totalScreens: 2,
    totalSeats: 80,
    partnerName: 'Vikram Shinde',
    partnerRole: 'Ahilyanagar Franchise Partner',
    partnerInitials: 'VS',
    hasApiIntegration: true,
    screens: [
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Raftaar', time: '11:00 AM - 01:30 PM', occupancy: 85, seatsBooked: 17, totalSeats: 20 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Raftaar', time: '02:30 PM - 05:10 PM', occupancy: 90, seatsBooked: 18, totalSeats: 20 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Cosmic Drift', time: '06:00 PM - 08:45 PM', occupancy: 95, seatsBooked: 19, totalSeats: 20 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Cosmic Drift', time: '09:15 PM - 11:45 PM', occupancy: 90, seatsBooked: 18, totalSeats: 20 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Cosmic Drift', time: '11:30 AM - 02:00 PM', occupancy: 78, seatsBooked: 47, totalSeats: 60 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Ishq Junction', time: '03:00 PM - 05:35 PM', occupancy: 82, seatsBooked: 49, totalSeats: 60 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Shadow Protocol', time: '06:30 PM - 09:10 PM', occupancy: 88, seatsBooked: 53, totalSeats: 60 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Raftaar', time: '09:45 PM - 12:15 AM', occupancy: 75, seatsBooked: 45, totalSeats: 60 }
    ],
    metrics: [
      { label: "Today's Revenue", value: "₹1.02L", trend: "+8.2%", isUp: true, sparkline: [65, 72, 68, 85, 92, 98, 102] },
      { label: "Weekly Revenue", value: "₹7.25L", trend: "+6.4%", isUp: true, sparkline: [58, 61, 64, 67, 69, 71, 72.5] },
      { label: "Monthly Revenue", value: "₹31.4L", trend: "+5.1%", isUp: true, sparkline: [24.5, 26.0, 27.8, 28.5, 29.8, 30.6, 31.4] },
      { label: "ROI", value: "19.4%", trend: "+1.5pt", isUp: true, sparkline: [14.2, 15.0, 16.5, 17.2, 18.0, 18.8, 19.4] },
      { label: "Admissions", value: "268", trend: "+7.2%", isUp: true, sparkline: [195, 210, 225, 240, 252, 260, 268] },
      { label: "Occupancy", value: "84%", trend: "+3.5%", isUp: true, sparkline: [72, 75, 78, 80, 81, 83, 84] },
      { label: "Avg Ticket Price", value: "₹275", trend: "+2.4%", isUp: true, sparkline: [260, 265, 268, 270, 272, 274, 275] },
      { label: "Spend Per Head", value: "₹110", trend: "+4.2%", isUp: true, sparkline: [95, 98, 102, 105, 106, 108, 110] },
      { label: "Online Bookings", value: "192", trend: "+12.1%", isUp: true, sparkline: [130, 145, 155, 168, 175, 184, 192] },
      { label: "Counter Sales", value: "76", trend: "-1.8%", isUp: false, sparkline: [85, 82, 80, 78, 77, 76, 76] },
      { label: "Food Revenue", value: "₹29.5K", trend: "+8.6%", isUp: true, sparkline: [18.5, 20.2, 22.0, 24.5, 26.1, 28.0, 29.5] },
      { label: "Customer Rating", value: "4.8★", trend: "+0.2", isUp: true, sparkline: [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8] }
    ],
    events: [
      { date: "16", month: "Sep", title: "Kalyani Steels Corporate Screening (Screen 2 - 60 Guests)", type: "Corporate Booking" },
      { date: "18", month: "Sep", title: "Screen 1 & 2 Daikin VRV HVAC Maintenance", type: "Maintenance" },
      { date: "22", month: "Sep", title: "Maharashtra Cinematograph License Inspection", type: "Compliance" },
      { date: "25", month: "Sep", title: "Ahilyanagar Couple Recliner VIP Evening", type: "Promotion" },
      { date: "28", month: "Sep", title: "Regional Maharashtra Franchise Partners Meet", type: "Meeting" },
      { date: "02", month: "Oct", title: "Gandhi Jayanti Blockbuster Showcase", type: "Release" }
    ],
    campaigns: [
      { name: "Ahilyanagar Grand Recliner Special", reach: "34.8K", ctr: "4.8%", status: "ACTIVE" },
      { name: "AHILYA20 Couple Recliner Promo", reach: "18.2K", ctr: "5.6%", status: "ACTIVE" },
      { name: "Corporate VIP Screening Package", reach: "12.4K", ctr: "4.2%", status: "ACTIVE" }
    ],
    newsList: [
      { tag: "VISTA API", title: "Connplex Ahilyanagar daily ticket & F&B sync active (Vista API)", time: "15m ago" },
      { tag: "FINANCE", title: "Ahilyanagar property monthly collection statement ready", time: "2h ago" },
      { tag: "AUDIT", title: "FSSAI Food Safety & Concession hygiene audit: Grade A certified", time: "1d ago" },
      { tag: "COMPLIANCE", title: "Maharashtra Cinematograph License DM compliance certified", time: "2d ago" },
      { tag: "BOOKINGS", title: "Special corporate screening confirmed for Kalyani Steels", time: "3d ago" }
    ]
  },
  gandhinagar: {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    shortLabel: 'Gandhinagar (Capital 2)',
    fullName: 'CONNPLEX CAPITAL 2, GANDHINAGAR',
    city: 'Gandhinagar',
    state: 'Gujarat',
    cinemaId: 'c0',
    totalScreens: 6,
    totalSeats: 650,
    partnerName: 'Rakesh Patel',
    partnerRole: 'Franchise Partner & Super Admin',
    partnerInitials: 'RP',
    screens: [
      { screen: 'Screen 1', movie: 'Raftaar', time: '2:30 PM - 5:10 PM', occupancy: 82, seatsBooked: 98, totalSeats: 120 },
      { screen: 'Screen 2', movie: 'Cosmic Drift', time: '3:00 PM - 5:45 PM', occupancy: 64, seatsBooked: 70, totalSeats: 110 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '2:45 PM - 5:20 PM', occupancy: 91, seatsBooked: 91, totalSeats: 100 },
      { screen: 'Screen 4', movie: 'Shadow Protocol', time: '4:00 PM - 6:30 PM', occupancy: 57, seatsBooked: 63, totalSeats: 110 },
      { screen: 'Screen 5', movie: 'Dil Ki Baazi', time: '3:15 PM - 5:50 PM', occupancy: 73, seatsBooked: 77, totalSeats: 105 },
      { screen: 'Screen 6', movie: 'The Last Circuit', time: '4:30 PM - 7:00 PM', occupancy: 48, seatsBooked: 50, totalSeats: 105 }
    ],
    metrics: [
      { label: "Today's Revenue", value: "₹4.82L", trend: "+8.2%", isUp: true, sparkline: [10, 15, 8, 20, 25, 18, 30] },
      { label: "Weekly Revenue", value: "₹31.6L", trend: "+5.4%", isUp: true, sparkline: [20, 24, 22, 28, 25, 32, 35] },
      { label: "Monthly Revenue", value: "₹1.28Cr", trend: "+3.1%", isUp: true, sparkline: [15, 18, 21, 20, 24, 23, 28] },
      { label: "ROI", value: "18.4%", trend: "+1.2pt", isUp: true, sparkline: [12, 14, 13, 16, 15, 17, 18.4] },
      { label: "Admissions", value: "3,842", trend: "+6.7%", isUp: true, sparkline: [10, 14, 18, 15, 22, 26, 28] },
      { label: "Occupancy", value: "68%", trend: "-2.1%", isUp: false, sparkline: [75, 73, 72, 70, 71, 69, 68] },
      { label: "Avg Ticket Price", value: "₹215", trend: "+1.8%", isUp: true, sparkline: [205, 208, 210, 209, 212, 214, 215] },
      { label: "Spend Per Head", value: "₹142", trend: "+4.0%", isUp: true, sparkline: [130, 133, 135, 138, 136, 140, 142] },
      { label: "Online Bookings", value: "2,150", trend: "+11.3%", isUp: true, sparkline: [1200, 1400, 1500, 1700, 1900, 2000, 2150] },
      { label: "Counter Sales", value: "1,692", trend: "-3.4%", isUp: false, sparkline: [1800, 1750, 1720, 1710, 1730, 1700, 1692] },
      { label: "Food Revenue", value: "₹1.86L", trend: "+7.9%", isUp: true, sparkline: [1.2, 1.4, 1.3, 1.6, 1.5, 1.7, 1.86] },
      { label: "Customer Rating", value: "4.6★", trend: "+0.2", isUp: true, sparkline: [4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6] }
    ],
    events: [
      { date: "18", month: "Sep", title: "Raftaar 2: Weekend release showcase", type: "Release" },
      { date: "20", month: "Sep", title: "Regional Franchise Review Meeting", type: "Meeting" },
      { date: "24", month: "Sep", title: "AC Zone C compressor scheduled service", type: "Maintenance" },
      { date: "28", month: "Sep", title: "Navratri Festival ticket bundle promotion", type: "Promotion" },
      { date: "02", month: "Oct", title: "Gandhinagar Cultural Fest Movie Nights", type: "Local event" }
    ],
    campaigns: [
      { name: "Monsoon Movie Fest", reach: "48.2K", ctr: "4.1%", status: "ACTIVE" },
      { name: "Weekday Family Combo", reach: "21.6K", ctr: "3.2%", status: "ACTIVE" },
      { name: "Festive Season Bundle", reach: "---", ctr: "---", status: "SCHEDULED" }
    ],
    newsList: [
      { tag: "CORPORATE", title: "Q2 franchise royalty statements now available", time: "2h ago" },
      { tag: "INDUSTRY", title: "National box office up 14% this quarter", time: "1d ago" },
      { tag: "RELEASE", title: "The Last Circuit 2 confirmed for release", time: "2d ago" },
      { tag: "POLICY", title: "Updated F&B hygiene compliance checklist released", time: "3d ago" }
    ]
  },
  jodhpur: {
    id: 'jodhpur',
    name: 'Jodhpur',
    shortLabel: 'Connplex Jodhpur',
    fullName: 'CONNPLEX JODHPUR',
    city: 'Jodhpur',
    state: 'Rajasthan',
    cinemaId: 'c1',
    totalScreens: 4,
    totalSeats: 440,
    partnerName: 'Surendra Rathore',
    partnerRole: 'Jodhpur Franchise Partner',
    partnerInitials: 'SR',
    screens: [
      { screen: 'Screen 1 (Gold)', movie: 'Raftaar', time: '1:30 PM - 4:10 PM', occupancy: 78, seatsBooked: 94, totalSeats: 120 },
      { screen: 'Screen 2', movie: 'Cosmic Drift', time: '2:15 PM - 5:00 PM', occupancy: 65, seatsBooked: 117, totalSeats: 180 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '4:30 PM - 7:00 PM', occupancy: 88, seatsBooked: 132, totalSeats: 150 },
      { screen: 'Screen 4', movie: 'Shadow Protocol', time: '5:15 PM - 7:45 PM', occupancy: 52, seatsBooked: 47, totalSeats: 90 }
    ],
    metrics: [
      { label: "Today's Revenue", value: "₹2.95L", trend: "+6.1%", isUp: true, sparkline: [12, 14, 18, 16, 22, 24, 29.5] },
      { label: "Weekly Revenue", value: "₹19.4L", trend: "+4.8%", isUp: true, sparkline: [15, 16, 17, 18, 18.5, 19, 19.4] },
      { label: "Monthly Revenue", value: "₹78.2L", trend: "+3.8%", isUp: true, sparkline: [68, 70, 72, 74, 75, 77, 78.2] },
      { label: "ROI", value: "17.2%", trend: "+0.9pt", isUp: true, sparkline: [14, 14.5, 15, 15.8, 16.2, 16.8, 17.2] },
      { label: "Admissions", value: "1,280", trend: "+5.3%", isUp: true, sparkline: [950, 1020, 1100, 1150, 1200, 1240, 1280] },
      { label: "Occupancy", value: "72%", trend: "+1.8%", isUp: true, sparkline: [65, 68, 69, 70, 71, 71, 72] },
      { label: "Avg Ticket Price", value: "₹230", trend: "+1.5%", isUp: true, sparkline: [220, 222, 225, 226, 228, 229, 230] },
      { label: "Spend Per Head", value: "₹125", trend: "+3.2%", isUp: true, sparkline: [115, 118, 120, 121, 122, 124, 125] },
      { label: "Online Bookings", value: "890", trend: "+9.5%", isUp: true, sparkline: [650, 710, 750, 800, 840, 870, 890] },
      { label: "Counter Sales", value: "390", trend: "-2.1%", isUp: false, sparkline: [420, 410, 405, 400, 395, 392, 390] },
      { label: "Food Revenue", value: "₹1.12L", trend: "+6.4%", isUp: true, sparkline: [0.8, 0.9, 0.95, 1.0, 1.05, 1.08, 1.12] },
      { label: "Customer Rating", value: "4.7★", trend: "+0.1", isUp: true, sparkline: [4.5, 4.5, 4.6, 4.6, 4.6, 4.7, 4.7] }
    ],
    events: [
      { date: "19", month: "Sep", title: "Jodhpur Desert Cinefest Opening Night", type: "Local event" },
      { date: "25", month: "Sep", title: "Screen 3 Christie Projector Lamp Replacement", type: "Maintenance" },
      { date: "28", month: "Sep", title: "Marwar Weekend Family Film Festival", type: "Promotion" }
    ],
    campaigns: [
      { name: "Royal Rajasthan Cine Experience", reach: "32.4K", ctr: "3.8%", status: "ACTIVE" },
      { name: "Jodhpur Weekend Family Feast", reach: "14.6K", ctr: "3.5%", status: "ACTIVE" }
    ],
    newsList: [
      { tag: "REGIONAL", title: "Jodhpur property surpasses Q2 admission target", time: "5h ago" },
      { tag: "MAINTENANCE", title: "Quarterly laser projector calibration completed", time: "2d ago" }
    ]
  },
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    shortLabel: 'Connplex Jaipur',
    fullName: 'CONNPLEX JAIPUR',
    city: 'Jaipur',
    state: 'Rajasthan',
    cinemaId: 'c2',
    totalScreens: 6,
    totalSeats: 720,
    partnerName: 'Amit Sharma',
    partnerRole: 'Jaipur Franchise Partner',
    partnerInitials: 'AS',
    screens: [
      { screen: 'Screen 1 (IMAX)', movie: 'Cosmic Drift', time: '3:00 PM - 5:45 PM', occupancy: 92, seatsBooked: 230, totalSeats: 250 },
      { screen: 'Screen 2', movie: 'Raftaar', time: '2:30 PM - 5:10 PM', occupancy: 80, seatsBooked: 120, totalSeats: 150 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '4:00 PM - 6:30 PM', occupancy: 74, seatsBooked: 89, totalSeats: 120 },
      { screen: 'Screen 5 (4DX)', movie: 'Shadow Protocol', time: '5:30 PM - 8:00 PM', occupancy: 86, seatsBooked: 86, totalSeats: 100 }
    ],
    metrics: [
      { label: "Today's Revenue", value: "₹5.20L", trend: "+7.8%", isUp: true, sparkline: [18, 22, 24, 28, 32, 36, 42] },
      { label: "Weekly Revenue", value: "₹34.8L", trend: "+5.9%", isUp: true, sparkline: [26, 28, 29, 31, 32, 33, 34.8] },
      { label: "Monthly Revenue", value: "₹1.42Cr", trend: "+4.2%", isUp: true, sparkline: [110, 115, 122, 128, 134, 138, 142] },
      { label: "ROI", value: "19.8%", trend: "+1.4pt", isUp: true, sparkline: [15, 16, 16.8, 17.5, 18.2, 19.0, 19.8] },
      { label: "Admissions", value: "3,120", trend: "+6.5%", isUp: true, sparkline: [2200, 2400, 2600, 2750, 2900, 3000, 3120] },
      { label: "Occupancy", value: "74%", trend: "+2.2%", isUp: true, sparkline: [66, 68, 70, 71, 72, 73, 74] },
      { label: "Avg Ticket Price", value: "₹250", trend: "+2.0%", isUp: true, sparkline: [235, 238, 240, 242, 245, 248, 250] },
      { label: "Spend Per Head", value: "₹145", trend: "+3.9%", isUp: true, sparkline: [130, 134, 136, 138, 140, 142, 145] },
      { label: "Online Bookings", value: "2,340", trend: "+11.8%", isUp: true, sparkline: [1600, 1750, 1900, 2050, 2150, 2250, 2340] },
      { label: "Counter Sales", value: "780", trend: "-1.5%", isUp: false, sparkline: [820, 810, 800, 795, 790, 785, 780] },
      { label: "Food Revenue", value: "₹2.05L", trend: "+8.1%", isUp: true, sparkline: [1.4, 1.5, 1.6, 1.75, 1.85, 1.95, 2.05] },
      { label: "Customer Rating", value: "4.7★", trend: "+0.1", isUp: true, sparkline: [4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7] }
    ],
    events: [
      { date: "21", month: "Sep", title: "Jaipur Pink City IMAX Premiere Night", type: "Release" },
      { date: "27", month: "Sep", title: "HVAC Central Chiller Plant Inspection", type: "Maintenance" }
    ],
    campaigns: [
      { name: "Pink City IMAX Experience", reach: "56.4K", ctr: "4.5%", status: "ACTIVE" }
    ],
    newsList: [
      { tag: "PREMIERE", title: "Jaipur IMAX auditorium records highest occupancy in North Zone", time: "1d ago" }
    ]
  },
  ahmedabad: {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    shortLabel: 'Connplex Ahmedabad',
    fullName: 'CONNPLEX AHMEDABAD',
    city: 'Ahmedabad',
    state: 'Gujarat',
    cinemaId: 'c3',
    totalScreens: 5,
    totalSeats: 680,
    partnerName: 'Bhavin Shah',
    partnerRole: 'Ahmedabad Franchise Partner',
    partnerInitials: 'BS',
    screens: [
      { screen: 'Screen 1', movie: 'Raftaar', time: '2:00 PM - 4:40 PM', occupancy: 84, seatsBooked: 168, totalSeats: 200 },
      { screen: 'Screen 2', movie: 'Cosmic Drift', time: '3:15 PM - 6:00 PM', occupancy: 68, seatsBooked: 109, totalSeats: 160 },
      { screen: 'Screen 3', movie: 'Ishq Junction', time: '5:00 PM - 7:30 PM', occupancy: 79, seatsBooked: 118, totalSeats: 150 }
    ],
    metrics: [
      { label: "Today's Revenue", value: "₹4.15L", trend: "+7.4%", isUp: true, sparkline: [14, 18, 22, 25, 28, 32, 38] },
      { label: "Weekly Revenue", value: "₹27.2L", trend: "+5.1%", isUp: true, sparkline: [21, 22, 23.5, 24.8, 25.6, 26.4, 27.2] },
      { label: "Monthly Revenue", value: "₹1.10Cr", trend: "+3.6%", isUp: true, sparkline: [88, 92, 96, 100, 104, 107, 110] },
      { label: "ROI", value: "18.1%", trend: "+1.1pt", isUp: true, sparkline: [13, 14, 14.8, 15.6, 16.5, 17.3, 18.1] },
      { label: "Admissions", value: "2,450", trend: "+6.0%", isUp: true, sparkline: [1700, 1850, 2000, 2150, 2250, 2350, 2450] },
      { label: "Occupancy", value: "70%", trend: "+1.5%", isUp: true, sparkline: [64, 65, 66, 68, 69, 69, 70] },
      { label: "Avg Ticket Price", value: "₹240", trend: "+1.7%", isUp: true, sparkline: [225, 228, 230, 232, 235, 238, 240] },
      { label: "Spend Per Head", value: "₹135", trend: "+3.5%", isUp: true, sparkline: [120, 124, 126, 128, 130, 132, 135] },
      { label: "Online Bookings", value: "1,820", trend: "+10.5%", isUp: true, sparkline: [1200, 1350, 1480, 1590, 1680, 1750, 1820] },
      { label: "Counter Sales", value: "630", trend: "-2.4%", isUp: false, sparkline: [680, 670, 660, 650, 645, 638, 630] },
      { label: "Food Revenue", value: "₹1.58L", trend: "+7.2%", isUp: true, sparkline: [1.1, 1.18, 1.25, 1.34, 1.42, 1.5, 1.58] },
      { label: "Customer Rating", value: "4.6★", trend: "+0.1", isUp: true, sparkline: [4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6] }
    ],
    events: [
      { date: "20", month: "Sep", title: "Ahmedabad Heritage Film Showcase", type: "Local event" },
      { date: "26", month: "Sep", title: "Concession Counter Express POS Upgrade", type: "Maintenance" }
    ],
    campaigns: [
      { name: "Amdavad Cine Privilege Card", reach: "42.0K", ctr: "4.0%", status: "ACTIVE" }
    ],
    newsList: [
      { tag: "REVENUE", title: "Ahmedabad branch achieves record F&B spend per head", time: "1d ago" }
    ]
  },
  udaipur: {
    id: 'udaipur',
    name: 'Udaipur',
    shortLabel: 'Connplex Udaipur',
    fullName: 'CONNPLEX UDAIPUR',
    city: 'Udaipur',
    state: 'Rajasthan',
    cinemaId: 'c4',
    totalScreens: 4,
    totalSeats: 460,
    partnerName: 'Manish Mehta',
    partnerRole: 'Udaipur Franchise Partner',
    partnerInitials: 'MM',
    screens: [
      { screen: 'Screen 1', movie: 'Raftaar', time: '2:45 PM - 5:25 PM', occupancy: 75, seatsBooked: 112, totalSeats: 150 },
      { screen: 'Screen 2', movie: 'Shadow Protocol', time: '4:15 PM - 6:45 PM', occupancy: 62, seatsBooked: 93, totalSeats: 150 }
    ],
    metrics: [
      { label: "Today's Revenue", value: "₹2.45L", trend: "+5.8%", isUp: true, sparkline: [10, 12, 14, 16, 18, 20, 24.5] },
      { label: "Weekly Revenue", value: "₹16.8L", trend: "+4.4%", isUp: true, sparkline: [13, 13.8, 14.5, 15.2, 15.8, 16.2, 16.8] },
      { label: "Monthly Revenue", value: "₹67.5L", trend: "+3.2%", isUp: true, sparkline: [55, 57, 60, 62, 64, 66, 67.5] },
      { label: "ROI", value: "16.8%", trend: "+0.8pt", isUp: true, sparkline: [13.5, 14.0, 14.6, 15.2, 15.8, 16.3, 16.8] },
      { label: "Admissions", value: "1,120", trend: "+4.9%", isUp: true, sparkline: [820, 880, 940, 990, 1040, 1080, 1120] },
      { label: "Occupancy", value: "65%", trend: "+1.2%", isUp: true, sparkline: [58, 60, 61, 62, 63, 64, 65] },
      { label: "Avg Ticket Price", value: "₹220", trend: "+1.4%", isUp: true, sparkline: [210, 212, 214, 216, 218, 219, 220] },
      { label: "Spend Per Head", value: "₹120", trend: "+3.0%", isUp: true, sparkline: [110, 112, 114, 116, 117, 119, 120] },
      { label: "Online Bookings", value: "780", trend: "+8.9%", isUp: true, sparkline: [550, 600, 650, 690, 730, 760, 780] },
      { label: "Counter Sales", value: "340", trend: "-1.9%", isUp: false, sparkline: [370, 365, 360, 355, 350, 345, 340] },
      { label: "Food Revenue", value: "₹94K", trend: "+5.9%", isUp: true, sparkline: [65, 70, 75, 80, 85, 90, 94] },
      { label: "Customer Rating", value: "4.6★", trend: "+0.1", isUp: true, sparkline: [4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6] }
    ],
    events: [
      { date: "22", month: "Sep", title: "Udaipur Lake City Film & Dine Night", type: "Promotion" }
    ],
    campaigns: [
      { name: "Lake City Royal Recliner Pass", reach: "22.0K", ctr: "3.6%", status: "ACTIVE" }
    ],
    newsList: [
      { tag: "PARTNERSHIP", title: "Udaipur boutique cinema ties up with local heritage resorts", time: "2d ago" }
    ]
  }
};

export default function FranchiseePortal() {
  const router = useRouter();
  // Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FranchiseeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form State
  const [loginInput, setLoginInput] = useState<string>(''); // Email or contact or username
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Interactive UI State
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState<boolean>(false);
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('ahilyanagar');
  const [toast, setToast] = useState<string | null>(null);
  const [apiDocsExpanded, setApiDocsExpanded] = useState<boolean>(false);
  const [todayFormatted, setTodayFormatted] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Check login state and url parameters on mount
  useEffect(() => {
    setTodayFormatted(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));

    const storedUser = getStoredFranchiseeUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
      if (storedUser.locationKey && LOCATIONS[storedUser.locationKey]) {
        setSelectedLocationKey(storedUser.locationKey);
      }
    } else {
      const session = localStorage.getItem('franchisee_session');
      if (session === 'authenticated') {
        setIsAuthenticated(true);
      }
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const loc = params.get('location') || params.get('cinema');
      if (loc) {
        if (loc.toLowerCase().includes('ahilya') || loc.toLowerCase() === 'c5') {
          setSelectedLocationKey('ahilyanagar');
        } else if (LOCATIONS[loc.toLowerCase()]) {
          setSelectedLocationKey(loc.toLowerCase());
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    setTimeout(() => {
      const authRes = verifyFranchiseeCredentials(loginInput, password);
      if (authRes.success && authRes.user) {
        setIsAuthenticated(true);
        setCurrentUser(authRes.user);
        storeFranchiseeSession(authRes.user);
        if (authRes.user.locationKey && LOCATIONS[authRes.user.locationKey]) {
          setSelectedLocationKey(authRes.user.locationKey);
        }
        showToast(`Successfully signed in! Welcome ${authRes.user.name} (${authRes.user.role}).`);
      } else {
        setLoginError(authRes.error || 'Invalid credentials. Check your email/contact number and password.');
      }
      setIsSubmitting(false);
    }, 600);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    clearFranchiseeSession();
    setLoginInput('');
    setPassword('');
    setProfileDropdownOpen(false);
    showToast('Signed out successfully.');
  };

  // Show Toast Feedback
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const currentLocation = LOCATIONS[selectedLocationKey] || LOCATIONS['ahilyanagar'];

  // Location-specific KPI Metrics data
  const metrics: Metric[] = currentLocation.metrics;

  // Screen Shows (Live Operations Snapshot based on current cinema)
  const shows: ScreenShow[] = currentLocation.screens;

  // Calendar Events
  const events: EventItem[] = currentLocation.events;

  // News Items
  const newsList: NewsItem[] = currentLocation.newsList;

  // Campaigns
  const campaigns: CampaignItem[] = currentLocation.campaigns;

  // Render mini Sparkline using SVG
  const renderSparkline = (points: number[], isUp: boolean) => {
    const width = 60;
    const height = 20;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    const coordinates = points.map((p, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="fra-sparkline-container" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={isUp ? 'var(--fra-green)' : 'var(--fra-red)'}
          strokeWidth="1.5"
          points={coordinates}
        />
      </svg>
    );
  };

  // Filter shows based on query
  const filteredShows = shows.filter(s => 
    s.movie.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.screen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Switch tabs
  const handleNavClick = (tab: string) => {
    const slugMap: Record<string, string> = {
      'Dashboard': 'dashboard',
      'Analytics': 'analytics',
      'Finance': 'finance',
      'Movies': 'movies',
      'Ticket Sales': 'ticket-sales',
      'Food & Beverage': 'fnb',
      'Staff': 'staff',
      'Operations': 'operations',
      'Marketing': 'marketing',
      'Reports': 'reports',
      'Documents': 'documents',
      'Support': 'support',
      'Settings': 'settings'
    };
    const slug = slugMap[tab] || '';
    if (typeof window !== 'undefined') {
      localStorage.setItem('franchisee_cinema', currentLocation.cinemaId);
      localStorage.setItem('franchisee_location', currentLocation.id);
    }
    router.push(`/conncloud/${slug}?cinema=${currentLocation.cinemaId}`);
  };

  // Quick action helper
  const handleActionClick = (actionName: string) => {
    if (actionName === 'Ahilyanagar Revenue' || actionName === 'Daily Revenue Dashboard' || actionName === 'Ahilyanagar Daily Revenue') {
      setSelectedLocationKey('ahilyanagar');
      showToast('Viewing Ahilyanagar Franchise Daily Revenue Dashboard.');
      setTimeout(() => {
        const el = document.getElementById('ahilyanagar-revenue-dashboard');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (actionName === 'Ahilyanagar API Sync' || actionName.includes('API Sync')) {
      setSelectedLocationKey('ahilyanagar');
      setApiDocsExpanded(true);
      showToast('Loaded Ahilyanagar Vista API Integration documentation.');
      setTimeout(() => {
        const el = document.getElementById('ahilyanagar-api-integration');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (actionName === 'Download Daily Report' || actionName === 'Download Monthly Report') {
      showToast(`Generating ${actionName} for ${currentLocation.name}...`);
      setTimeout(() => {
        showToast(`Downloaded ${actionName.replace('Download ', '')} for ${currentLocation.name}.`);
      }, 800);
      return;
    }
    if (actionName === 'View Live Screens') {
      router.push(`/conncloud/operations?cinema=${currentLocation.cinemaId}`);
      return;
    }
    if (actionName === 'Export Revenue') {
      router.push(`/conncloud/reports?cinema=${currentLocation.cinemaId}`);
      return;
    }
    if (actionName === 'Manage Staff') {
      router.push(`/conncloud/staff?cinema=${currentLocation.cinemaId}`);
      return;
    }
    if (actionName === 'Order Inventory') {
      router.push(`/conncloud/fnb?cinema=${currentLocation.cinemaId}`);
      return;
    }
    if (actionName === 'Create Maintenance Ticket') {
      router.push(`/conncloud/operations?cinema=${currentLocation.cinemaId}&action=ticket`);
      return;
    }
    showToast(`Triggered: ${actionName}`);
  };

  if (isLoading) {
    return (
      <div className="fra-signin-container">
        <div className="fra-signin-card" style={{ textAlign: 'center' }}>
          <div className="fra-signin-logo-wrap">
            <Image src="/logo.png" alt="Connplex Cinemas" width={160} height={44} priority style={{ height: 'auto' }} />
          </div>
          <div style={{ color: 'var(--fra-text-secondary)', margin: '2rem 0' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--fra-gold)', marginBottom: '1rem', display: 'block' }}></i>
            Initializing Conncloud secure portal...
          </div>
        </div>
      </div>
    );
  }

  // Render Sign-In Page
  if (!isAuthenticated) {
    return (
      <div className="fra-signin-container">
        <div className="fra-signin-card">
          <div className="fra-signin-logo-wrap">
            <Image src="/logo.png" alt="Connplex Cinemas" width={180} height={50} priority style={{ height: 'auto' }} />
          </div>
          <div className="fra-signin-title-wrap">
            <h1>Franchise Portal</h1>
            <p>Access your Conncloud Franchise Owner Dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div className="fra-signin-error">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            <div className="fra-signin-form-group">
              <label htmlFor="loginInput">EMAIL ADDRESS OR CONTACT NUMBER</label>
              <div className="fra-signin-input-wrapper">
                <input
                  id="loginInput"
                  type="text"
                  className="fra-signin-input"
                  placeholder="Enter Email or Contact Number"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />
                <i className="fa-solid fa-user"></i>
              </div>
            </div>

            <div className="fra-signin-form-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="fra-signin-input-wrapper">
                <input
                  id="password"
                  type="password"
                  className="fra-signin-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="fa-solid fa-lock"></i>
              </div>
            </div>

            <button type="submit" className="fra-signin-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  Sign In <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
              Quick Credentials
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setLoginInput('ahilyanagar');
                  setPassword('ahilyanagar');
                }}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📍 Ahilyanagar Partner
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginInput('guptajahnvi47@gmail.com');
                  setPassword('Jahnvi@04');
                }}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🏢 Corporate Admin
              </button>
            </div>
          </div>

          <p className="fra-signin-hint">
            Authorized franchise personnel only. Connection is encrypted.
          </p>
        </div>
      </div>
    );
  }

  // Render Franchisee Portal Dashboard
  return (
    <div className="fra-portal-layout">
      {/* Toast Alert */}
      {toast && (
        <div className="fra-toast">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="fra-sidebar">
        <div className="fra-sidebar-logo-container">
          <Image src="/logo.png" alt="Connplex" width={135} height={36} priority style={{ height: 'auto' }} />
          <span className="fra-sidebar-logo-sub">Conncloud Portal</span>
        </div>

        <div className="fra-sidebar-scroll">
          <div className="fra-sidebar-group">
            <span className="fra-sidebar-group-title">Overview</span>
            <ul className="fra-sidebar-nav-list">
              {[
                { name: 'Dashboard', icon: 'fa-table-columns' },
                { name: 'Analytics', icon: 'fa-chart-line' },
                { name: 'Finance', icon: 'fa-indian-rupee-sign' },
                { name: 'Movies', icon: 'fa-film' },
                { name: 'Ticket Sales', icon: 'fa-ticket' },
                { name: 'Food & Beverage', icon: 'fa-burger' },
                { name: 'Staff', icon: 'fa-user-tie' },
                { name: 'Operations', icon: 'fa-gears' },
                { name: 'Marketing', icon: 'fa-bullhorn' },
                { name: 'Reports', icon: 'fa-file-invoice-dollar' },
                { name: 'Documents', icon: 'fa-folder-open' },
                { name: 'Support', icon: 'fa-circle-question' },
                { name: 'Settings', icon: 'fa-sliders' }
              ].map((item) => (
                <li 
                  key={item.name} 
                  className={`fra-sidebar-nav-item ${activeTab === item.name ? 'active' : ''}`}
                >
                  <button onClick={() => handleNavClick(item.name)}>
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fra-sidebar-footer">
          <span className="fra-status-dot"></span>
          <span className="fra-sidebar-footer-text">All systems operational</span>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="fra-main-container">
        {/* Topbar */}
        <header className="fra-topbar">
          <div className="fra-search-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search movies, screens, reports..."
              className="fra-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="fra-topbar-actions">
            {/* Location Switcher */}
            <div className="relative" ref={locationDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="fra-btn fra-btn-outline"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <i className="fa-solid fa-location-dot" style={{ color: selectedLocationKey === 'ahilyanagar' ? '#f59e0b' : 'var(--fra-gold)' }}></i>
                <span>{currentLocation.name}</span>
                {currentLocation.hasApiIntegration && (
                  <span style={{ fontSize: '9px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                    API READY
                  </span>
                )}
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: 'var(--fra-text-muted)' }}></i>
              </button>

              {locationDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: '0.4rem',
                  minWidth: '240px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', padding: '6px 8px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    Switch Cinema Property
                  </div>
                  {Object.values(LOCATIONS).map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setSelectedLocationKey(loc.id);
                        setLocationDropdownOpen(false);
                        showToast(`Switched location to ${loc.name}`);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.75rem',
                        color: selectedLocationKey === loc.id ? '#ffffff' : '#9ca3af',
                        background: selectedLocationKey === loc.id ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-film" style={{ fontSize: '10px', color: selectedLocationKey === loc.id ? '#60a5fa' : '#6b7280' }}></i>
                        <span>{loc.shortLabel}</span>
                      </div>
                      {loc.hasApiIntegration && (
                        <span style={{ fontSize: '8px', background: '#f59e0b', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: '900' }}>
                          VISTA SYNC
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Launch ConnCloud Suite */}
            <Link
              href={`/conncloud/dashboard?cinema=${currentLocation.cinemaId}`}
              className="fra-btn fra-btn-outline"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>ConnCloud SaaS</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '9px' }}></i>
            </Link>

            <button className="fra-icon-btn" onClick={() => showToast('No new notifications')}>
              <i className="fa-solid fa-bell"></i>
              <span className="fra-badge">3</span>
            </button>

            <button className="fra-icon-btn" onClick={() => showToast('Inbox is empty')}>
              <i className="fa-solid fa-envelope"></i>
            </button>

            <div className="fra-topbar-divider"></div>

            <div className="fra-profile-dropdown-container" ref={dropdownRef}>
              <button 
                className="fra-profile-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="fra-avatar" style={{ background: (currentUser?.cinemaId === 'c5' || selectedLocationKey === 'ahilyanagar') ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined }}>
                  {currentUser?.initials || currentLocation.partnerInitials}
                </div>
                <div className="fra-profile-info">
                  <span className="fra-profile-name">
                    {currentUser?.name || currentLocation.partnerName}
                  </span>
                  <span className="fra-profile-role">
                    {currentUser?.role || currentLocation.partnerRole}
                  </span>
                </div>
                <i className={`fa-solid ${profileDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>

              {profileDropdownOpen && (
                <div className="fra-dropdown-menu">
                  <button className="fra-dropdown-item" onClick={() => handleActionClick('Profile settings')}>
                    <i className="fa-solid fa-user-circle"></i> Profile Settings
                  </button>
                  <button className="fra-dropdown-item" onClick={() => handleActionClick('Cinema settings')}>
                    <i className="fa-solid fa-building"></i> Cinema Details
                  </button>
                  <button className="fra-dropdown-item danger" onClick={handleLogout}>
                    <i className="fa-solid fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="fra-dashboard-content">
          
          {/* Welcome Banner */}
          <section className="fra-welcome-banner">
            <div className="fra-banner-left">
              <span className="fra-live-indicator">
                <span className="fra-live-dot"></span>
                LIVE — {currentLocation.fullName}
              </span>
              <h1>Welcome back, {currentUser?.name || currentLocation.partnerName}</h1>
              <p>Here&apos;s what&apos;s happening across your cinema today — {todayFormatted || 'Wednesday, Sep 16, 2026'}.</p>
            </div>
            
            <div className="fra-banner-actions">
              {selectedLocationKey === 'ahilyanagar' && (
                <>
                  <button 
                    className="fra-btn"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: 'bold' }}
                    onClick={() => {
                      const el = document.getElementById('ahilyanagar-revenue-dashboard');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <i className="fa-solid fa-chart-line mr-1"></i> Daily Revenue Dashboard
                  </button>
                  <button 
                    className="fra-btn fra-btn-outline"
                    onClick={() => {
                      setApiDocsExpanded(true);
                      setTimeout(() => {
                        const el = document.getElementById('ahilyanagar-api-integration');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    <i className="fa-solid fa-server mr-1"></i> Vista API Sync Docs
                  </button>
                </>
              )}
              <button className="fra-btn fra-btn-outline" onClick={() => handleActionClick('Export Revenue')}>
                <i className="fa-solid fa-download"></i> Export Revenue
              </button>
              <button className="fra-btn fra-btn-primary" onClick={() => handleActionClick('View Live Screens')}>
                View Live Screens
              </button>
            </div>
          </section>

          {/* Location Property Specs Chip Strip */}
          <div className="fra-location-specs-strip" style={{ marginBottom: '0.75rem' }}>
            <div className="fra-spec-chip">
              <i className="fa-solid fa-film"></i>
              <span>{currentLocation.totalScreens} Luxury Auditoriums</span>
            </div>
            <div className="fra-spec-chip">
              <i className="fa-solid fa-couch"></i>
              <span>{currentLocation.totalSeats} Total Premium Seats</span>
            </div>
            <div className="fra-spec-chip">
              <i className="fa-solid fa-location-dot"></i>
              <span>{currentLocation.city}, {currentLocation.state}</span>
            </div>
            {currentLocation.hasApiIntegration && (
              <div className="fra-spec-chip highlight">
                <i className="fa-solid fa-bolt"></i>
                <span>Vista POS Live Synchronized</span>
              </div>
            )}
            <div className="fra-spec-chip">
              <i className="fa-solid fa-user-tie"></i>
              <span>Partner: {currentLocation.partnerName}</span>
            </div>
          </div>

          {/* Quick Location Pills Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.5rem 0',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Cinema Property:
            </span>
            {Object.values(LOCATIONS).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  setSelectedLocationKey(loc.id);
                  showToast(`Viewing ${loc.name}`);
                }}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: selectedLocationKey === loc.id ? 'bold' : 'normal',
                  background: selectedLocationKey === loc.id 
                    ? (loc.id === 'ahilyanagar' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.3))' : 'rgba(37, 99, 235, 0.3)')
                    : '#131924',
                  color: selectedLocationKey === loc.id ? '#ffffff' : '#9ca3af',
                  border: selectedLocationKey === loc.id 
                    ? (loc.id === 'ahilyanagar' ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(37, 99, 235, 0.6)')
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                {loc.id === 'ahilyanagar' && <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i>}
                <span>{loc.name}</span>
                {loc.hasApiIntegration && (
                  <span style={{ fontSize: '8px', background: '#f59e0b', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: '900' }}>
                    API READY
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Metrics Grid */}
          <section className="fra-metrics-grid" style={{ marginBottom: '1.75rem' }}>
            {metrics.map((m, idx) => (
              <div key={idx} className="fra-metric-card">
                <div className="fra-metric-header">
                  <div className="fra-metric-title-wrap">
                    <span className={`fra-metric-dot ${m.isUp ? '' : 'red'}`}></span>
                    <span className="fra-metric-label">{m.label}</span>
                  </div>
                  {renderSparkline(m.sparkline, m.isUp)}
                </div>
                <div className="fra-metric-value">{m.value}</div>
                <div className={`fra-metric-trend ${m.isUp ? 'up' : 'down'}`}>
                  <i className={`fa-solid ${m.isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                  <span>{m.trend}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Ahilyanagar Franchise Daily Revenue Dashboard & Vista Integration */}
          {selectedLocationKey === 'ahilyanagar' && (
            <div style={{ marginBottom: '1.75rem' }} className="space-y-4">
              {/* Daily Revenue Dashboard (4 KPI cards, date presets, day-by-day table, CSV export, Schema specs) */}
              <AhilyanagarFranchiseDashboard 
                onNotification={showToast} 
                defaultExpanded={true} 
              />

              {/* Vista Raw POS ASMX API Integration & Sync Scripts Section */}
              <div style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1rem 1.25rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      <i className="fa-solid fa-server"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                        Vista POS ASMX Raw WebService &amp; Sync Architecture
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        Endpoint: <code>/api.asmx/GetDailyTicketAndFnbData</code> &bull; Cinema ID: CL16 (or CN01)
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setApiDocsExpanded(!apiDocsExpanded)}
                    style={{
                      background: apiDocsExpanded ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: apiDocsExpanded ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: apiDocsExpanded ? '#f59e0b' : '#e5e7eb',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <i className={`fa-solid ${apiDocsExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    <span>{apiDocsExpanded ? 'Hide Raw Integration Docs' : 'View Raw Vista API Docs & Sync Scripts'}</span>
                  </button>
                </div>

                {apiDocsExpanded && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                    <AhilyanagarApiIntegration 
                      key={`api-${apiDocsExpanded}`}
                      onNotification={showToast} 
                      defaultExpanded={true} 
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Middle Layout - snapshot & actions */}
          <div className="fra-mid-grid">
            
            {/* Live Snapshot */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">
                  Live Operations Snapshot
                </h2>
                <span className="fra-header-badge">{filteredShows.length} SHOWS ACTIVE</span>
              </div>

              <div className="fra-table-wrap">
                <table className="fra-table">
                  <thead>
                    <tr>
                      <th>Screen</th>
                      <th>Playing Now</th>
                      <th>Time Slot</th>
                      <th>Occupancy &amp; Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShows.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--fra-text-muted)', padding: '2rem' }}>
                          No matching active shows found.
                        </td>
                      </tr>
                    ) : (
                      filteredShows.map((s, idx) => (
                        <tr key={idx}>
                          <td className="fra-screen-name">{s.screen}</td>
                          <td className="fra-movie-title">{s.movie}</td>
                          <td className="fra-showtime">{s.time}</td>
                          <td>
                            <div className="fra-progress-container">
                              <div className="fra-progress-track">
                                <div 
                                  className="fra-progress-fill" 
                                  style={{ width: `${s.occupancy}%` }}
                                ></div>
                              </div>
                              <span className="fra-progress-percent">
                                {s.occupancy}%
                                {s.seatsBooked && s.totalSeats ? (
                                  <span style={{ fontSize: '10px', color: 'var(--fra-text-muted)', marginLeft: '4px' }}>
                                    ({s.seatsBooked}/{s.totalSeats})
                                  </span>
                                ) : null}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">Quick Actions</h2>
              </div>
              <div className="fra-actions-grid">
                {[
                  { label: "Ahilyanagar API Sync", icon: "fa-server" },
                  { label: "Download Daily Report", icon: "fa-download" },
                  { label: "Download Monthly Report", icon: "fa-file-arrow-down" },
                  { label: "Create Maintenance Ticket", icon: "fa-ticket" },
                  { label: "View Live Screens", icon: "fa-display" },
                  { label: "Export Revenue", icon: "fa-upload" },
                  { label: "Manage Staff", icon: "fa-users" },
                  { label: "Order Inventory", icon: "fa-boxes-stacked" }
                ].map((act, idx) => (
                  <button 
                    key={idx} 
                    className="fra-action-item"
                    onClick={() => handleActionClick(act.label)}
                  >
                    <div className="fra-action-icon">
                      <i className={`fa-solid ${act.icon}`}></i>
                    </div>
                    <span className="fra-action-label">{act.label}</span>
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Bottom layout - events, news, campaigns */}
          <div className="fra-bottom-grid">
            
            {/* Calendar & Events */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">Calendar &amp; Events</h2>
              </div>
              <div className="fra-list">
                {events.map((e, idx) => (
                  <div key={idx} className="fra-event-item">
                    <div className="fra-event-date-badge">
                      <span className="fra-event-month">{e.month}</span>
                      <span className="fra-event-day">{e.date}</span>
                    </div>
                    <div className="fra-event-details">
                      <span className="fra-event-title">{e.title}</span>
                      <span className="fra-event-type">{e.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* News & Announcements */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">News &amp; Announcements</h2>
              </div>
              <div className="fra-list">
                {newsList.map((n, idx) => (
                  <div key={idx} className="fra-news-item">
                    <div className="fra-news-meta">
                      <span className="fra-news-tag">{n.tag}</span>
                      <span className="fra-news-time">{n.time}</span>
                    </div>
                    <span className="fra-news-title" onClick={() => handleActionClick(n.title)}>
                      {n.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Marketing */}
            <section className="fra-section-card">
              <div className="fra-section-header">
                <h2 className="fra-section-title">Marketing</h2>
              </div>
              <div className="fra-list">
                {campaigns.map((c, idx) => (
                  <div key={idx} className="fra-marketing-campaign">
                    <div className="fra-campaign-info">
                      <span className="fra-campaign-name">{c.name}</span>
                      <span className="fra-campaign-metrics">
                        Reach {c.reach} - CTR {c.ctr}
                      </span>
                    </div>
                    <span className={`fra-campaign-badge ${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="fra-marketing-actions">
                <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center' }} onClick={() => handleActionClick('Poster Library')}>
                  Poster Library
                </button>
                <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center' }} onClick={() => handleActionClick('Social Toolkit')}>
                  Social Toolkit
                </button>
              </div>
            </section>

          </div>

          {/* Support Center section */}
          <section className="fra-support-section">
            <h2 className="fra-section-title" style={{ marginBottom: '1.25rem' }}>Support Center</h2>
            <div className="fra-support-grid">
              {[
                { title: "Raise Ticket", desc: "New request", icon: "fa-ticket" },
                { title: "Live Chat", desc: "Online now", icon: "fa-comments" },
                { title: "Knowledge Base", desc: "120 articles", icon: "fa-book-open" },
                { title: "Training Videos", desc: "18 modules", icon: "fa-video" },
                { title: "Emergency", desc: "Contacts", icon: "fa-phone-flip" }
              ].map((sup, idx) => (
                <div 
                  key={idx} 
                  className="fra-support-item"
                  onClick={() => handleActionClick(sup.title)}
                >
                  <div className="fra-support-icon">
                    <i className={`fa-solid ${sup.icon}`}></i>
                  </div>
                  <span className="fra-support-title">{sup.title}</span>
                  <span className="fra-support-desc">{sup.desc}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="fra-footer">
          <span className="fra-footer-text">Connplex Cinemas &copy; 2026</span>
        </footer>

      </main>
    </div>
  );
}
