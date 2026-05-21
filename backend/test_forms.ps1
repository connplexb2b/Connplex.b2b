$baseUrl = "http://localhost:5000/api"
$rand = Get-Random -Minimum 1000 -Maximum 9999

# Helper function to submit form
function Submit-Form($endpoint, $payload, $name) {
    Write-Host "Testing $name at POST $baseUrl$endpoint..." -ForegroundColor Cyan
    try {
        $body = $payload | ConvertTo-Json -Depth 5
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method POST -Headers @{ "Content-Type" = "application/json"; "Origin" = "https://connplex-b2b.vercel.app" } -Body $body
        Write-Host "Success: $($response.success), Message: $($response.message)" -ForegroundColor Green
        Write-Host "Response Data: $($response.data | ConvertTo-Json -Compress)" -ForegroundColor Gray
    } catch {
        Write-Error "Failed to submit $name`: $_"
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host "Error Details: $($reader.ReadToEnd())" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# 1. Book Event
Submit-Form "/forms/book-event" @{
    eventType = "Corporate Event"
    eventName = "Antigravity Tech Summit"
    eventDate = "2026-06-15"
    startTime = "09:00"
    endTime = "17:00"
    expectedGuests = 150
    fullName = "Alice Smith"
    email = "alice$rand@example.com"
    phone = "9876543210"
    company = "Google DeepMind"
    message = "Looking forward to hosting our annual conference."
} "Book Event"

# 2. Conn Events Waitlist
Submit-Form "/forms/connevents-waitlist" @{
    email = "connevents_test$rand@example.com"
} "Conn Events Waitlist"

# 3. Connflix Notify
Submit-Form "/forms/connflix-subscribers" @{
    email = "connflix_test$rand@example.com"
} "Connflix Notify"

# 4. Connmusic Waitlist
Submit-Form "/forms/connmusic-waitlist" @{
    email = "connmusic_test$rand@example.com"
} "Connmusic Waitlist"

# 5. Connplex Studio Invite
Submit-Form "/forms/studio-invitations" @{
    name = "Bob Martin"
    email = "bob$rand@example.com"
} "Connplex Studio Invite"

# 6. Contact Form
Submit-Form "/forms/contact-messages" @{
    fullName = "Charlie Brown"
    email = "charlie$rand@example.com"
    phone = "9988776655"
    state = "California"
    city = "San Jose"
    preferredInvestment = "50L - 1Cr"
    preferredCity = "Los Angeles"
    hasProperty = "Yes"
    timeframe = "Immediate"
    message = "Interested in opening a franchise in LA."
} "Contact Form"

# 7. Downtown VIP Invite
Submit-Form "/forms/downtown-invitations" @{
    name = "Downtown VIP Guest"
    email = "downtown_vip$rand@example.com"
    consent = $true
} "Downtown VIP Invite"

# 8. Franchise Inquiry
Submit-Form "/forms/franchise-applications" @{
    fullName = "David Green"
    email = "david$rand@example.com"
    phone = "9112233445"
    state = "Texas"
    city = "Austin"
    preferredInvestment = "1Cr - 2Cr"
    preferredCity = "Dallas"
    hasProperty = "No"
    timeframe = "1-3 Months"
    message = "Looking for business partnership opportunities."
} "Franchise Inquiry"

# 9. Pure-X Subscribe
Submit-Form "/forms/purex-subscribers" @{
    email = "purex_test$rand@example.com"
} "Pure-X Subscribe"

# 10. Sky-Inn VIP Reservation
Submit-Form "/forms/skyinn-reservations" @{
    email = "skyinn_test$rand@example.com"
} "Sky-Inn VIP Reservation"

# 11. Newsletter Subscribe
Submit-Form "/forms/newsletter" @{
    email = "newsletter_test$rand@example.com"
} "Newsletter Subscribe"

# 12. Vendor Registration
Submit-Form "/forms/vendor-registration" @{
    businessName = "Acme Goods Co."
    contactPerson = "Edward Elric"
    email = "edward$rand@example.com"
    phone = "8887776665"
    productCategory = "Concessions & Snacks"
    message = "Interested in supplying organic popcorn."
} "Vendor Registration"

# 13. Franchise Inquiry (Specific Route)
Submit-Form "/forms/franchise-inquiry" @{
    fullName = "Franchise Prospect $rand"
    email = "franchise_inq$rand@example.com"
    phone = "7776665554"
    state = "New York"
    city = "Buffalo"
    preferredInvestment = "2Cr - 5Cr"
    preferredCity = "Rochester"
    hasProperty = "Yes"
    timeframe = "6 Months"
    message = "Requesting information pack."
} "Franchise Inquiry (Specific Route)"

# 14. Consultant Booking
Submit-Form "/forms/consultant-booking" @{
    fullName = "Dr. Susan Stone"
    email = "susan$rand@example.com"
    phone = "6665554443"
    appointmentDate = "2026-07-20"
    subject = "Cinema Interior Design consultation"
    message = "Seeking custom acoustic treatment consulting."
} "Consultant Booking"

# 15. Career Application
Submit-Form "/forms/career-application" @{
    fullName = "Jane Doe"
    email = "jane_doe$rand@example.com"
    phone = "5554443332"
    position = "Operations Manager"
    experience = "5 years in theater management"
    cvUrl = "https://example.com/resumes/janedoe.pdf"
    coverLetter = "I would love to join the Connplex Cinemas team."
} "Career Application"

# 16. General Inquiry
Submit-Form "/forms/general-inquiry" @{
    fullName = "John Smith"
    email = "john_smith$rand@example.com"
    phone = "4443332221"
    subject = "Partnership Proposal"
    message = "We would like to discuss co-branding opportunities."
} "General Inquiry"

