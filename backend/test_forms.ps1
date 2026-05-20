$baseUrl = "http://localhost:5000/api"

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
    email = "alice@example.com"
    phone = "9876543210"
    company = "Google DeepMind"
    message = "Looking forward to hosting our annual conference."
} "Book Event"

# 2. Conn Events Waitlist
Submit-Form "/forms/connevents-waitlist" @{
    email = "connevents_test@example.com"
} "Conn Events Waitlist"

# 3. Connflix Notify
Submit-Form "/forms/connflix-subscribers" @{
    email = "connflix_test@example.com"
} "Connflix Notify"

# 4. Connmusic Waitlist
Submit-Form "/forms/connmusic-waitlist" @{
    email = "connmusic_test@example.com"
} "Connmusic Waitlist"

# 5. Connplex Studio Invite
Submit-Form "/forms/studio-invitations" @{
    name = "Bob Martin"
    email = "bob@example.com"
} "Connplex Studio Invite"

# 6. Contact Form
Submit-Form "/forms/contact-messages" @{
    fullName = "Charlie Brown"
    email = "charlie@example.com"
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
    email = "downtown_vip@example.com"
    consent = $true
} "Downtown VIP Invite"

# 8. Franchise Inquiry
Submit-Form "/forms/franchise-applications" @{
    fullName = "David Green"
    email = "david@example.com"
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
    email = "purex_test@example.com"
} "Pure-X Subscribe"

# 10. Sky-Inn VIP Reservation
Submit-Form "/forms/skyinn-reservations" @{
    email = "skyinn_test@example.com"
} "Sky-Inn VIP Reservation"
