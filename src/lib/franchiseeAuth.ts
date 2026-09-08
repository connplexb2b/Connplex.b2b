// Centralized Franchisee and ConnCloud Authentication Module

export interface FranchiseeUser {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  contact: string;
  cinemaId: string; // 'c5' for Ahilyanagar, 'c1' for Jodhpur, etc. or 'all'
  cinemaName: string;
  locationKey: string; // 'ahilyanagar', 'gandhinagar', etc.
  locationTitle: string;
}

const DEFAULT_CORPORATE_USER: FranchiseeUser = {
  id: 'user_corp',
  name: 'Rakesh Patel',
  role: 'Franchise Partner & Super Admin',
  initials: 'RP',
  email: 'guptajahnvi47@gmail.com',
  contact: '+91 9511310113',
  cinemaId: 'all',
  cinemaName: 'All Cinemas',
  locationKey: 'gandhinagar',
  locationTitle: 'Connplex Capital 2, Gandhinagar'
};

const AHILYANAGAR_USER: FranchiseeUser = {
  id: 'user_ahilyanagar',
  name: 'Vikram Shinde',
  role: 'Ahilyanagar Franchise Partner',
  initials: 'VS',
  email: 'ahilyanagar@theconnplex.com',
  contact: '+91 9511310115',
  cinemaId: 'c5',
  cinemaName: 'Connplex Ahilyanagar',
  locationKey: 'ahilyanagar',
  locationTitle: 'Connplex Luxuriance, Ahilyanagar'
};

export function verifyFranchiseeCredentials(
  loginInput: string,
  passwordInput: string
): { success: boolean; user?: FranchiseeUser; error?: string } {
  const sanitizedLogin = loginInput.trim().toLowerCase();
  const sanitizedPass = passwordInput.trim();

  if (!sanitizedLogin || !sanitizedPass) {
    return { success: false, error: 'Please enter both login ID and password.' };
  }

  // 1. Check Ahilyanagar Login
  const isAhilyanagarLogin = 
    sanitizedLogin === 'ahilyanagar' ||
    sanitizedLogin.includes('ahilya') ||
    sanitizedLogin === 'ahilyanagar@connplex.com' ||
    sanitizedLogin === 'ahilyanagar@theconnplex.com' ||
    sanitizedLogin === 'ah01' ||
    sanitizedLogin === '9511310115' ||
    sanitizedLogin === '9822012345';

  if (isAhilyanagarLogin) {
    // Check known passwords or accept reasonable password for ahilyanagar
    const validAhilyaPasswords = [
      'ahilyanagar',
      'ahilyanagar@2026',
      'ahilyanagar@123',
      'ahilya@123',
      'ahilya@2026',
      'connplex@123',
      'connplex',
      'jahnvi@04'
    ];

    const passLower = sanitizedPass.toLowerCase();
    const isPassValid = 
      validAhilyaPasswords.includes(passLower) || 
      passLower.includes('ahilya') ||
      sanitizedPass.length >= 4; // allow user custom password for ahilyanagar

    if (isPassValid) {
      return { success: true, user: AHILYANAGAR_USER };
    } else {
      return { success: false, error: 'Invalid password for Ahilyanagar account.' };
    }
  }

  // 2. Check Corporate Master Account (Jahnvi / Rakesh)
  const isCorpLogin = 
    sanitizedLogin === 'guptajahnvi47@gmail.com' || 
    sanitizedLogin === '9511310113' ||
    sanitizedLogin === 'admin@connplex.com';

  if (isCorpLogin) {
    if (sanitizedPass === 'Jahnvi@04' || sanitizedPass === 'connplex-admin') {
      return { success: true, user: DEFAULT_CORPORATE_USER };
    } else {
      return { success: false, error: 'Invalid password for corporate account.' };
    }
  }

  // 3. Check Other Regional Cinema Accounts
  const regionalCinemas: Record<string, { cinemaId: string; name: string; locationKey: string; title: string }> = {
    jodhpur: { cinemaId: 'c1', name: 'Connplex Jodhpur', locationKey: 'jodhpur', title: 'Connplex Jodhpur' },
    jaipur: { cinemaId: 'c2', name: 'Connplex Jaipur', locationKey: 'jaipur', title: 'Connplex Jaipur' },
    ahmedabad: { cinemaId: 'c3', name: 'Connplex Ahmedabad', locationKey: 'ahmedabad', title: 'Connplex Ahmedabad' },
    udaipur: { cinemaId: 'c4', name: 'Connplex Udaipur', locationKey: 'udaipur', title: 'Connplex Udaipur' },
    gandhinagar: { cinemaId: 'c0', name: 'Connplex Gandhinagar', locationKey: 'gandhinagar', title: 'Connplex Capital 2, Gandhinagar' }
  };

  for (const [key, meta] of Object.entries(regionalCinemas)) {
    if (sanitizedLogin.includes(key)) {
      if (sanitizedPass.toLowerCase() === key || sanitizedPass === 'Connplex@123' || sanitizedPass === 'Jahnvi@04') {
        return {
          success: true,
          user: {
            id: `user_${key}`,
            name: `${meta.name} Partner`,
            role: 'Franchise Partner',
            initials: meta.name.slice(0, 2).toUpperCase(),
            email: `${key}@theconnplex.com`,
            contact: '+91 9511310113',
            cinemaId: meta.cinemaId,
            cinemaName: meta.name,
            locationKey: meta.locationKey,
            locationTitle: meta.title
          }
        };
      }
    }
  }

  return { success: false, error: 'Invalid credentials. Check your email/contact number and password.' };
}

export function storeFranchiseeSession(user: FranchiseeUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('franchisee_session', 'authenticated');
  localStorage.setItem('franchisee_cinema', user.cinemaId);
  localStorage.setItem('franchisee_location', user.locationKey);
  localStorage.setItem('franchisee_user', JSON.stringify(user));
}

export function getStoredFranchiseeUser(): FranchiseeUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('franchisee_user');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  // Check if session is authenticated
  const session = localStorage.getItem('franchisee_session');
  if (session === 'authenticated') {
    const cinema = localStorage.getItem('franchisee_cinema');
    if (cinema === 'c5' || localStorage.getItem('franchisee_location') === 'ahilyanagar') {
      return AHILYANAGAR_USER;
    }
    return DEFAULT_CORPORATE_USER;
  }
  return null;
}

export function clearFranchiseeSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('franchisee_session');
  localStorage.removeItem('franchisee_cinema');
  localStorage.removeItem('franchisee_location');
  localStorage.removeItem('franchisee_user');
}
