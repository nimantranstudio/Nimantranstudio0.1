const fs = require('fs');
const path = require('path');
const dir = 'public/Image/bundle';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const patterns = [
    { text: 'Anjali ke haldi', id: 'event-name' },
    { text: 'Anjali ke mehendhi', id: 'event-name' },
    { text: "Anjali's Sangeet", id: 'event-name' },
    { text: "We are pleased to invite you", id: 'welcome-message', partial: true },
    { text: "Bless the couple with showers", id: 'welcome-message', partial: true },
    { text: "Join at the mehendhi event", id: 'welcome-message', partial: true },
    { text: "Join us to turn up the volume", id: 'welcome-message', partial: true },
    { text: "Request the honor of your presence", id: 'welcome-message', partial: true },
    { text: "Anjali", id: 'bride-name', exact: true },
    { text: "Rahul", id: 'groom-name', exact: true },
    { text: "Son of Mr and Mrs Bajaj", id: 'groom-parents' },
    { text: "Daughter of Mr and Mrs Patel", id: 'bride-parents' },
    { text: "14th February 2026", id: 'event-date' },
    { text: "16th February 2026", id: 'event-date' },
    { text: "16th February", id: 'event-date', exact: true },
    { text: "6:30 pm", id: 'event-time' },
    { text: "The Rajputana palace", id: 'event-venue', partial: true },
    { text: "Adarsh Nagar, Rajasthan", id: 'event-venue-2' },
    { text: "to celebrate the wedding of", id: 'welcome-message' },
    { text: "formal invite to follow", id: 'event-time' } // Hijacking event-time since there is no bottom message field, or just leave it alone
  ];

  patterns.forEach(p => {
    // Find the div containing this text
    const regexStr = '(<div[^>]*?>)\\s*' + p.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '[\\s\\S]*?(<\\/div>)';
    const regex = new RegExp(regexStr, 'i');
    
    if (regex.test(content) && !content.includes('id="' + p.id + '"')) {
      content = content.replace(regex, (match, p1) => {
        if (p1.includes('id=')) return match;
        const newP1 = p1.replace('<div', '<div id="' + p.id + '"');
        return match.replace(p1, newP1);
      });
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched ' + f);
  }
});
