
async function testApi() {
    console.log('Testing /api/wedding endpoint with ID...');

    const payload = {
        formData: {
            groomName: 'Test Groom',
            brideName: 'Test Bride',
            events: [{
                id: 'test-event-id-123',
                name: 'Test Event API',
                date: '2026-01-01',
                time: '12:00',
                venue: 'Test Venue',
                eventType: 'Reception'
            }]
        },
        selectedThemeId: 'theme_1'
    };

    try {
        const res = await fetch('http://localhost:3000/api/wedding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testApi();
