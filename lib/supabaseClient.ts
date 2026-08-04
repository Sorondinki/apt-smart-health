  // Executive Security Clearances (Authorized MD Emails)
  const ALLOWED_MD_EMAILS = [
    'sorondinkiseeme@gmail.com',
    'mariyashehuibrahim@gmail.com'
  ];

  // Authentication & Clearance Check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail') || '';
    const bannedUsers = JSON.parse(localStorage.getItem('apt_banned_users') || '[]');

    if (!isLoggedIn) {
      alert('Security Alert: Authentication required to enter MD Executive Office.');
      router.push('/apt-login');
      return;
    }

    if (bannedUsers.includes(userEmail.toLowerCase())) {
      alert('Access Denied: Account revoked.');
      localStorage.removeItem('isLoggedIn');
      router.push('/apt-login');
      return;
    }

    // Check if the current user email is among authorized MD Emails
    const isAuthorized = ALLOWED_MD_EMAILS.some(
      (email) => email.toLowerCase() === userEmail.toLowerCase()
    );

    if (!isAuthorized) {
      alert('Unauthorized Access: Managing Director Clearance Required.');
      router.push('/'); // Redirects straight to the main Landing Page
      return;
    }

    setMdEmail(userEmail);
    setIsAuthenticated(true);

    const savedHospitals = localStorage.getItem('apt_md_hospitals');
    if (savedHospitals) setHospitals(JSON.parse(savedHospitals));
    else setHospitals(defaultHospitals);

    const savedMissedCalls = localStorage.getItem('apt_md_missed_calls');
    if (savedMissedCalls) setMissedCalls(JSON.parse(savedMissedCalls));

    setAgents(defaultAgents);
  }, [router]);
