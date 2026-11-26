'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './franchisee.css';
import AhilyanagarApiIntegration from '../../components/conncloud/AhilyanagarApiIntegration';
import AhilyanagarFranchiseDashboard from '../../components/conncloud/AhilyanagarFranchiseDashboard';
import ConnplexFranchiseRevenueDashboard from '../../components/franchisee/ConnplexFranchiseRevenueDashboard';
import DataExtractionMatrix from '../../components/conncloud/DataExtractionMatrix';
import GroupBookingView from '../../components/conncloud/views/GroupBookingView';
import MerchandiseView from '../../components/conncloud/views/MerchandiseView';
import StaffView from '../../components/conncloud/views/StaffView';
import TrainingView from '../../components/conncloud/views/TrainingView';
import OffersView from '../../components/conncloud/views/OffersView';
import MISView from '../../components/conncloud/views/MISView';
import DocumentsView from '../../components/conncloud/views/DocumentsView';
import LicenseView from '../../components/conncloud/views/LicenseView';
import NotificationsView from '../../components/conncloud/views/NotificationsView';
import CalendarView from '../../components/conncloud/views/CalendarView';
import {
  verifyFranchiseeCredentials,
  storeFranchiseeSession,
  getStoredFranchiseeUser,
  clearFranchiseeSession,
  FranchiseeUser,
  AHILYANAGAR_USER,
  DEFAULT_CORPORATE_USER
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
    shortLabel: 'Ahilyanagar (Flagship)',
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
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Resident Evil (Hindi)', time: '11:00 AM - 01:30 PM', occupancy: 85, seatsBooked: 17, totalSeats: 20 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Vibe (Hindi)', time: '02:30 PM - 05:10 PM', occupancy: 90, seatsBooked: 18, totalSeats: 20 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Mirzapur : The Movie (Hindi)', time: '06:00 PM - 08:45 PM', occupancy: 95, seatsBooked: 19, totalSeats: 20 },
      { screen: 'Screen 1 (Couple Recliner)', movie: 'Resident Evil (Hindi)', time: '09:15 PM - 11:45 PM', occupancy: 90, seatsBooked: 18, totalSeats: 20 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Daayra (Hindi)', time: '11:30 AM - 02:00 PM', occupancy: 78, seatsBooked: 47, totalSeats: 60 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Manjar (Marathi)', time: '03:00 PM - 05:35 PM', occupancy: 82, seatsBooked: 49, totalSeats: 60 },
      { screen: 'Screen 2 (Gold Class)', movie: 'The Paradise (Hindi)', time: '06:30 PM - 09:10 PM', occupancy: 88, seatsBooked: 53, totalSeats: 60 },
      { screen: 'Screen 2 (Gold Class)', movie: 'Avengers Endgame : Encore', time: '09:45 PM - 12:15 AM', occupancy: 75, seatsBooked: 45, totalSeats: 60 }
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
      { tag: "POS SYNC", title: "Connplex Ahilyanagar daily ticket & F&B sync active", time: "15m ago" },
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
  const [loginInput, setLoginInput] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
  const [showAllModulesModal, setShowAllModulesModal] = useState<boolean>(false);

  // Cinema Facility & Operations State
  const [auditoriumTemp, setAuditoriumTemp] = useState<number>(21);
  const [ambientLightsOn, setAmbientLightsOn] = useState<boolean>(true);
  const [curtainsClosed, setCurtainsClosed] = useState<boolean>(true);
  const [ambienceTheme, setAmbienceTheme] = useState<'ambient' | 'cinema'>('ambient');

  // Support Center Interactive Console State
  const [activeSupportTab, setActiveSupportTab] = useState<'tickets' | 'chat' | 'knowledge' | 'training' | 'emergency' | null>(null);
  const [supportTickets, setSupportTickets] = useState([
    { id: 'CPX-8821', subject: 'Cloud POS daily sales reconciliation & ASMX sync confirmation', category: 'Box Office & POS', priority: 'Medium', screen: 'All Screens', date: '2026-11-24', status: 'Resolved' },
    { id: 'CPX-8410', subject: 'Screen 1 Couple Recliner mechanical sensor recalibration', category: 'Hardware', priority: 'Low', screen: 'Screen 1', date: '2026-11-20', status: 'Resolved' }
  ]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Hardware / Projection');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketScreen, setTicketScreen] = useState('Screen 1 (Couple Recliner)');
  const [ticketDesc, setTicketDesc] = useState('');

  // Live Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: 'Hello Vikram! Connplex 24/7 Operations Desk is online for Ahilyanagar Flagship. How can we support your auditoriums today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Knowledge Base State
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [expandedSopId, setExpandedSopId] = useState<string | null>('sop-1');

  // Training Videos State
  const [activeTrainingModule, setActiveTrainingModule] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Normalize URL tab slug to actual tab name
  const normalizeTab = (raw: string | null): string | null => {
    if (!raw) return null;
    const lower = raw.trim().toLowerCase().replace(/[-_]/g, ' ');
    if (lower === 'dashboard' || lower === 'home') return 'Dashboard';
    if (lower === 'analytics' || lower === 'kpi' || lower === 'kpis') return 'Analytics';
    if (lower === 'finance' || lower === 'revenue' || lower === 'ledger') return 'Finance';
    if (lower === 'ticket sales' || lower === 'tickets' || lower === 'ticketing' || lower === 'box office') return 'Ticket Sales';
    if (lower === 'group booking' || lower === 'group bookings' || lower === 'groups') return 'Group Booking';
    if (lower === 'food & beverage' || lower === 'f&b' || lower === 'fnb' || lower === 'food' || lower === 'concessions') return 'Food & Beverage';
    if (lower === 'merchandise' || lower === 'store' || lower === 'merch') return 'Merchandise';
    if (lower === 'movies' || lower === 'shows' || lower === 'screening' || lower === 'schedule') return 'Movies';
    if (lower === 'operations' || lower === 'ops' || lower === 'telemetry') return 'Operations';
    if (lower === 'staff' || lower === 'employees' || lower === 'hr' || lower === 'roster') return 'Staff';
    if (lower === 'training' || lower === 'orientation' || lower === 'sops' || lower === 'sop') return 'Training';
    if (lower === 'marketing' || lower === 'promo' || lower === 'campaigns') return 'Marketing';
    if (lower === 'offers' || lower === 'my offers' || lower === 'promotions' || lower === 'discounts') return 'Offers';
    if (lower === 'reports' || lower === 'statements') return 'Reports';
    if (lower === 'mis' || lower === 'bi' || lower === 'intelligence') return 'MIS';
    if (lower === 'documents' || lower === 'docs' || lower === 'agreements' || lower === 'policies') return 'Documents';
    if (lower === 'license' || lower === 'licenses' || lower === 'compliance') return 'License';
    if (lower === 'notifications' || lower === 'alerts') return 'Notifications';
    if (lower === 'calendar' || lower === 'schedule' || lower === 'events') return 'Calendar';
    if (lower === 'data extract' || lower === 'extraction' || lower === 'matrix' || lower === 'data extraction matrix') return 'Data Extraction Matrix';
    if (lower === 'support' || lower === 'help' || lower === 'noc') return 'Support';
    if (lower === 'settings' || lower === 'config' || lower === 'property') return 'Settings';
    return null;
  };

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

      const initialTab = normalizeTab(params.get('tab'));
      if (initialTab) {
        setActiveTab(initialTab);
        if (initialTab === 'Support') {
          setActiveSupportTab('tickets');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Listen to browser Back/Forward popstate events for multi-page navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = normalizeTab(params.get('tab'));
      if (tabFromUrl) {
        setActiveTab(tabFromUrl);
        if (tabFromUrl === 'Support') {
          setActiveSupportTab(prev => prev || 'tickets');
        }
      } else {
        setActiveTab('Dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
        showToast(`Signed in successfully! Welcome ${authRes.user.name}.`);
      } else {
        setLoginError(authRes.error || 'Invalid credentials. Check your email or username and password.');
      }
      setIsSubmitting(false);
    }, 500);
  };

  // Quick Demo Credentials Autofill
  const fillCredentials = (type: 'ahilyanagar' | 'corporate') => {
    if (type === 'ahilyanagar') {
      setLoginInput('ahilyanagar');
      setPassword('ahilyanagar');
      showToast('Loaded Ahilyanagar Flagship Partner credentials.');
    } else {
      setLoginInput('guptajahnvi47@gmail.com');
      setPassword('Jahnvi@04');
      showToast('Loaded Corporate Master Admin credentials.');
    }
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
    }, 3200);
  };

  const currentLocation = LOCATIONS[selectedLocationKey] || LOCATIONS['ahilyanagar'];
  const metrics: Metric[] = currentLocation.metrics;
  const shows: ScreenShow[] = currentLocation.screens;
  const events: EventItem[] = currentLocation.events;
  const newsList: NewsItem[] = currentLocation.newsList;
  const campaigns: CampaignItem[] = currentLocation.campaigns;

  // Filter shows based on query
  const filteredShows = shows.filter(s => 
    s.movie.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.screen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modern Area Sparkline with gradient & endpoint marker
  const renderSparkline = (points: number[], isUp: boolean, cardIndex: number) => {
    const width = 75;
    const height = 28;
    const paddingY = 3;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const effectiveHeight = height - paddingY * 2;

    const coords = points.map((p, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = paddingY + effectiveHeight - ((p - min) / range) * effectiveHeight;
      return { x, y };
    });

    const polylinePoints = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
    const areaPath = `M 0,${height} L ` + coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' L ') + ` L ${width},${height} Z`;
    const lastCoord = coords[coords.length - 1];

    const strokeColor = isUp ? '#10b981' : '#ef4444';
    const gradientId = `spark-grad-${cardIndex}-${isUp ? 'up' : 'dn'}`;

    return (
      <svg className="fra-sparkline-container" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r="2.5"
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  // Metric Icon and Color Metadata
  const getMetricMeta = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("today's revenue")) return { icon: 'fa-indian-rupee-sign', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    if (l.includes('weekly revenue')) return { icon: 'fa-chart-line', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
    if (l.includes('monthly revenue')) return { icon: 'fa-building-columns', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
    if (l.includes('roi')) return { icon: 'fa-bullseye', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' };
    if (l.includes('admissions')) return { icon: 'fa-ticket', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' };
    if (l.includes('occupancy')) return { icon: 'fa-chart-pie', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' };
    if (l.includes('ticket price')) return { icon: 'fa-tag', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    if (l.includes('spend per head')) return { icon: 'fa-utensils', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
    if (l.includes('online bookings')) return { icon: 'fa-globe', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
    if (l.includes('counter sales')) return { icon: 'fa-cash-register', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
    if (l.includes('food revenue')) return { icon: 'fa-burger', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
    if (l.includes('rating')) return { icon: 'fa-star', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    return { icon: 'fa-chart-simple', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
  };

  // Event category color
  const getEventTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('corporate')) return { color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.18)' };
    if (t.includes('maintenance')) return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.18)' };
    if (t.includes('compliance')) return { color: '#34d399', bg: 'rgba(16, 185, 129, 0.18)' };
    if (t.includes('promotion') || t.includes('festival')) return { color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.18)' };
    if (t.includes('release') || t.includes('premiere')) return { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.18)' };
    return { color: '#cbd5e1', bg: 'rgba(255, 255, 255, 0.1)' };
  };

  // News category tag color
  const getNewsTagColor = (tag: string) => {
    const t = tag.toUpperCase();
    if (t.includes('VISTA') || t.includes('API')) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.18)' };
    if (t.includes('FINANCE') || t.includes('REVENUE')) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.18)' };
    if (t.includes('AUDIT') || t.includes('POLICY')) return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)' };
    if (t.includes('COMPLIANCE')) return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.18)' };
    if (t.includes('BOOKINGS') || t.includes('PREMIERE')) return { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.18)' };
    return { color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.18)' };
  };

  // Occupancy Gradient
  const getOccupancyGradient = (occ: number) => {
    if (occ >= 90) return 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)';
    if (occ >= 75) return 'linear-gradient(90deg, #3b82f6 0%, #f59e0b 100%)';
    return 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)';
  };

  // Switch tabs & update URL query parameter (Multi-Page Navigation)
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const tabSlug = tab.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
      url.searchParams.set('tab', tabSlug);
      window.history.pushState({}, '', url.toString());

      localStorage.setItem('franchisee_cinema', currentLocation.cinemaId);
      localStorage.setItem('franchisee_location', currentLocation.id);
      localStorage.setItem('cc_selected_cinema', currentLocation.cinemaId);
      const userToStore = currentUser || (currentLocation.cinemaId === 'c5' ? AHILYANAGAR_USER : DEFAULT_CORPORATE_USER);
      storeFranchiseeSession(userToStore);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      const win = document.getElementById('fra-window-top');
      if (win) win.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showToast(`Switched to ${tab} page`);
    if (tab === 'Support') {
      setActiveSupportTab(prev => prev || 'tickets');
    }
  };

  // Handle Support Ticket Submission
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    const newId = `CPX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      screen: ticketScreen,
      date: new Date().toISOString().split('T')[0],
      status: 'Under Review'
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    showToast(`Support Ticket #${newId} logged successfully! Duty engineer assigned.`);
    setTicketSubject('');
    setTicketDesc('');
  };

  // Handle Live Chat Messages
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      let reply = `Thank you Vikram. NOC Operations Desk has queued your inquiry regarding "${userText}". Our regional cinema systems engineer has been notified.`;
      const lower = userText.toLowerCase();
      if (lower.includes('pos') || lower.includes('sync')) {
        reply = `POS Sync Status for ${currentLocation.name}: WebService /api.asmx is active with 28ms latency. Daily ticket and concessions batches are synchronized.`;
      } else if (lower.includes('laser') || lower.includes('projector') || lower.includes('christie')) {
        reply = `Screen 1 & 2 Christie 4K Laser Telemetry: Lamp health 98% optimal, chiller setpoint 21°C normal, DCI KDM licenses verified.`;
      } else if (lower.includes('sound') || lower.includes('atmos')) {
        reply = `Dolby Atmos 7.1 Audio: Master cinema sound processors online. All 8 channels running within calibrated SPL norms.`;
      } else if (lower.includes('fnb') || lower.includes('food') || lower.includes('popcorn')) {
        reply = `Concessions Telemetry: F&B inventory stock verified for today's showtime demand.`;
      }
      setChatMessages(prev => [...prev, { sender: 'agent', text: reply, time: 'Just now' }]);
    }, 800);
  };

  // Quick action helper (Switches to relevant multi-page view)
  const handleActionClick = (actionName: string) => {
    if (actionName === 'Ahilyanagar Revenue' || actionName === 'Daily Revenue Dashboard' || actionName === 'Ahilyanagar Daily Revenue') {
      setSelectedLocationKey('ahilyanagar');
      handleNavClick('Finance');
      return;
    }
    if (actionName === 'Ahilyanagar API Sync' || actionName.includes('API Sync')) {
      setSelectedLocationKey('ahilyanagar');
      setApiDocsExpanded(true);
      handleNavClick('Finance');
      return;
    }
    if (actionName === 'Download Daily Report' || actionName === 'Download Monthly Report') {
      handleNavClick('Reports');
      showToast(`Generating ${actionName} for ${currentLocation.name}...`);
      setTimeout(() => {
        showToast(`Downloaded ${actionName.replace('Download ', '')} for ${currentLocation.name}.`);
      }, 700);
      return;
    }
    if (actionName === 'View Live Screens') {
      handleNavClick('Movies');
      return;
    }
    if (actionName === 'Export Revenue') {
      handleNavClick('Reports');
      showToast(`Revenue report exported successfully for ${currentLocation.name}.`);
      return;
    }
    if (actionName === 'Cinema Property Specs' || actionName === 'Manage Staff') {
      handleNavClick('Settings');
      return;
    }
    if (actionName === 'Order Inventory') {
      handleNavClick('Food & Beverage');
      return;
    }
    if (actionName === 'Create Maintenance Ticket') {
      handleNavClick('Support');
      setActiveSupportTab('tickets');
      setTicketCategory('Hardware / Projection');
      setTicketSubject('Auditorium Maintenance Request');
      return;
    }
    if (actionName === 'Raise Ticket') {
      handleNavClick('Support');
      setActiveSupportTab('tickets');
      return;
    }
    if (actionName === 'Live Chat') {
      handleNavClick('Support');
      setActiveSupportTab('chat');
      return;
    }
    if (actionName === 'Knowledge Base') {
      handleNavClick('Support');
      setActiveSupportTab('knowledge');
      return;
    }
    if (actionName === 'Training Videos') {
      handleNavClick('Support');
      setActiveSupportTab('training');
      return;
    }
    if (actionName === 'Emergency Line') {
      handleNavClick('Support');
      setActiveSupportTab('emergency');
      return;
    }
    if (actionName === 'Poster Library' || actionName === 'Social Toolkit') {
      handleNavClick('Marketing');
      showToast(`Opened ${actionName} toolkit`);
      return;
    }
    showToast(`Triggered: ${actionName}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="fra-signin-container">
        <div className="fra-signin-card" style={{ textAlign: 'center', padding: '3.5rem 2.5rem' }}>
          <div className="fra-signin-logo-wrap">
            <Image src="/logo.png" alt="Connplex Cinemas" width={180} height={48} priority style={{ height: 'auto' }} />
            <span className="fra-signin-badge">
              Connplex Franchise Portal
            </span>
          </div>
          <div style={{ color: 'var(--fra-text-secondary)', margin: '2rem 0' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1.8rem', color: '#f59e0b', marginBottom: '1rem', display: 'block' }}></i>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Loading cinema workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Sign-In Page (Frosted Glass Card over Cinema Hall Background)
  if (!isAuthenticated) {
    return (
      <div className="fra-signin-container">
        {toast && (
          <div className="fra-toast">
            <i className="fa-solid fa-circle-check"></i>
            <span>{toast}</span>
          </div>
        )}

        <div className="fra-signin-card">
          <div className="fra-signin-logo-wrap">
            <Image src="/logo.png" alt="Connplex Cinemas" width={190} height={52} priority style={{ height: 'auto' }} />
            <span className="fra-signin-badge">
              Franchise Partner Portal
            </span>
          </div>

          <div className="fra-signin-title-wrap">
            <h1>Cinema Partner Login</h1>
            <p>Access your Franchise Partner Operations Dashboard &amp; Live POS Sync</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div className="fra-signin-error">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            <div className="fra-signin-form-group">
              <label htmlFor="loginInput">
                <span>Email Address or Username</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Authorized Account</span>
              </label>
              <div className="fra-signin-input-wrapper">
                <input
                  id="loginInput"
                  type="text"
                  className="fra-signin-input"
                  placeholder="e.g. ahilyanagar or admin email"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />
                <i className="fa-solid fa-user"></i>
              </div>
            </div>

            <div className="fra-signin-form-group">
              <label htmlFor="password">
                <span>Password</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Encrypted</span>
              </label>
              <div className="fra-signin-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="fra-signin-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="fa-solid fa-lock"></i>
                <button
                  type="button"
                  className="fra-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="fra-signin-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  Sign In to Portal <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="fra-quick-creds-container">
            <div className="fra-quick-creds-title">
              <span>Demo Accounts</span>
              <span style={{ color: '#f59e0b' }}>Click to Autofill</span>
            </div>
            <div className="fra-quick-creds-grid">
              <button
                type="button"
                className="fra-quick-cred-btn"
                onClick={() => fillCredentials('ahilyanagar')}
              >
                <span className="fra-quick-cred-name">
                  <i className="fa-solid fa-location-dot" style={{ color: '#f59e0b' }}></i> Ahilyanagar Flagship
                </span>
                <span className="fra-quick-cred-role">Vikram Shinde &bull; Live POS Synced</span>
              </button>

              <button
                type="button"
                className="fra-quick-cred-btn"
                onClick={() => fillCredentials('corporate')}
              >
                <span className="fra-quick-cred-name">
                  <i className="fa-solid fa-building-shield" style={{ color: '#60a5fa' }}></i> Corporate Admin
                </span>
                <span className="fra-quick-cred-role">Rakesh Patel &bull; All 6 Cinemas</span>
              </button>
            </div>
          </div>

          <p className="fra-signin-hint">
            <i className="fa-solid fa-shield-check" style={{ color: '#10b981' }}></i>
            Connplex Cinemas Franchise Operations &bull; Authorized Access
          </p>
        </div>
      </div>
    );
  }

  // VisionOS Spatial Nav Items for Left Floating Capsule Dock (All 22 Modules)
  const dockNavItems = [
    { name: 'Dashboard', icon: 'fa-house', label: 'Dashboard' },
    { name: 'Analytics', icon: 'fa-chart-line', label: 'Analytics' },
    { name: 'Finance', icon: 'fa-indian-rupee-sign', label: 'Finance' },
    { name: 'Movies', icon: 'fa-film', label: 'Movies' },
    { name: 'Ticket Sales', icon: 'fa-ticket', label: 'Ticket Sales' },
    { name: 'Group Booking', icon: 'fa-users', label: 'Group Booking' },
    { name: 'Food & Beverage', icon: 'fa-burger', label: 'Food & Beverage' },
    { name: 'Merchandise', icon: 'fa-store', label: 'Merchandise' },
    { name: 'Operations', icon: 'fa-gears', label: 'Operations' },
    { name: 'Staff', icon: 'fa-user-tie', label: 'Staff' },
    { name: 'Training', icon: 'fa-graduation-cap', label: 'Training & SOPs' },
    { name: 'Marketing', icon: 'fa-bullhorn', label: 'Marketing' },
    { name: 'Offers', icon: 'fa-tags', label: 'My Offers' },
    { name: 'Reports', icon: 'fa-file-invoice-dollar', label: 'Reports' },
    { name: 'MIS', icon: 'fa-chart-pie', label: 'MIS' },
    { name: 'Documents', icon: 'fa-folder-open', label: 'Documents' },
    { name: 'License', icon: 'fa-certificate', label: 'License' },
    { name: 'Notifications', icon: 'fa-bell', label: 'Notifications' },
    { name: 'Calendar', icon: 'fa-calendar-days', label: 'Calendar' },
    { name: 'Data Extraction Matrix', icon: 'fa-database', label: 'Data Extraction' },
    { name: 'Support', icon: 'fa-circle-question', label: 'Support' },
    { name: 'Settings', icon: 'fa-sliders', label: 'Settings' }
  ];

  // Render VisionOS Spatial Franchisee Portal (Cinema Hall Background + Floating Glass Panels)
  return (
    <div className={`fra-portal-layout ${ambienceTheme === 'cinema' ? 'cinema-mode' : ''}`}>
      {/* Toast Alert Feedback */}
      {toast && (
        <div className="fra-toast">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* 1. Left Floating Capsule Navigation Dock (Exact Reference Match) */}
      <nav className="fra-floating-dock" aria-label="Quick Dock Navigation">
        {dockNavItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              type="button"
              className={`fra-dock-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.name)}
              aria-label={item.label}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span className="fra-dock-tooltip">{item.label}</span>
            </button>
          );
        })}
        <div className="fra-dock-divider"></div>
        <button
          type="button"
          className="fra-dock-btn"
          onClick={() => setShowAllModulesModal(true)}
          title="All 22 Cinema Modules"
          aria-label="All 22 Cinema Modules"
        >
          <i className="fa-solid fa-table-cells" style={{ fontSize: '0.88rem' }}></i>
          <span className="fra-dock-tooltip">All 22 Modules</span>
        </button>
      </nav>

      {/* Main Viewport Container */}
      <div className="fra-main-viewport">
        
        {/* 2. Top Floating Capsule Header (Exact Reference Match) */}
        <header className="fra-floating-header">
          {/* User Profile Pill */}
          <div 
            className="fra-header-user-pill" 
            ref={dropdownRef} 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="fra-header-avatar">
              {currentUser?.initials || currentLocation.partnerInitials}
            </div>
            <div className="fra-header-greeting">
              <span className="fra-header-name">
                Welcome, {currentUser?.name ? currentUser.name.split(' ')[0] : currentLocation.partnerName.split(' ')[0]}
              </span>
              <span className="fra-header-role">
                {currentUser?.role || currentLocation.partnerRole}
              </span>
            </div>
            <i className={`fa-solid ${profileDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: '9px', color: 'var(--fra-text-muted)' }}></i>

            {profileDropdownOpen && (
              <div className="fra-dropdown-menu" style={{ position: 'absolute', top: 'calc(100% + 12px)', left: 0 }}>
                <div style={{ padding: '0.4rem 0.6rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                    {currentUser?.name || currentLocation.partnerName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {currentLocation.fullName}
                  </div>
                </div>
                <button className="fra-dropdown-item" onClick={() => handleActionClick('Profile settings')}>
                  <i className="fa-solid fa-user-circle"></i> Profile Settings
                </button>
                <button className="fra-dropdown-item" onClick={() => handleActionClick('Cinema settings')}>
                  <i className="fa-solid fa-building"></i> Cinema Property Specs
                </button>
                <button className="fra-dropdown-item danger" onClick={handleLogout}>
                  <i className="fa-solid fa-sign-out-alt"></i> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Global Workspace Search */}
          <div className="fra-header-search-capsule">
            <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--fra-text-muted)', fontSize: '0.82rem' }}></i>
            <input
              type="text"
              placeholder="Search movies, auditoriums, box office reports..."
              className="fra-header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            ) : (
              <span className="fra-header-kbd">⌘K</span>
            )}

            {searchQuery.trim().length > 0 && (
              <div 
                className="fra-dropdown-menu" 
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 10px)', 
                  left: 0, 
                  right: 0, 
                  minWidth: '320px', 
                  maxHeight: '340px', 
                  overflowY: 'auto',
                  zIndex: 1000
                }}
              >
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', padding: '6px 10px', fontWeight: 800, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  Matching Modules &amp; Pages
                </div>
                {dockNavItems
                  .filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(item => (
                    <button
                      key={item.name}
                      type="button"
                      className="fra-dropdown-item"
                      onClick={() => {
                        handleNavClick(item.name);
                        setSearchQuery('');
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`} style={{ color: '#f59e0b', width: '18px' }}></i>
                      <span>{item.label}</span>
                    </button>
                  ))}
                {dockNavItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div style={{ padding: '0.75rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                    No matching modules found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="fra-header-right-actions">
            
            {/* Cinema Property Switcher Trigger */}
            <div className="relative" ref={locationDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="fra-header-pill-btn"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              >
                <i className="fa-solid fa-location-dot" style={{ color: '#f59e0b' }}></i>
                <span>{currentLocation.name}</span>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '8px', color: '#94a3b8' }}></i>
              </button>

              {locationDropdownOpen && (
                <div className="fra-dropdown-menu" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, minWidth: '240px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', padding: '6px 8px', fontWeight: 800, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    Switch Cinema Property
                  </div>
                  {Object.values(LOCATIONS).map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setSelectedLocationKey(loc.id);
                        setLocationDropdownOpen(false);
                        showToast(`Switched active cinema to ${loc.name}`);
                      }}
                      className="fra-dropdown-item"
                      style={{
                        background: selectedLocationKey === loc.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                        color: selectedLocationKey === loc.id ? '#ffffff' : '#cbd5e1'
                      }}
                    >
                      <i className="fa-solid fa-film" style={{ fontSize: '10px', color: selectedLocationKey === loc.id ? '#f59e0b' : '#64748b' }}></i>
                      <span>{loc.name} ({loc.totalScreens} Screens)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Ambience Lighting Mode Toggle Pill (Exact Reference Image [ ☀ Light | ☾ Dark ]) */}
            <div className="fra-header-theme-toggle" role="group" aria-label="Ambience Mode">
              <button
                type="button"
                className={`fra-theme-pill-btn ${ambienceTheme === 'ambient' ? 'active' : ''}`}
                onClick={() => {
                  setAmbienceTheme('ambient');
                  showToast('Ambience Mode: Warm Gold Cinema Lighting');
                }}
              >
                <i className="fa-solid fa-sun" style={{ color: ambienceTheme === 'ambient' ? '#f59e0b' : '#94a3b8' }}></i>
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`fra-theme-pill-btn ${ambienceTheme === 'cinema' ? 'active' : ''}`}
                onClick={() => {
                  setAmbienceTheme('cinema');
                  showToast('Cinema Mode: Dark Auditorium Showtime Lighting');
                }}
              >
                <i className="fa-solid fa-moon" style={{ color: ambienceTheme === 'cinema' ? '#60a5fa' : '#94a3b8' }}></i>
                <span>Dark</span>
              </button>
            </div>

            {/* Notification Bell */}
            <button 
              type="button" 
              className="fra-header-circle-btn" 
              onClick={() => showToast('3 system notifications pending.')}
              aria-label="Notifications"
            >
              <i className="fa-solid fa-bell"></i>
              <span className="fra-badge">3</span>
            </button>
          </div>
        </header>

        {/* 3. Center Floating VisionOS Glass Window (Multi-Page View Container) */}
        <main className="fra-floating-window" id="fra-window-top">
          
          {/* ================================================================
              VIEW 1: DASHBOARD (Executive Cockpit & Summary)
             ================================================================ */}
          {activeTab === 'Dashboard' && (
            <div className="fra-page-view-container">
              {/* Welcome Hero Banner Tile */}
              <section className="fra-welcome-banner">
                <div className="fra-banner-left">
                  <span className="fra-live-indicator">
                    <span className="fra-live-dot"></span>
                    <span>{currentLocation.name} &bull; Live Operations</span>
                  </span>
                  <h1>Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : currentLocation.partnerName.split(' ')[0]}</h1>
                  <p>
                    Performance overview and box office summary for {todayFormatted || 'Wednesday, Nov 25, 2026'}.
                  </p>
                </div>
                
                <div className="fra-banner-actions">
                  {selectedLocationKey === 'ahilyanagar' && (
                    <>
                      <button 
                        className="fra-btn fra-btn-primary"
                        onClick={() => handleNavClick('Finance')}
                      >
                        <i className="fa-solid fa-chart-line"></i> Daily Revenue Dashboard
                      </button>
                      <button 
                        className="fra-btn fra-btn-outline"
                        onClick={() => {
                          setApiDocsExpanded(true);
                          handleNavClick('Finance');
                        }}
                      >
                        <i className="fa-solid fa-server"></i> API Sync Docs
                      </button>
                    </>
                  )}
                  <button className="fra-btn fra-btn-outline" onClick={() => handleNavClick('Reports')}>
                    <i className="fa-solid fa-download"></i> Export Revenue
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => handleNavClick('Movies')}>
                    <i className="fa-solid fa-display"></i> View Live Screens
                  </button>
                </div>
              </section>

              {/* Executive Cinema Operations Cockpit (Authentic Cinema Multi-Screen & POS Telemetry) */}
              <section className="fra-smart-cockpit-grid" id="fra-cockpit-section">
                
                {/* Tile 1: Live Auditoriums & Screen Telemetry */}
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-film" style={{ color: '#f59e0b' }}></i>
                      <span>Live Auditoriums &amp; Screening Status</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {currentLocation.totalScreens} Screens Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {[
                      shows.find(s => s.screen.toLowerCase().includes('screen 1')) || shows[0],
                      shows.find(s => s.screen.toLowerCase().includes('screen 2')) || shows[1]
                    ].filter(Boolean).map((s, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.65rem 0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <i className="fa-solid fa-tv" style={{ fontSize: '11px', color: '#60a5fa' }}></i>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{s.screen}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                            <i className="fa-regular fa-clock" style={{ marginRight: '3px' }}></i> {s.time}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.movie}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '130px' }}>
                            <div className="fra-progress-track" style={{ flex: 1, height: '6px' }}>
                              <div 
                                className="fra-progress-fill" 
                                style={{ width: `${s.occupancy}%`, background: getOccupancyGradient(s.occupancy) }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap' }}>
                              {s.occupancy}%
                              {s.seatsBooked && s.totalSeats ? (
                                <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '3px', fontWeight: 500 }}>
                                  ({s.seatsBooked}/{s.totalSeats})
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Projection Core</span>
                      <strong style={{ color: '#34d399' }}>Christie 4K Laser</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>Sound Audio</span>
                      <strong style={{ color: '#38bdf8' }}>Dolby Atmos 7.1</strong>
                    </div>
                  </div>
                </div>

                {/* Tile 2: Box Office Realtime Velocity & POS Telemetry */}
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-chart-line" style={{ color: '#10b981' }}></i>
                      <span>Box Office &amp; POS Telemetry</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.16)', color: '#fbbf24', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      {currentLocation.hasApiIntegration ? 'Cloud POS Live' : 'Cloud POS'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Today&apos;s Revenue</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[0]?.value || '₹1.02L'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[0]?.trend || '+8.2%'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Admissions</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[4]?.value || '268'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[4]?.trend || '+7.2%'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Spend Per Head</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[7]?.value || '₹110'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[7]?.trend || '+4.2%'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Occupancy Avg</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[5]?.value || '84%'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[5]?.trend || '+3.5%'}
                      </div>
                    </div>
                  </div>

                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>POS Sync Latency</span>
                      <strong style={{ color: '#f59e0b' }}>28ms (ASMX Active)</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>DCP KDM License</span>
                      <strong style={{ color: '#34d399' }}>Active &bull; Validated</strong>
                    </div>
                  </div>
                </div>

                {/* Tile 3: Facility & Screening Environment Controls */}
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-sliders" style={{ color: '#38bdf8' }}></i>
                      <span>Facility &amp; Screening Controls</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.16)', color: '#38bdf8', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      Calibrated
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.7rem 0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <i className="fa-solid fa-lightbulb" style={{ color: ambientLightsOn ? '#f59e0b' : '#64748b', fontSize: '1rem' }}></i>
                        <div 
                          className="fra-smart-switch" 
                          style={{ background: ambientLightsOn ? '#10b981' : '#475569', transform: 'scale(0.8)', transformOrigin: 'right center' }}
                          onClick={() => {
                            setAmbientLightsOn(!ambientLightsOn);
                            showToast(`Auditorium Sconces ${!ambientLightsOn ? 'set to Soft Gold (Ambient)' : 'dimmed for Showtime'}`);
                          }}
                          title="Toggle Ambience Lighting"
                        >
                          <div className="fra-smart-switch-handle" style={{ right: ambientLightsOn ? '3px' : '23px' }}></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Auditorium Sconces</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{ambientLightsOn ? 'Soft Gold 35%' : 'Dimmed (0%)'}</div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.7rem 0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <i className="fa-solid fa-dungeon" style={{ color: curtainsClosed ? '#38bdf8' : '#64748b', fontSize: '1rem' }}></i>
                        <div 
                          className="fra-smart-switch" 
                          style={{ background: curtainsClosed ? '#10b981' : '#475569', transform: 'scale(0.8)', transformOrigin: 'right center' }}
                          onClick={() => {
                            setCurtainsClosed(!curtainsClosed);
                            showToast(`Screen Side Masking ${!curtainsClosed ? 'locked to Scope 2.39:1' : 'opened for Walk-in'}`);
                          }}
                          title="Toggle Screen Masking"
                        >
                          <div className="fra-smart-switch-handle" style={{ right: curtainsClosed ? '3px' : '23px' }}></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Scope Masking</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{curtainsClosed ? 'Scope 2.39:1 Locked' : 'Open / 16:9'}</div>
                    </div>
                  </div>

                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Auditorium VRV</span>
                      <strong style={{ color: '#38bdf8' }}>{auditoriumTemp}&deg;C Daikin Norm</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>Air Filtration</span>
                      <strong style={{ color: '#34d399' }}>HEPA 99.8% Active</strong>
                    </div>
                  </div>
                </div>

              </section>

              {/* Location Property Specs Strip */}
              <div className="fra-location-specs-strip" id="fra-specs-section">
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
                {currentLocation.hasApiIntegration ? (
                  <div className="fra-spec-chip highlight">
                    <i className="fa-solid fa-bolt"></i>
                    <span>Live POS Synchronized (ASMX)</span>
                  </div>
                ) : (
                  <div className="fra-spec-chip">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Enterprise Cloud POS Connected</span>
                  </div>
                )}
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-user-tie"></i>
                  <span>Partner: {currentLocation.partnerName}</span>
                </div>
              </div>

              {/* Middle Layout - Live Snapshot & Quick Actions */}
              <div className="fra-mid-grid">
                
                {/* Live Operations Snapshot */}
                <section className="fra-section-card" id="fra-operations-snapshot">
                  <div className="fra-section-header">
                    <h2 className="fra-section-title">
                      <i className="fa-solid fa-tower-broadcast" style={{ color: '#10b981' }}></i>
                      Live Operations Snapshot
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {searchQuery && (
                        <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                          Filtered by &quot;{searchQuery}&quot;
                        </span>
                      )}
                      <span className="fra-header-badge">{filteredShows.length} SHOWS ACTIVE</span>
                    </div>
                  </div>

                  <div className="fra-table-wrap">
                    <table className="fra-table">
                      <thead>
                        <tr>
                          <th>Auditorium</th>
                          <th>Playing Now</th>
                          <th>Time Slot</th>
                          <th>Occupancy &amp; Seats</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShows.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: 'var(--fra-text-muted)', padding: '2.5rem' }}>
                              <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                              No active shows matching &quot;{searchQuery}&quot;.
                            </td>
                          </tr>
                        ) : (
                          filteredShows.map((s, idx) => (
                            <tr key={idx}>
                              <td className="fra-screen-name">
                                <i className="fa-solid fa-tv" style={{ color: '#60a5fa', fontSize: '12px' }}></i>
                                <span>{s.screen}</span>
                              </td>
                              <td className="fra-movie-title">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  <span>{s.movie}</span>
                                </div>
                              </td>
                              <td className="fra-showtime">
                                <i className="fa-regular fa-clock" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                                <span>{s.time}</span>
                              </td>
                              <td>
                                <div className="fra-progress-container">
                                  <div className="fra-progress-track">
                                    <div 
                                      className="fra-progress-fill" 
                                      style={{ 
                                        width: `${s.occupancy}%`,
                                        background: getOccupancyGradient(s.occupancy)
                                      }}
                                    ></div>
                                  </div>
                                  <span className="fra-progress-percent">
                                    {s.occupancy}%
                                    {s.seatsBooked && s.totalSeats ? (
                                      <span style={{ fontSize: '10px', color: 'var(--fra-text-secondary)', marginLeft: '4px', fontWeight: 500 }}>
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

                {/* Quick Actions Shortcuts */}
                <section className="fra-section-card">
                  <div className="fra-section-header">
                    <h2 className="fra-section-title">
                      <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i>
                      Quick Actions
                    </h2>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>1-Click Navigation</span>
                  </div>
                  <div className="fra-actions-grid">
                    {[
                      { label: "Ahilyanagar API Sync", icon: "fa-server", color: "#f59e0b" },
                      { label: "Download Daily Report", icon: "fa-file-arrow-down", color: "#10b981" },
                      { label: "Download Monthly Report", icon: "fa-file-invoice-dollar", color: "#3b82f6" },
                      { label: "Create Maintenance Ticket", icon: "fa-wrench", color: "#ec4899" },
                      { label: "View Live Screens", icon: "fa-display", color: "#06b6d4" },
                      { label: "Export Revenue", icon: "fa-upload", color: "#f59e0b" },
                      { label: "Cinema Property Specs", icon: "fa-building", color: "#8b5cf6" },
                      { label: "Order Inventory", icon: "fa-boxes-stacked", color: "#f43f5e" }
                    ].map((act, idx) => (
                      <button 
                        key={idx} 
                        className="fra-action-item"
                        onClick={() => handleActionClick(act.label)}
                      >
                        <div className="fra-action-icon" style={{ color: act.color }}>
                          <i className={`fa-solid ${act.icon}`}></i>
                        </div>
                        <span className="fra-action-label">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

              </div>

              {/* Bottom Grid - Events, News, Marketing Preview */}
              <div className="fra-bottom-grid">
                
                {/* Calendar & Events */}
                <section className="fra-section-card">
                  <div className="fra-section-header">
                    <h2 className="fra-section-title">
                      <i className="fa-regular fa-calendar-check" style={{ color: '#f59e0b' }}></i>
                      Calendar &amp; Events
                    </h2>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Upcoming</span>
                  </div>
                  <div className="fra-list">
                    {events.map((e, idx) => {
                      const tagStyle = getEventTypeColor(e.type);
                      return (
                        <div key={idx} className="fra-event-item">
                          <div className="fra-event-date-badge">
                            <span className="fra-event-month">{e.month}</span>
                            <span className="fra-event-day">{e.date}</span>
                          </div>
                          <div className="fra-event-details">
                            <span className="fra-event-title">{e.title}</span>
                            <span 
                              className="fra-event-type" 
                              style={{ 
                                color: tagStyle.color, 
                                background: tagStyle.bg,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                display: 'inline-block',
                                alignSelf: 'flex-start'
                              }}
                            >
                              {e.type}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* News & Announcements */}
                <section className="fra-section-card">
                  <div className="fra-section-header">
                    <h2 className="fra-section-title">
                      <i className="fa-solid fa-newspaper" style={{ color: '#38bdf8' }}></i>
                      News &amp; Alerts
                    </h2>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Network Feed</span>
                  </div>
                  <div className="fra-list">
                    {newsList.map((n, idx) => {
                      const tagStyle = getNewsTagColor(n.tag);
                      return (
                        <div key={idx} className="fra-news-item">
                          <div className="fra-news-meta">
                            <span 
                              className="fra-news-tag"
                              style={{ color: tagStyle.color, background: tagStyle.bg }}
                            >
                              {n.tag}
                            </span>
                            <span className="fra-news-time">
                              <i className="fa-regular fa-clock mr-1" style={{ fontSize: '10px' }}></i> {n.time}
                            </span>
                          </div>
                          <span className="fra-news-title" onClick={() => handleActionClick(n.title)}>
                            {n.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Marketing & Promo Preview */}
                <section className="fra-section-card" id="fra-marketing-section">
                  <div className="fra-section-header">
                    <h2 className="fra-section-title">
                      <i className="fa-solid fa-bullhorn" style={{ color: '#ec4899' }}></i>
                      Marketing &amp; Promo
                    </h2>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Live Campaigns</span>
                  </div>
                  <div className="fra-list">
                    {campaigns.map((c, idx) => (
                      <div key={idx} className="fra-marketing-campaign">
                        <div className="fra-campaign-info">
                          <span className="fra-campaign-name">{c.name}</span>
                          <span className="fra-campaign-metrics">
                            Reach <strong>{c.reach}</strong> &bull; CTR <strong>{c.ctr}</strong>
                          </span>
                        </div>
                        <span className={`fra-campaign-badge ${c.status.toLowerCase()}`}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.status === 'ACTIVE' ? '#10b981' : '#f59e0b', display: 'inline-block', marginRight: '4px' }}></span>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="fra-marketing-actions">
                    <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center' }} onClick={() => handleNavClick('Marketing')}>
                      <i className="fa-regular fa-image mr-1"></i> Poster Library
                    </button>
                    <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center' }} onClick={() => handleNavClick('Marketing')}>
                      <i className="fa-solid fa-share-nodes mr-1"></i> Social Toolkit
                    </button>
                  </div>
                </section>

              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 2: ANALYTICS (KPI Metrics & Performance Deep-Dive)
             ================================================================ */}
          {activeTab === 'Analytics' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Analytics</span>
                    </div>
                    <h1 className="fra-view-title">Executive Analytics &amp; Box Office KPIs</h1>
                    <p className="fra-view-subtitle">Real-time admissions velocity, revenue breakdown, and seating occupancy metrics for {currentLocation.name}</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => handleNavClick('Finance')}>
                    <i className="fa-solid fa-receipt mr-1"></i> Revenue Ledgers
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => handleNavClick('Reports')}>
                    <i className="fa-solid fa-file-arrow-down mr-1"></i> Export Reports
                  </button>
                </div>
              </div>

              {/* 12 KPI Metrics Grid */}
              <section className="fra-metrics-grid" id="fra-analytics-section">
                {metrics.map((m, idx) => {
                  const meta = getMetricMeta(m.label);
                  return (
                    <div key={idx} className="fra-metric-card">
                      <div className="fra-metric-header">
                        <div className="fra-metric-title-wrap">
                          <div className="fra-metric-icon-box" style={{ color: meta.color, background: meta.bg }}>
                            <i className={`fa-solid ${meta.icon}`}></i>
                          </div>
                          <span className="fra-metric-label">{m.label}</span>
                        </div>
                        {renderSparkline(m.sparkline, m.isUp, idx)}
                      </div>
                      <div className="fra-metric-value">{m.value}</div>
                      <div className={`fra-metric-trend ${m.isUp ? 'up' : 'down'}`}>
                        <i className={`fa-solid ${m.isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                        <span>{m.trend} vs last period</span>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Deep Dive Performance Breakdown Cards */}
              <div className="fra-smart-cockpit-grid">
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-ticket" style={{ color: '#8b5cf6' }}></i>
                      <span>Ticketing Velocity &amp; Distribution</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(139, 92, 246, 0.16)', color: '#c084fc', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      {metrics[4]?.value || '268'} Admissions
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Online Bookings</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#60a5fa' }}>{metrics[8]?.value || '185'}</span>
                        <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>(69%)</span>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Box Office Counter</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>{metrics[9]?.value || '83'}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>(31%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Avg Ticket Price</span>
                      <strong style={{ color: '#f59e0b' }}>{metrics[6]?.value || '₹240'}</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>Spend Per Head</span>
                      <strong style={{ color: '#34d399' }}>{metrics[7]?.value || '₹110'}</strong>
                    </div>
                  </div>
                </div>

                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-chart-pie" style={{ color: '#06b6d4' }}></i>
                      <span>Auditorium Occupancy Ratio</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.16)', color: '#22d3ee', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      {metrics[5]?.value || '84%'} Avg Occupancy
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {shows.slice(0, 2).map((s, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.65rem 0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>{s.screen}</span>
                          <span style={{ color: '#34d399', fontWeight: 700 }}>{s.occupancy}%</span>
                        </div>
                        <div className="fra-progress-track" style={{ height: '6px' }}>
                          <div className="fra-progress-fill" style={{ width: `${s.occupancy}%`, background: getOccupancyGradient(s.occupancy) }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Capacity</span>
                      <strong style={{ color: '#38bdf8' }}>{currentLocation.totalSeats} Seats</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>Screens</span>
                      <strong style={{ color: '#34d399' }}>{currentLocation.totalScreens} Active</strong>
                    </div>
                  </div>
                </div>

                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-burger" style={{ color: '#f59e0b' }}></i>
                      <span>Concessions &amp; F&amp;B Contribution</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.16)', color: '#fbbf24', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      {metrics[10]?.value || '₹29.5K'} F&amp;B
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>F&amp;B Attachment Rate</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>62%</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Avg F&amp;B Order</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>₹185</span>
                    </div>
                  </div>
                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Customer Rating</span>
                      <strong style={{ color: '#f59e0b' }}>{metrics[11]?.value || '4.8★'}</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>FSSAI Status</span>
                      <strong style={{ color: '#34d399' }}>Grade A+ Verified</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 3: FINANCE (Multi-Tenant Revenue Dashboards & API Sync)
             ================================================================ */}
          {activeTab === 'Finance' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Finance</span>
                    </div>
                    <h1 className="fra-view-title">Financial Revenue Ledgers &amp; Settlements</h1>
                    <p className="fra-view-subtitle">Multi-tenant POS settlement engine, daily box office collection (DCR), and net distributor shares</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => handleNavClick('Reports')}>
                    <i className="fa-solid fa-download mr-1"></i> Export Ledger CSV
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => showToast('POS financial records synchronized.')}>
                    <i className="fa-solid fa-rotate mr-1"></i> Re-Sync POS
                  </button>
                </div>
              </div>

              {/* Multi-Tenant Connplex Franchise Revenue Dashboard */}
              <div className="space-y-4" id="fra-finance-section">
                <ConnplexFranchiseRevenueDashboard
                  currentLocationKey={selectedLocationKey}
                  userRole={currentUser?.role || 'partner'}
                  onNotification={showToast}
                />
              </div>

              {/* Ahilyanagar Specialized Views & Raw API Console */}
              {selectedLocationKey === 'ahilyanagar' && (
                <div className="space-y-4">
                  <AhilyanagarFranchiseDashboard 
                    onNotification={showToast} 
                    defaultExpanded={true} 
                  />

                  <div style={{
                    background: 'rgba(22, 30, 48, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--fra-glass-border)',
                    borderRadius: '24px',
                    padding: '1.25rem 1.65rem',
                    boxShadow: 'var(--fra-glass-shadow-sm)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'rgba(245, 158, 11, 0.18)',
                          color: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)'
                        }}>
                          <i className="fa-solid fa-server"></i>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                            Live POS ASMX Raw WebService &amp; Sync Architecture
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Endpoint: <code>/api.asmx/GetDailyTicketAndFnbData</code> &bull; Cinema ID: <code>CL16</code> (or <code>CN01</code>)
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setApiDocsExpanded(!apiDocsExpanded)}
                        style={{
                          background: apiDocsExpanded ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                          border: apiDocsExpanded ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                          color: apiDocsExpanded ? '#f59e0b' : '#e2e8f0',
                          padding: '8px 18px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <i className={`fa-solid ${apiDocsExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        <span>{apiDocsExpanded ? 'Hide Raw Integration Docs' : 'View Raw API Docs & Sync Scripts'}</span>
                      </button>
                    </div>

                    {apiDocsExpanded && (
                      <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
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
            </div>
          )}

          {/* ================================================================
              VIEW 4: TICKET SALES (Live Box Office & Admissions Velocity)
             ================================================================ */}
          {activeTab === 'Ticket Sales' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Ticket Sales</span>
                    </div>
                    <h1 className="fra-view-title">Live Ticket Sales &amp; Box Office Counter</h1>
                    <p className="fra-view-subtitle">Real-time ticketing velocity, seating distribution, and box office counter transactions</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => handleNavClick('Movies')}>
                    <i className="fa-solid fa-film mr-1"></i> Screen Schedules
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => handleNavClick('Reports')}>
                    <i className="fa-solid fa-file-arrow-down mr-1"></i> Download Manifest
                  </button>
                </div>
              </div>

              {/* Ticketing Velocity Stats Strip */}
              <div className="fra-location-specs-strip">
                <div className="fra-spec-chip highlight">
                  <i className="fa-solid fa-ticket"></i>
                  <span>Admissions: <strong>{metrics[4]?.value || '268'} Patrons</strong></span>
                </div>
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-tag"></i>
                  <span>Avg Ticket Price: <strong>{metrics[6]?.value || '₹240'}</strong></span>
                </div>
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-globe"></i>
                  <span>Online Bookings: <strong>{metrics[8]?.value || '185'} (69%)</strong></span>
                </div>
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-cash-register"></i>
                  <span>Counter Sales: <strong>{metrics[9]?.value || '83'} (31%)</strong></span>
                </div>
              </div>

              {/* Live Operations Snapshot Table */}
              <section className="fra-section-card" id="fra-operations-snapshot">
                <div className="fra-section-header">
                  <h2 className="fra-section-title">
                    <i className="fa-solid fa-tower-broadcast" style={{ color: '#10b981' }}></i>
                    Live Operations Snapshot
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {searchQuery && (
                      <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                        Filtered by &quot;{searchQuery}&quot;
                      </span>
                    )}
                    <span className="fra-header-badge">{filteredShows.length} SHOWS ACTIVE</span>
                  </div>
                </div>

                <div className="fra-table-wrap">
                  <table className="fra-table">
                    <thead>
                      <tr>
                        <th>Auditorium</th>
                        <th>Playing Now</th>
                        <th>Time Slot</th>
                        <th>Occupancy &amp; Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShows.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', color: 'var(--fra-text-muted)', padding: '2.5rem' }}>
                            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                            No active shows matching &quot;{searchQuery}&quot;.
                          </td>
                        </tr>
                      ) : (
                        filteredShows.map((s, idx) => (
                          <tr key={idx}>
                            <td className="fra-screen-name">
                              <i className="fa-solid fa-tv" style={{ color: '#60a5fa', fontSize: '12px' }}></i>
                              <span>{s.screen}</span>
                            </td>
                            <td className="fra-movie-title">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span>{s.movie}</span>
                              </div>
                            </td>
                            <td className="fra-showtime">
                              <i className="fa-regular fa-clock" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                              <span>{s.time}</span>
                            </td>
                            <td>
                              <div className="fra-progress-container">
                                <div className="fra-progress-track">
                                  <div 
                                    className="fra-progress-fill" 
                                    style={{ 
                                      width: `${s.occupancy}%`,
                                      background: getOccupancyGradient(s.occupancy)
                                    }}
                                  ></div>
                                </div>
                                <span className="fra-progress-percent">
                                  {s.occupancy}%
                                  {s.seatsBooked && s.totalSeats ? (
                                    <span style={{ fontSize: '10px', color: 'var(--fra-text-secondary)', marginLeft: '4px', fontWeight: 500 }}>
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
            </div>
          )}

          {/* ================================================================
              VIEW 5: FOOD & BEVERAGE (Concessions, SPH & Inventory)
             ================================================================ */}
          {activeTab === 'Food & Beverage' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-burger"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Food &amp; Beverage</span>
                    </div>
                    <h1 className="fra-view-title">Concessions &amp; Food &amp; Beverage (F&amp;B) Analytics</h1>
                    <p className="fra-view-subtitle">Lounge concessions, spend per head (SPH) optimization, and FSSAI inventory tracking</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => {
                    showToast('Concessions restock order sent to central commissary.');
                  }}>
                    <i className="fa-solid fa-boxes-stacked mr-1"></i> Order Inventory
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => handleNavClick('Reports')}>
                    <i className="fa-solid fa-file-invoice mr-1"></i> F&amp;B Tax Ledger
                  </button>
                </div>
              </div>

              {/* Concessions Metrics Strip */}
              <div className="fra-location-specs-strip">
                <div className="fra-spec-chip highlight">
                  <i className="fa-solid fa-burger"></i>
                  <span>Food Revenue: <strong>{metrics[10]?.value || '₹29.5K'}</strong></span>
                </div>
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-utensils"></i>
                  <span>Spend Per Head: <strong>{metrics[7]?.value || '₹110'}</strong></span>
                </div>
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>F&amp;B Conversion: <strong>62% Attached</strong></span>
                </div>
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-receipt"></i>
                  <span>Avg Ticket + F&amp;B: <strong>₹350 Combined</strong></span>
                </div>
              </div>

              {/* Concessions Menu Items Grid */}
              <div className="fra-section-card">
                <div className="fra-section-header">
                  <h2 className="fra-section-title">
                    <i className="fa-solid fa-cookie-bite" style={{ color: '#f59e0b' }}></i>
                    Concessions Lounge &amp; Food Service Items
                  </h2>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Live Commissary Inventory</span>
                </div>

                <div className="fra-fnb-menu-grid">
                  {[
                    { name: "Cretors Gold Caramel Popcorn", cat: "Snacks", price: "₹210", sales: "142 tubs", margin: "84%", stock: "Optimal" },
                    { name: "Peri Peri Cheese Nachos", cat: "Warm Bites", price: "₹240", sales: "98 trays", margin: "78%", stock: "Optimal" },
                    { name: "Artisan Cold Brew Coffee", cat: "Beverages", price: "₹180", sales: "64 cups", margin: "82%", stock: "Refill Soon" },
                    { name: "Gourmet Slider Box (Veg/Non)", cat: "Lounge Meal", price: "₹320", sales: "45 orders", margin: "71%", stock: "Optimal" },
                    { name: "Choco-Lava Tub Ice Cream", cat: "Dessert", price: "₹160", sales: "82 tubs", margin: "75%", stock: "Optimal" }
                  ].map((item, idx) => (
                    <div key={idx} className="fra-fnb-menu-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>{item.cat}</span>
                        <span style={{ fontSize: '10px', background: item.stock === 'Optimal' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(245, 158, 11, 0.16)', color: item.stock === 'Optimal' ? '#34d399' : '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.stock}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{item.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>{item.price}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.sales} sold &bull; {item.margin} margin</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FSSAI Food Hygiene & SOP Card */}
              <div className="fra-smart-tile">
                <div className="fra-smart-tile-header">
                  <div className="fra-smart-tile-title">
                    <i className="fa-solid fa-shield-halved" style={{ color: '#10b981' }}></i>
                    <span>FSSAI Hygiene &amp; Concessions Quality Assurance</span>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                    Grade A+ Verified
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Cretors Kettle Sanitization</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>Daily Heat’n Kleen Done</div>
                    <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Signed off by duty manager</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Chiller Temperature</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>3.8°C (Norm 2°C - 5°C)</div>
                    <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Beverage &amp; Dairy chilling compliant</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Inventory FIFO Control</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>Zero Batch Expiries</div>
                    <div style={{ fontSize: '10px', color: '#cbd5e1' }}>First-In First-Out rotation audited</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 6: MOVIES (Cinema Programming & Show Schedules)
             ================================================================ */}
          {activeTab === 'Movies' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-film"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Movies</span>
                    </div>
                    <h1 className="fra-view-title">Cinema Programming &amp; Screen Show Schedules</h1>
                    <p className="fra-view-subtitle">Auditorium scheduling, Christie 4K laser projection specs, and DCI KDM license status</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => handleNavClick('Operations')}>
                    <i className="fa-solid fa-sliders mr-1"></i> Screening Controls
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => showToast('DCI KDM license key ingested and verified for Screen 1 & 2.')}>
                    <i className="fa-solid fa-key mr-1"></i> Ingest KDM
                  </button>
                </div>
              </div>

              {/* Screen Showcase Cards */}
              <div className="fra-screens-showcase-grid">
                {shows.map((s, idx) => (
                  <div key={idx} className="fra-smart-tile" style={{ margin: 0 }}>
                    <div className="fra-smart-tile-header">
                      <div className="fra-smart-tile-title">
                        <i className="fa-solid fa-display" style={{ color: '#60a5fa' }}></i>
                        <span>{s.screen}</span>
                      </div>
                      <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                        Live Showtime
                      </span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '14px', padding: '1rem' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>{s.movie}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '11px', color: '#94a3b8', marginBottom: '0.85rem' }}>
                        <span><i className="fa-regular fa-clock mr-1"></i> {s.time}</span>
                        <span>&bull;</span>
                        <span>Christie 4K Laser</span>
                        <span>&bull;</span>
                        <span>Dolby Atmos 7.1</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>Auditorium Occupancy</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34d399' }}>
                          {s.occupancy}% {s.seatsBooked && s.totalSeats ? `(${s.seatsBooked}/${s.totalSeats} seats)` : ''}
                        </span>
                      </div>
                      <div className="fra-progress-track" style={{ height: '8px' }}>
                        <div className="fra-progress-fill" style={{ width: `${s.occupancy}%`, background: getOccupancyGradient(s.occupancy) }}></div>
                      </div>
                    </div>

                    <div className="fra-smart-tile-meta-grid">
                      <div className="fra-smart-tile-meta-item">
                        <span>Aspect Ratio</span>
                        <strong style={{ color: '#f59e0b' }}>{idx === 0 ? 'Scope 2.39:1' : 'Flat 1.85:1'}</strong>
                      </div>
                      <div className="fra-smart-tile-meta-item">
                        <span>DCI KDM License</span>
                        <strong style={{ color: '#34d399' }}>Active &bull; Validated</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Operations Snapshot Table */}
              <section className="fra-section-card" id="fra-operations-snapshot">
                <div className="fra-section-header">
                  <h2 className="fra-section-title">
                    <i className="fa-solid fa-list-check" style={{ color: '#10b981' }}></i>
                    All Active Screenings &amp; Time Slots
                  </h2>
                  <span className="fra-header-badge">{filteredShows.length} SHOWS ACTIVE</span>
                </div>

                <div className="fra-table-wrap">
                  <table className="fra-table">
                    <thead>
                      <tr>
                        <th>Auditorium</th>
                        <th>Playing Now</th>
                        <th>Time Slot</th>
                        <th>Occupancy &amp; Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShows.map((s, idx) => (
                        <tr key={idx}>
                          <td className="fra-screen-name">
                            <i className="fa-solid fa-tv" style={{ color: '#60a5fa', fontSize: '12px' }}></i>
                            <span>{s.screen}</span>
                          </td>
                          <td className="fra-movie-title">
                            <span>{s.movie}</span>
                          </td>
                          <td className="fra-showtime">
                            <i className="fa-regular fa-clock" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                            <span>{s.time}</span>
                          </td>
                          <td>
                            <div className="fra-progress-container">
                              <div className="fra-progress-track">
                                <div className="fra-progress-fill" style={{ width: `${s.occupancy}%`, background: getOccupancyGradient(s.occupancy) }}></div>
                              </div>
                              <span className="fra-progress-percent">
                                {s.occupancy}%
                                {s.seatsBooked && s.totalSeats ? (
                                  <span style={{ fontSize: '10px', color: 'var(--fra-text-secondary)', marginLeft: '4px', fontWeight: 500 }}>
                                    ({s.seatsBooked}/{s.totalSeats})
                                  </span>
                                ) : null}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ================================================================
              VIEW 7: OPERATIONS (Facility Controls & Screening Systems)
             ================================================================ */}
          {activeTab === 'Operations' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-gears"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Operations</span>
                    </div>
                    <h1 className="fra-view-title">Auditorium Telemetry &amp; Facility Control Systems</h1>
                    <p className="fra-view-subtitle">Live IoT cinema environmental controls, Christie projector diagnostics, and Daikin VRV HVAC</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => {
                    handleNavClick('Support');
                    setActiveSupportTab('tickets');
                    setTicketCategory('Hardware / Projection');
                    setTicketSubject('Auditorium Telemetry Check');
                  }}>
                    <i className="fa-solid fa-wrench mr-1"></i> Log Maintenance Ticket
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => showToast('Dolby Atmos pink noise sound sweep executed. All channels normal.')}>
                    <i className="fa-solid fa-volume-high mr-1"></i> Calibrate Audio
                  </button>
                </div>
              </div>

              {/* Cockpit Section (Tile 1, Tile 2, Tile 3) */}
              <section className="fra-smart-cockpit-grid" id="fra-cockpit-section">
                {/* Live Auditoriums & Screening Status */}
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-film" style={{ color: '#f59e0b' }}></i>
                      <span>Live Auditoriums &amp; Screening Status</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {currentLocation.totalScreens} Screens Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {[
                      shows.find(s => s.screen.toLowerCase().includes('screen 1')) || shows[0],
                      shows.find(s => s.screen.toLowerCase().includes('screen 2')) || shows[1]
                    ].filter(Boolean).map((s, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.65rem 0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <i className="fa-solid fa-tv" style={{ fontSize: '11px', color: '#60a5fa' }}></i>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{s.screen}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                            <i className="fa-regular fa-clock" style={{ marginRight: '3px' }}></i> {s.time}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.movie}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '130px' }}>
                            <div className="fra-progress-track" style={{ flex: 1, height: '6px' }}>
                              <div 
                                className="fra-progress-fill" 
                                style={{ width: `${s.occupancy}%`, background: getOccupancyGradient(s.occupancy) }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap' }}>
                              {s.occupancy}%
                              {s.seatsBooked && s.totalSeats ? (
                                <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '3px', fontWeight: 500 }}>
                                  ({s.seatsBooked}/{s.totalSeats})
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Projection Core</span>
                      <strong style={{ color: '#34d399' }}>Christie 4K Laser</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>Sound Audio</span>
                      <strong style={{ color: '#38bdf8' }}>Dolby Atmos 7.1</strong>
                    </div>
                  </div>
                </div>

                {/* Box Office Realtime Velocity & POS Telemetry */}
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-chart-line" style={{ color: '#10b981' }}></i>
                      <span>Box Office &amp; POS Telemetry</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.16)', color: '#fbbf24', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      {currentLocation.hasApiIntegration ? 'Cloud POS Live' : 'Cloud POS'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Today&apos;s Revenue</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[0]?.value || '₹1.02L'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[0]?.trend || '+8.2%'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Admissions</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[4]?.value || '268'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[4]?.trend || '+7.2%'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Spend Per Head</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[7]?.value || '₹110'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[7]?.trend || '+4.2%'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.65rem 0.8rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Occupancy Avg</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>{metrics[5]?.value || '84%'}</div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> {metrics[5]?.trend || '+3.5%'}
                      </div>
                    </div>
                  </div>

                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>POS Sync Latency</span>
                      <strong style={{ color: '#f59e0b' }}>28ms (ASMX Active)</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>DCP KDM License</span>
                      <strong style={{ color: '#34d399' }}>Active &bull; Validated</strong>
                    </div>
                  </div>
                </div>

                {/* Facility & Screening Environment Controls */}
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-sliders" style={{ color: '#38bdf8' }}></i>
                      <span>Facility &amp; Screening Controls</span>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.16)', color: '#38bdf8', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      Calibrated
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.7rem 0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <i className="fa-solid fa-lightbulb" style={{ color: ambientLightsOn ? '#f59e0b' : '#64748b', fontSize: '1rem' }}></i>
                        <div 
                          className="fra-smart-switch" 
                          style={{ background: ambientLightsOn ? '#10b981' : '#475569', transform: 'scale(0.8)', transformOrigin: 'right center' }}
                          onClick={() => {
                            setAmbientLightsOn(!ambientLightsOn);
                            showToast(`Auditorium Sconces ${!ambientLightsOn ? 'set to Soft Gold (Ambient)' : 'dimmed for Showtime'}`);
                          }}
                          title="Toggle Ambience Lighting"
                        >
                          <div className="fra-smart-switch-handle" style={{ right: ambientLightsOn ? '3px' : '23px' }}></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Auditorium Sconces</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{ambientLightsOn ? 'Soft Gold 35%' : 'Dimmed (0%)'}</div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.7rem 0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <i className="fa-solid fa-dungeon" style={{ color: curtainsClosed ? '#38bdf8' : '#64748b', fontSize: '1rem' }}></i>
                        <div 
                          className="fra-smart-switch" 
                          style={{ background: curtainsClosed ? '#10b981' : '#475569', transform: 'scale(0.8)', transformOrigin: 'right center' }}
                          onClick={() => {
                            setCurtainsClosed(!curtainsClosed);
                            showToast(`Screen Side Masking ${!curtainsClosed ? 'locked to Scope 2.39:1' : 'opened for Walk-in'}`);
                          }}
                          title="Toggle Screen Masking"
                        >
                          <div className="fra-smart-switch-handle" style={{ right: curtainsClosed ? '3px' : '23px' }}></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Scope Masking</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{curtainsClosed ? 'Scope 2.39:1 Locked' : 'Open / 16:9'}</div>
                    </div>
                  </div>

                  <div className="fra-smart-tile-meta-grid">
                    <div className="fra-smart-tile-meta-item">
                      <span>Auditorium VRV</span>
                      <strong style={{ color: '#38bdf8' }}>{auditoriumTemp}&deg;C Daikin Norm</strong>
                    </div>
                    <div className="fra-smart-tile-meta-item">
                      <span>Air Filtration</span>
                      <strong style={{ color: '#34d399' }}>HEPA 99.8% Active</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ================================================================
              VIEW 8: MARKETING (Campaigns, Social Toolkit & Calendar)
             ================================================================ */}
          {activeTab === 'Marketing' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-bullhorn"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Marketing</span>
                    </div>
                    <h1 className="fra-view-title">Marketing Campaigns, Social Media &amp; Local Promotion</h1>
                    <p className="fra-view-subtitle">Franchise promotional outreach, festive campaigns, and official Connplex digital toolkits</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => showToast('Opened Connplex 4K Poster Library')}>
                    <i className="fa-regular fa-image mr-1"></i> Poster Library
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => showToast('Downloaded Social Media Reels & Carousel Toolkit')}>
                    <i className="fa-solid fa-share-nodes mr-1"></i> Social Toolkit
                  </button>
                </div>
              </div>

              {/* Marketing Campaigns Section */}
              <section className="fra-section-card" id="fra-marketing-section">
                <div className="fra-section-header">
                  <h2 className="fra-section-title">
                    <i className="fa-solid fa-bullhorn" style={{ color: '#ec4899' }}></i>
                    Live Promotional Campaigns
                  </h2>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Active Franchisor &amp; Local Campaigns</span>
                </div>

                <div className="fra-list">
                  {campaigns.map((c, idx) => (
                    <div key={idx} className="fra-marketing-campaign">
                      <div className="fra-campaign-info">
                        <span className="fra-campaign-name">{c.name}</span>
                        <span className="fra-campaign-metrics">
                          Reach <strong>{c.reach}</strong> &bull; CTR <strong>{c.ctr}</strong>
                        </span>
                      </div>
                      <span className={`fra-campaign-badge ${c.status.toLowerCase()}`}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.status === 'ACTIVE' ? '#10b981' : '#f59e0b', display: 'inline-block', marginRight: '4px' }}></span>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Calendar & Events */}
              <section className="fra-section-card">
                <div className="fra-section-header">
                  <h2 className="fra-section-title">
                    <i className="fa-regular fa-calendar-check" style={{ color: '#f59e0b' }}></i>
                    Calendar &amp; Upcoming Events
                  </h2>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Upcoming</span>
                </div>
                <div className="fra-list">
                  {events.map((e, idx) => {
                    const tagStyle = getEventTypeColor(e.type);
                    return (
                      <div key={idx} className="fra-event-item">
                        <div className="fra-event-date-badge">
                          <span className="fra-event-month">{e.month}</span>
                          <span className="fra-event-day">{e.date}</span>
                        </div>
                        <div className="fra-event-details">
                          <span className="fra-event-title">{e.title}</span>
                          <span 
                            className="fra-event-type" 
                            style={{ 
                              color: tagStyle.color, 
                              background: tagStyle.bg,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              alignSelf: 'flex-start'
                            }}
                          >
                            {e.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ================================================================
              VIEW 9: REPORTS (Statements, Daily DCR & Ledger Downloads)
             ================================================================ */}
          {activeTab === 'Reports' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Reports</span>
                    </div>
                    <h1 className="fra-view-title">Box Office Statements, Daily MIS &amp; Financial Reports</h1>
                    <p className="fra-view-subtitle">Download audited Daily Collection Reports (DCR), monthly royalty reconciliations, and tax ledgers</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => {
                    showToast(`Downloaded Today's Daily Box Office Collection (DCR) for ${currentLocation.name}.`);
                  }}>
                    <i className="fa-solid fa-file-pdf mr-1"></i> Download Today's DCR
                  </button>
                  <button className="fra-btn fra-btn-outline" onClick={() => {
                    showToast(`Exported full financial ledger CSV for ${currentLocation.name}.`);
                  }}>
                    <i className="fa-solid fa-file-excel mr-1"></i> Export Ledger CSV
                  </button>
                </div>
              </div>

              {/* 4 Report Cards */}
              <div className="fra-reports-download-grid">
                <div className="fra-report-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.16)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Daily Collection Report (DCR)</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Screen-wise ticket &amp; admissions breakdown</div>
                    </div>
                  </div>
                  <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center', fontSize: '11px', padding: '0.45rem' }} onClick={() => showToast(`Downloaded DCR PDF for ${currentLocation.name}`)}>
                    <i className="fa-solid fa-download mr-1"></i> Download DCR (PDF)
                  </button>
                </div>

                <div className="fra-report-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      <i className="fa-solid fa-file-invoice"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Monthly Royalty Statement</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Franchise net settlement &amp; distributor share</div>
                    </div>
                  </div>
                  <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center', fontSize: '11px', padding: '0.45rem' }} onClick={() => showToast(`Downloaded Monthly Royalty Statement for ${currentLocation.name}`)}>
                    <i className="fa-solid fa-download mr-1"></i> Download Statement
                  </button>
                </div>

                <div className="fra-report-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.16)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Concessions F&amp;B Audit</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Itemized F&amp;B GST invoices &amp; SPH audit</div>
                    </div>
                  </div>
                  <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center', fontSize: '11px', padding: '0.45rem' }} onClick={() => showToast(`Downloaded Concessions Audit for ${currentLocation.name}`)}>
                    <i className="fa-solid fa-download mr-1"></i> Download F&amp;B Audit
                  </button>
                </div>

                <div className="fra-report-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.16)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      <i className="fa-solid fa-couch"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Screen Occupancy &amp; Seats</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Luxury recliner capacity utilization</div>
                    </div>
                  </div>
                  <button className="fra-btn fra-btn-outline" style={{ justifyContent: 'center', fontSize: '11px', padding: '0.45rem' }} onClick={() => showToast(`Downloaded Seat Utilization Ledger for ${currentLocation.name}`)}>
                    <i className="fa-solid fa-download mr-1"></i> Download Utilization
                  </button>
                </div>
              </div>

              {/* Audited Daily Breakdown Table */}
              <div className="fra-section-card">
                <div className="fra-section-header">
                  <h2 className="fra-section-title">
                    <i className="fa-solid fa-clock-rotate-left" style={{ color: '#f59e0b' }}></i>
                    Audited Daily Collection History (Last 7 Days)
                  </h2>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>POS ASMX Verified</span>
                </div>

                <div className="fra-table-wrap">
                  <table className="fra-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Admissions</th>
                        <th>Gross Box Office</th>
                        <th>Concessions F&amp;B</th>
                        <th>Net Franchise Settlement</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'Nov 24, 2026', adm: '268', box: '₹1,02,400', fnb: '₹29,480', net: '₹98,240', status: 'Settled' },
                        { date: 'Nov 23, 2026', adm: '312', box: '₹1,18,560', fnb: '₹34,320', net: '₹1,14,200', status: 'Settled' },
                        { date: 'Nov 22, 2026', adm: '420', box: '₹1,59,600', fnb: '₹46,200', net: '₹1,53,800', status: 'Settled' },
                        { date: 'Nov 21, 2026', adm: '445', box: '₹1,69,100', fnb: '₹48,950', net: '₹1,62,400', status: 'Settled' },
                        { date: 'Nov 20, 2026', adm: '280', box: '₹1,06,400', fnb: '₹30,800', net: '₹1,02,100', status: 'Settled' }
                      ].map((row, rIdx) => (
                        <tr key={rIdx}>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.date}</td>
                          <td>{row.adm}</td>
                          <td style={{ fontWeight: 700, color: '#f59e0b' }}>{row.box}</td>
                          <td style={{ color: '#38bdf8' }}>{row.fnb}</td>
                          <td style={{ fontWeight: 700, color: '#34d399' }}>{row.net}</td>
                          <td>
                            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              {row.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              type="button" 
                              className="fra-btn fra-btn-outline" 
                              style={{ fontSize: '10px', padding: '3px 8px' }}
                              onClick={() => showToast(`Downloaded invoice statement for ${row.date}`)}
                            >
                              <i className="fa-solid fa-download"></i> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 10: SUPPORT (Priority Partner NOC & Interactive Helpdesk)
             ================================================================ */}
          {activeTab === 'Support' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Support</span>
                    </div>
                    <h1 className="fra-view-title">Partner Priority Support Center (24/7 Operations NOC)</h1>
                    <p className="fra-view-subtitle">Dedicated technical assistance, POS sync support, SOP manuals, and direct emergency dispatch</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <a href="tel:18002666753" className="fra-btn fra-btn-primary" style={{ textDecoration: 'none' }} onClick={() => showToast('Calling National NOC: 1800 266 6753')}>
                    <i className="fa-solid fa-phone mr-1"></i> Call 24/7 Hotline
                  </a>
                </div>
              </div>

              {/* 5 Service Selector Cards */}
              <div className="fra-support-grid">
                {[
                  { id: 'tickets', title: "Raise Ticket", desc: "Technical or POS request", icon: "fa-ticket", color: "#3b82f6" },
                  { id: 'chat', title: "Live Chat", desc: "Chat with ops team", icon: "fa-comments", color: "#10b981" },
                  { id: 'knowledge', title: "Knowledge Base", desc: "120 Cinema SOP guides", icon: "fa-book-open", color: "#f59e0b" },
                  { id: 'training', title: "Training Videos", desc: "18 Cinema SOP modules", icon: "fa-video", color: "#8b5cf6" },
                  { id: 'emergency', title: "Emergency Line", desc: "Rapid response hotline", icon: "fa-phone-flip", color: "#ef4444" }
                ].map((sup, idx) => {
                  const isActive = activeSupportTab === sup.id;
                  return (
                    <div 
                      key={idx} 
                      className={`fra-support-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveSupportTab(sup.id as any)}
                    >
                      <div className="fra-support-icon">
                        <i className={`fa-solid ${sup.icon}`}></i>
                      </div>
                      <span className="fra-support-title">{sup.title}</span>
                      <span className="fra-support-desc">{sup.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Working Support Console */}
              {activeSupportTab && (
                <div className="fra-support-console" id="fra-support-console">
                  {/* Console Tab Switcher & Close */}
                  <div className="fra-support-tabs-bar">
                    <div className="fra-support-nav-group">
                      <button
                        type="button"
                        className={`fra-support-nav-pill ${activeSupportTab === 'tickets' ? 'active' : ''}`}
                        onClick={() => setActiveSupportTab('tickets')}
                      >
                        <i className="fa-solid fa-ticket" style={{ color: activeSupportTab === 'tickets' ? '#0b0f19' : '#3b82f6' }}></i>
                        <span>Raise Ticket</span>
                      </button>
                      <button
                        type="button"
                        className={`fra-support-nav-pill ${activeSupportTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveSupportTab('chat')}
                      >
                        <i className="fa-solid fa-comments" style={{ color: activeSupportTab === 'chat' ? '#0b0f19' : '#10b981' }}></i>
                        <span>Live Chat</span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                      </button>
                      <button
                        type="button"
                        className={`fra-support-nav-pill ${activeSupportTab === 'knowledge' ? 'active' : ''}`}
                        onClick={() => setActiveSupportTab('knowledge')}
                      >
                        <i className="fa-solid fa-book-open" style={{ color: activeSupportTab === 'knowledge' ? '#0b0f19' : '#f59e0b' }}></i>
                        <span>Knowledge Base</span>
                      </button>
                      <button
                        type="button"
                        className={`fra-support-nav-pill ${activeSupportTab === 'training' ? 'active' : ''}`}
                        onClick={() => setActiveSupportTab('training')}
                      >
                        <i className="fa-solid fa-video" style={{ color: activeSupportTab === 'training' ? '#0b0f19' : '#8b5cf6' }}></i>
                        <span>Training Videos</span>
                      </button>
                      <button
                        type="button"
                        className={`fra-support-nav-pill ${activeSupportTab === 'emergency' ? 'active' : ''}`}
                        onClick={() => setActiveSupportTab('emergency')}
                      >
                        <i className="fa-solid fa-phone-flip" style={{ color: activeSupportTab === 'emergency' ? '#0b0f19' : '#ef4444' }}></i>
                        <span>Emergency Hotline</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="fra-support-close-btn"
                      onClick={() => setActiveSupportTab(null)}
                      aria-label="Close Support Console"
                    >
                      <i className="fa-solid fa-xmark"></i>
                      <span>Close</span>
                    </button>
                  </div>

                  {/* 1. TICKETS TAB */}
                  {activeSupportTab === 'tickets' && (
                    <div className="fra-support-form-grid">
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-ticket" style={{ color: '#3b82f6' }}></i> Log New Operations Ticket
                        </h3>
                        <form onSubmit={handleTicketSubmit}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="fra-support-field">
                              <label>Issue Category</label>
                              <select 
                                className="fra-support-input"
                                value={ticketCategory}
                                onChange={(e) => setTicketCategory(e.target.value)}
                              >
                                <option value="Hardware / Projection">Hardware / Christie Laser</option>
                                <option value="Dolby Atmos Sound">Dolby Atmos 7.1 Audio</option>
                                <option value="Cloud POS & Ticket Sync">Cloud POS &amp; Ticket Sync</option>
                                <option value="Daikin VRV Climate">Daikin VRV Climate / HVAC</option>
                                <option value="Concessions & F&B">Concessions &amp; F&amp;B Popcorn</option>
                                <option value="Licensing & Compliance">Licensing &amp; Compliance</option>
                              </select>
                            </div>

                            <div className="fra-support-field">
                              <label>Auditorium / Screen</label>
                              <select 
                                className="fra-support-input"
                                value={ticketScreen}
                                onChange={(e) => setTicketScreen(e.target.value)}
                              >
                                <option value="Screen 1 (Couple Recliner)">Screen 1 (Couple Recliner)</option>
                                <option value="Screen 2 (Gold Class)">Screen 2 (Gold Class)</option>
                                <option value="Box Office POS Counter">Box Office POS Counter</option>
                                <option value="Concession F&B Lounge">Concession F&amp;B Lounge</option>
                                <option value="All Cinema Facilities">All Cinema Facilities</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="fra-support-field">
                              <label>Priority SLA</label>
                              <select 
                                className="fra-support-input"
                                value={ticketPriority}
                                onChange={(e) => setTicketPriority(e.target.value)}
                              >
                                <option value="Low">Low (Informational • 48h SLA)</option>
                                <option value="Medium">Medium (Standard • 24h SLA)</option>
                                <option value="High">High (Elevated • 8h SLA)</option>
                                <option value="Critical">Critical (Showtime Blocker • 2h SLA)</option>
                              </select>
                            </div>

                            <div className="fra-support-field">
                              <label>Summary Subject</label>
                              <input 
                                type="text" 
                                className="fra-support-input"
                                placeholder="e.g. Screen 1 Laser Chiller Warning"
                                value={ticketSubject}
                                onChange={(e) => setTicketSubject(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="fra-support-field">
                            <label>Trouble Description &amp; Error Log</label>
                            <textarea 
                              className="fra-support-input"
                              rows={3}
                              placeholder="Provide specific error code, symptoms, or alarm readout..."
                              value={ticketDesc}
                              onChange={(e) => setTicketDesc(e.target.value)}
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="fra-btn fra-btn-primary" 
                            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                          >
                            <i className="fa-solid fa-paper-plane mr-1"></i> Submit Ticket to NOC Helpdesk
                          </button>
                        </form>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-list-check" style={{ color: '#10b981' }}></i> Active Tickets ({supportTickets.length})
                        </h3>
                        <div style={{ maxHeight: '310px', overflowY: 'auto' }}>
                          {supportTickets.map((t) => (
                            <div key={t.id} className="fra-support-ticket-item">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>{t.subject}</span>
                                <span style={{ 
                                  fontSize: '10px', 
                                  padding: '2px 8px', 
                                  borderRadius: '9999px', 
                                  fontWeight: 800,
                                  background: t.status === 'Resolved' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                                  color: t.status === 'Resolved' ? '#34d399' : '#fbbf24'
                                }}>
                                  {t.status}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                                <span>#{t.id} &bull; {t.category} ({t.screen})</span>
                                <span>{t.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. LIVE CHAT TAB */}
                  {activeSupportTab === 'chat' && (
                    <div className="fra-chat-container">
                      <div className="fra-chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                            Connplex Operations NOC Desk &bull; {currentLocation.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', marginRight: '4px' }}></i> 2-Min Live SLA
                        </span>
                      </div>

                      <div className="fra-chat-messages">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`fra-chat-bubble ${msg.sender}`}>
                            <div>{msg.text}</div>
                            <div style={{ fontSize: '9px', opacity: 0.6, marginTop: '3px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                              {msg.time}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick inquiry suggestion pills */}
                      <div className="fra-chat-chips">
                        {[
                          "POS ASMX live sync status",
                          "Screen 1 Christie Laser lamp health report",
                          "Dolby Atmos audio calibration check",
                          "Urgent F&B Concession inventory refill"
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="fra-chat-chip-btn"
                            onClick={() => setChatInput(chip)}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleSendChatMessage} className="fra-chat-input-bar">
                        <input 
                          type="text" 
                          className="fra-support-input"
                          placeholder="Type message to operations desk..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          style={{ margin: 0 }}
                        />
                        <button 
                          type="submit" 
                          className="fra-btn fra-btn-primary" 
                          style={{ padding: '0.65rem 1.25rem', whiteSpace: 'nowrap' }}
                        >
                          <i className="fa-solid fa-paper-plane mr-1"></i> Send
                        </button>
                      </form>
                    </div>
                  )}

                  {/* 3. KNOWLEDGE BASE TAB */}
                  {activeSupportTab === 'knowledge' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            Cinema Standard Operating Procedures (SOPs)
                          </h3>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
                            120 verified operational manuals, maintenance SOPs, and troubleshooting guides
                          </p>
                        </div>
                        <div style={{ minWidth: '240px' }}>
                          <input 
                            type="text" 
                            className="fra-support-input" 
                            placeholder="Search SOP guides (e.g. Laser, Dolby, POS)..."
                            value={knowledgeSearch}
                            onChange={(e) => setKnowledgeSearch(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="fra-kb-grid">
                        {[
                          { 
                            id: 'sop-1',
                            title: 'Christie 4K Laser Projection Cold Bootup & Chiller Calibration',
                            cat: 'Projection & Optical',
                            time: '12 min read',
                            steps: [
                              'Turn on the liquid chiller unit 15 minutes before projector laser activation to stabilize coolant temperature at 21°C ± 1°C.',
                              'Verify laser optical module interlocks are secure and DCI security tamper switch is closed.',
                              'Execute CP4430-RGB self-test diagnostic via Christie IMB touch panel.',
                              'Confirm Screen 1 anamorphic scope lens returns to 2.39:1 zero-offset position.'
                            ]
                          },
                          { 
                            id: 'sop-2',
                            title: 'Dolby Atmos 7.1 Speaker Channel Pink Noise Diagnostic Protocol',
                            cat: 'Sound & Audio',
                            time: '8 min read',
                            steps: [
                              'Switch Dolby CP950 cinema processor to Calibration Mode (Pin: 8821).',
                              'Generate calibrated -20dBFS band-limited pink noise across all 8 discrete audio channels.',
                              'Verify sound pressure level reads 85 dBC at reference listening position (Row E Center Recliner).',
                              'Check subwoofer LFE bass management cut-off frequency is locked at 80 Hz.'
                            ]
                          },
                          { 
                            id: 'sop-3',
                            title: 'Box Office POS Standalone Offline Fallback Procedure',
                            cat: 'Ticketing Systems',
                            time: '6 min read',
                            steps: [
                              'If internet WAN drops, terminal displays yellow "Offline Mode" indicator.',
                              'Terminal automatically continues issuing tickets using pre-cached seating block numbers.',
                              'Do not power cycle the POS terminal while offline transactions are queued in local SQLite cache.',
                              'Upon WAN restoration, terminal auto-synchronizes batch transactions into ASMX backend within 60 seconds.'
                            ]
                          },
                          { 
                            id: 'sop-4',
                            title: 'Concession Popcorn Degreasing & Food Safety Sanitization',
                            cat: 'F&B Concessions',
                            time: '10 min read',
                            steps: [
                              'Allow Cretors kettle to cool down to 50°C before cleaning.',
                              'Use food-grade Heat’n Kleen degreaser solution; do not submerge kettle in water.',
                              'Wipe warmer base tray and dump unpopped corn kernels into waste disposal bin.',
                              'Verify FSSAI daily temperature log sheet is signed by duty concession manager.'
                            ]
                          },
                          { 
                            id: 'sop-5',
                            title: 'Auditorium Emergency Evacuation & Smoke Cutoff Protocol',
                            cat: 'Life Safety',
                            time: '15 min read',
                            steps: [
                              'Fire alarm system automatically triggers projector laser cutoff and brings auditorium house sconces to 100% white illumination.',
                              'Daikin VRV HVAC system immediately trips smoke extraction damper into purge mode.',
                              'Duty floor ushers guide patrons through illuminated emergency exit doors on screen left/right.',
                              'Report auditorium clearance to local fire control officer via hotline 101/112.'
                            ]
                          },
                          { 
                            id: 'sop-6',
                            title: 'Maharashtra Cinematograph License & Fire NOC Annual Registers',
                            cat: 'Compliance',
                            time: '7 min read',
                            steps: [
                              'Keep physical DM license, Electrical Inspector safety certificate, and CFO Fire NOC in manager station.',
                              'Ensure 2kg ABC dry chemical fire extinguishers at both projection ports undergo monthly gauge checks.',
                              'Maintain entertainment tax register and state GST invoice serial logs for annual district audit.'
                            ]
                          }
                        ].filter(s => s.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) || s.cat.toLowerCase().includes(knowledgeSearch.toLowerCase()))
                        .map((sop) => {
                          const isExpanded = expandedSopId === sop.id;
                          return (
                            <div 
                              key={sop.id} 
                              className="fra-kb-card"
                              onClick={() => setExpandedSopId(isExpanded ? null : sop.id)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <div>
                                  <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                                    {sop.cat} &bull; {sop.time}
                                  </span>
                                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff', margin: '4px 0 6px' }}>
                                    {sop.title}
                                  </h4>
                                </div>
                                <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}></i>
                              </div>

                              {isExpanded && (
                                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.6 }}>
                                    <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                      {sop.steps.map((st, sIdx) => (
                                        <li key={sIdx} style={{ marginBottom: '4px' }}>{st}</li>
                                      ))}
                                    </ol>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. TRAINING VIDEOS TAB */}
                  {activeSupportTab === 'training' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            Connplex Cinema Training &amp; Video Learning Modules
                          </h3>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
                            Interactive certification videos for cinema operations, projection, ticketing &amp; hospitality
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '3px 10px', borderRadius: '9999px', fontWeight: 800 }}>
                          <i className="fa-solid fa-graduation-cap mr-1"></i> 100% Franchise Compliance Score
                        </span>
                      </div>

                      {activeTrainingModule && (
                        <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '18px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f59e0b' }}>
                              <i className="fa-solid fa-play-circle mr-1"></i> Now Playing: {activeTrainingModule}
                            </span>
                            <button 
                              type="button" 
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
                              onClick={() => setActiveTrainingModule(null)}
                            >
                              <i className="fa-solid fa-xmark"></i> Close Player
                            </button>
                          </div>
                          <div style={{ height: '140px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <i className="fa-solid fa-circle-play" style={{ fontSize: '2.5rem', color: '#f59e0b' }}></i>
                            <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>Stream Ready &bull; High-Definition 1080p Cinema SOP Stream</span>
                          </div>
                        </div>
                      )}

                      <div className="fra-training-grid">
                        {[
                          { title: 'Digital Box Office POS Management & Rapid Ticketing', duration: '45 mins', score: '98%', status: 'Completed', icon: 'fa-ticket' },
                          { title: 'Christie 4K Laser Bootup & KDM License Ingestion', duration: '35 mins', score: '100%', status: 'Completed', icon: 'fa-film' },
                          { title: 'Dolby Atmos 7.1 Acoustic Calibration & Audio Routing', duration: '50 mins', score: 'Pending', status: 'In Progress', icon: 'fa-volume-high' },
                          { title: 'FSSAI Food Hygiene, Concessions Sanitation & FIFO', duration: '40 mins', score: '95%', status: 'Completed', icon: 'fa-burger' }
                        ].map((mod, idx) => (
                          <div key={idx} className="fra-training-card">
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ 
                                  fontSize: '10px', 
                                  padding: '2px 8px', 
                                  borderRadius: '9999px', 
                                  fontWeight: 800,
                                  background: mod.status === 'Completed' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                                  color: mod.status === 'Completed' ? '#34d399' : '#fbbf24'
                                }}>
                                  {mod.status} &bull; Score: {mod.score}
                                </span>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                  <i className="fa-regular fa-clock mr-1"></i> {mod.duration}
                                </span>
                              </div>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                                {mod.title}
                              </h4>
                            </div>

                            <button
                              type="button"
                              className="fra-btn fra-btn-outline"
                              style={{ justifyContent: 'center', fontSize: '12px', padding: '0.5rem' }}
                              onClick={() => {
                                setActiveTrainingModule(mod.title);
                                showToast(`Loaded SOP Video Module: ${mod.title}`);
                              }}
                            >
                              <i className="fa-solid fa-play mr-1"></i> Watch SOP Video Module
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. EMERGENCY LINE TAB */}
                  {activeSupportTab === 'emergency' && (
                    <div>
                      <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                          <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fca5a5' }}>
                            Connplex 24/7 Rapid Response Emergency Protocol
                          </div>
                          <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                            Immediate dispatch hotlines for cinema screen blackouts, sound outages, POS interruptions, and medical/fire incidents.
                          </div>
                        </div>
                      </div>

                      <div className="fra-emergency-grid">
                        <div className="fra-emergency-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>Toll-Free 24/7 Hotline</span>
                            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Active NOC</span>
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>National NOC Operations Desk</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>1800 266 6753</div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <a 
                              href="tel:18002666753" 
                              className="fra-btn fra-btn-primary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '0.45rem', textDecoration: 'none' }}
                              onClick={() => showToast('Calling National NOC Operations Desk: 1800 266 6753')}
                            >
                              <i className="fa-solid fa-phone mr-1"></i> Call Now
                            </a>
                            <button 
                              type="button" 
                              className="fra-btn fra-btn-outline" 
                              style={{ fontSize: '11px', padding: '0.45rem 0.75rem' }}
                              onClick={() => {
                                navigator?.clipboard?.writeText('18002666753');
                                showToast('Copied 1800 266 6753 to clipboard!');
                              }}
                            >
                              <i className="fa-regular fa-copy"></i>
                            </button>
                          </div>
                        </div>

                        <div className="fra-emergency-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>Hardware / Laser NOC</span>
                            <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.16)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Christie / Dolby</span>
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Projection &amp; Sound Escalation</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>+91 22 4589 1199</div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <a 
                              href="tel:+912245891199" 
                              className="fra-btn fra-btn-primary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '0.45rem', textDecoration: 'none' }}
                              onClick={() => showToast('Calling Projection Escalation Desk: +91 22 4589 1199')}
                            >
                              <i className="fa-solid fa-phone mr-1"></i> Call Now
                            </a>
                            <button 
                              type="button" 
                              className="fra-btn fra-btn-outline" 
                              style={{ fontSize: '11px', padding: '0.45rem 0.75rem' }}
                              onClick={() => {
                                navigator?.clipboard?.writeText('+912245891199');
                                showToast('Copied +91 22 4589 1199 to clipboard!');
                              }}
                            >
                              <i className="fa-regular fa-copy"></i>
                            </button>
                          </div>
                        </div>

                        <div className="fra-emergency-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>Database NOC</span>
                            <span style={{ fontSize: '10px', background: 'rgba(168, 85, 247, 0.16)', color: '#c084fc', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>On-Call Engineer</span>
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>POS Server &amp; Database Desk</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>+91 98200 87654</div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <a 
                              href="tel:+919820087654" 
                              className="fra-btn fra-btn-primary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '0.45rem', textDecoration: 'none' }}
                              onClick={() => showToast('Calling POS Server Engineering: +91 98200 87654')}
                            >
                              <i className="fa-solid fa-phone mr-1"></i> Call Now
                            </a>
                            <button 
                              type="button" 
                              className="fra-btn fra-btn-outline" 
                              style={{ fontSize: '11px', padding: '0.45rem 0.75rem' }}
                              onClick={() => {
                                navigator?.clipboard?.writeText('+919820087654');
                                showToast('Copied +91 98200 87654 to clipboard!');
                              }}
                            >
                              <i className="fa-regular fa-copy"></i>
                            </button>
                          </div>
                        </div>

                        <div className="fra-emergency-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Regional Leadership</span>
                            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.16)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Maharashtra</span>
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Regional Operations Director</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>+91 98220 12345</div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <a 
                              href="tel:+919822012345" 
                              className="fra-btn fra-btn-primary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '0.45rem', textDecoration: 'none' }}
                              onClick={() => showToast('Calling Regional Director: +91 98220 12345')}
                            >
                              <i className="fa-solid fa-phone mr-1"></i> Call Now
                            </a>
                            <button 
                              type="button" 
                              className="fra-btn fra-btn-outline" 
                              style={{ fontSize: '11px', padding: '0.45rem 0.75rem' }}
                              onClick={() => {
                                navigator?.clipboard?.writeText('+919822012345');
                                showToast('Copied +91 98220 12345 to clipboard!');
                              }}
                            >
                              <i className="fa-regular fa-copy"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              VIEW 11: SETTINGS (Property Architecture, Profile & Ambience)
             ================================================================ */}
          {activeTab === 'Settings' && (
            <div className="fra-page-view-container">
              {/* Page Header */}
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-sliders"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Settings</span>
                    </div>
                    <h1 className="fra-view-title">Cinema Property Configuration &amp; Partner Profile</h1>
                    <p className="fra-view-subtitle">Franchise partner credentials, auditorium architectural specs, and lighting mode preferences</p>
                  </div>
                </div>
                <div className="fra-view-header-actions">
                  <button className="fra-btn fra-btn-primary" onClick={() => showToast('Cinema configuration saved successfully.')}>
                    <i className="fa-solid fa-floppy-disk mr-1"></i> Save Preferences
                  </button>
                </div>
              </div>

              {/* Specs Strip */}
              <div className="fra-location-specs-strip" id="fra-specs-section">
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
                {currentLocation.hasApiIntegration ? (
                  <div className="fra-spec-chip highlight">
                    <i className="fa-solid fa-bolt"></i>
                    <span>Live POS Synchronized (ASMX)</span>
                  </div>
                ) : (
                  <div className="fra-spec-chip">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Enterprise Cloud POS Connected</span>
                  </div>
                )}
                <div className="fra-spec-chip">
                  <i className="fa-solid fa-user-tie"></i>
                  <span>Partner: {currentLocation.partnerName}</span>
                </div>
              </div>

              {/* Architecture & Hardware Grid */}
              <div className="fra-smart-cockpit-grid">
                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-building" style={{ color: '#f59e0b' }}></i>
                      <span>Property Architecture &amp; Auditoriums</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cinema Name</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{currentLocation.fullName}</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Location &amp; District</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{currentLocation.city}, {currentLocation.state}</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Screens &amp; Seating</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{currentLocation.totalScreens} Screens &bull; {currentLocation.totalSeats} Luxury Seats</span>
                    </div>
                  </div>
                </div>

                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-user-shield" style={{ color: '#10b981' }}></i>
                      <span>Franchise Partner Profile</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Partner Name</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{currentUser?.name || currentLocation.partnerName}</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Role Level</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f59e0b' }}>{currentUser?.role || currentLocation.partnerRole}</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>POS Certification</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#34d399' }}>Cloud POS Certified</span>
                    </div>
                  </div>
                </div>

                <div className="fra-smart-tile">
                  <div className="fra-smart-tile-header">
                    <div className="fra-smart-tile-title">
                      <i className="fa-solid fa-palette" style={{ color: '#38bdf8' }}></i>
                      <span>Ambience &amp; Portal Theme</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Warm Gold Cinema Ambience</span>
                      <button
                        type="button"
                        className={`fra-theme-pill-btn ${ambienceTheme === 'ambient' ? 'active' : ''}`}
                        onClick={() => {
                          setAmbienceTheme('ambient');
                          showToast('Ambience Mode: Warm Gold Cinema Lighting');
                        }}
                        style={{ padding: '4px 12px' }}
                      >
                        Light
                      </button>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Dark Showtime Mode</span>
                      <button
                        type="button"
                        className={`fra-theme-pill-btn ${ambienceTheme === 'cinema' ? 'active' : ''}`}
                        onClick={() => {
                          setAmbienceTheme('cinema');
                          showToast('Cinema Mode: Dark Auditorium Showtime Lighting');
                        }}
                        style={{ padding: '4px 12px' }}
                      >
                        Dark
                      </button>
                    </div>
                    <button 
                      type="button" 
                      className="fra-btn fra-btn-outline" 
                      style={{ justifyContent: 'center', borderColor: '#ef4444', color: '#f87171', marginTop: '0.5rem' }}
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-sign-out-alt mr-1"></i> Sign Out of Franchise Portal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW: GROUP BOOKING & BULK SHOWS
             ================================================================ */}
          {activeTab === 'Group Booking' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Group Booking</span>
                    </div>
                    <h1 className="fra-view-title">Group Bookings, VIP Packages &amp; Corporate Screenings</h1>
                    <p className="fra-view-subtitle">Bulk ticket quotes, private auditorium charters, school packages, and birthday screenings</p>
                  </div>
                </div>
              </div>
              <GroupBookingView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: MERCHANDISE / CINEMA RETAIL STORE
             ================================================================ */}
          {activeTab === 'Merchandise' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-store"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Merchandise</span>
                    </div>
                    <h1 className="fra-view-title">Cinema Merchandise &amp; Memorabilia Retail Store</h1>
                    <p className="fra-view-subtitle">Official film posters, superhero collectibles, branded popcorn tubs, and retail apparel</p>
                  </div>
                </div>
              </div>
              <MerchandiseView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: STAFF & ROSTER MANAGEMENT
             ================================================================ */}
          {activeTab === 'Staff' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Staff Management</span>
                    </div>
                    <h1 className="fra-view-title">Cinema Staff Roster, Shifts &amp; Team Productivity</h1>
                    <p className="fra-view-subtitle">Duty manager shifts, box office cashiers, ushers, projectionists, and leave approvals</p>
                  </div>
                </div>
              </div>
              <StaffView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: TRAINING & SOPS ACADEMY
             ================================================================ */}
          {activeTab === 'Training' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Training &amp; SOPs</span>
                    </div>
                    <h1 className="fra-view-title">Franchise Staff Training Academy &amp; Standard Operating Procedures</h1>
                    <p className="fra-view-subtitle">Certified video training modules, projection room protocols, guest safety drills, and cinema hygiene</p>
                  </div>
                </div>
              </div>
              <TrainingView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: OFFERS & PROMOTIONS
             ================================================================ */}
          {activeTab === 'Offers' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-tags"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">My Offers</span>
                    </div>
                    <h1 className="fra-view-title">Promotional Offers, Bank Discounts &amp; Coupon Codes</h1>
                    <p className="fra-view-subtitle">BOGO weekend cinema specials, card discount schemes, student passes, and festive ticket bundles</p>
                  </div>
                </div>
              </div>
              <OffersView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: MIS & EXECUTIVE BI INTELLIGENCE
             ================================================================ */}
          {activeTab === 'MIS' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-chart-pie"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">MIS</span>
                    </div>
                    <h1 className="fra-view-title">Executive Management Information System (MIS)</h1>
                    <p className="fra-view-subtitle">Strategic multi-screen variance analysis, consolidated collections, target benchmarking, and KPI analytics</p>
                  </div>
                </div>
              </div>
              <MISView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: DOCUMENTS & LEGAL REPOSITORY
             ================================================================ */}
          {activeTab === 'Documents' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Documents</span>
                    </div>
                    <h1 className="fra-view-title">Cinema Legal Agreements, Corporate Policies &amp; Documents</h1>
                    <p className="fra-view-subtitle">Franchise agreement copies, FSSAI certificates, distributor royalty terms, and statutory audit records</p>
                  </div>
                </div>
              </div>
              <DocumentsView 
                selectedCinemaId={currentLocation.cinemaId} 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: LICENSE & STATUTORY COMPLIANCE
             ================================================================ */}
          {activeTab === 'License' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-certificate"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">License</span>
                    </div>
                    <h1 className="fra-view-title">Statutory Cinema Licenses &amp; Regulatory Compliances</h1>
                    <p className="fra-view-subtitle">District Magistrate Cinema license, Fire NOC, Health license, Electrical inspections, and PPL/IPRS clearance</p>
                  </div>
                </div>
              </div>
              <LicenseView 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: NOTIFICATIONS & CRITICAL ALERTS
             ================================================================ */}
          {activeTab === 'Notifications' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Notifications</span>
                    </div>
                    <h1 className="fra-view-title">Live System Notifications &amp; Escalation Alerts</h1>
                    <p className="fra-view-subtitle">Real-time alerts for projection errors, inventory stock triggers, offline screens, and SLA deadlines</p>
                  </div>
                </div>
              </div>
              <NotificationsView 
                onNavigate={(r) => {
                  const cleaned = r.replace('/conncloud/', '').replace(/[-_]/g, ' ');
                  const resolved = normalizeTab(cleaned) || 'Dashboard';
                  handleNavClick(resolved);
                }} 
                triggerNotification={showToast} 
              />
            </div>
          )}

          {/* ================================================================
              VIEW: CALENDAR & SHOWTIME SCHEDULES
             ================================================================ */}
          {activeTab === 'Calendar' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-calendar-days"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Calendar</span>
                    </div>
                    <h1 className="fra-view-title">Cinema Operations Calendar &amp; Showtime Milestones</h1>
                    <p className="fra-view-subtitle">Upcoming film release premieres, maintenance schedules, corporate reviews, and marketing deadlines</p>
                  </div>
                </div>
              </div>
              <CalendarView selectedCinemaId={currentLocation.cinemaId} />
            </div>
          )}

          {/* ================================================================
              VIEW: DATA EXTRACTION MATRIX
             ================================================================ */}
          {activeTab === 'Data Extraction Matrix' && (
            <div className="fra-page-view-container">
              <div className="fra-view-page-header">
                <div className="fra-view-page-title-wrap">
                  <div className="fra-view-page-icon">
                    <i className="fa-solid fa-database"></i>
                  </div>
                  <div>
                    <div className="fra-view-breadcrumb">
                      <span>{currentLocation.name}</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <span className="fra-view-breadcrumb-active">Data Extraction</span>
                    </div>
                    <h1 className="fra-view-title">21-Source Data Extraction Matrix &amp; Schema Inspector</h1>
                    <p className="fra-view-subtitle">Automated verification of POS database tables, collections, sync timestamps, and audit schemas</p>
                  </div>
                </div>
              </div>
              <DataExtractionMatrix 
                selectedCinemaId={currentLocation.cinemaId} 
                selectedDateRange="Today" 
                onNotification={showToast} 
              />
            </div>
          )}

        </main>
      </div>

      {/* 3. All 22 Cinema Modules Overview Modal */}
      {showAllModulesModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowAllModulesModal(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(11, 15, 25, 0.98))',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <i className="fa-solid fa-table-cells" style={{ color: '#f59e0b' }}></i>
                  All 22 Cinema Modules
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Unified Operations &amp; Franchise Suite for {currentLocation.name}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAllModulesModal(false)}
                style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#cbd5e1', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.85rem' }}>
              {dockNavItems.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      handleNavClick(item.name);
                      setShowAllModulesModal(false);
                    }}
                    style={{
                      background: isActive ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.15))' : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '16px',
                      padding: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? '#0b0f19' : '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Open {item.name} module</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Floating Capsule Location Dock (Exact Match to Reference Image's "Living Room / Bedroom" Pill Dock) */}
      <nav className="fra-floating-bottom-dock" aria-label="Cinema Property Switcher Dock">
        {Object.values(LOCATIONS).map((loc) => {
          const isSelected = selectedLocationKey === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              className={`fra-bottom-dock-pill ${isSelected ? 'active' : ''}`}
              onClick={() => {
                setSelectedLocationKey(loc.id);
                showToast(`Switched active cinema to ${loc.name}`);
              }}
            >
              <i className="fa-solid fa-film" style={{ fontSize: '10px' }}></i>
              <span>{loc.name}</span>
            </button>
          );
        })}

        <button 
          type="button" 
          className="fra-bottom-dock-plus" 
          title="All 6 Cinema Properties Active"
          onClick={() => showToast('All 6 Connplex Cinema Properties are online and synchronized.')}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </nav>

    </div>
  );
}
