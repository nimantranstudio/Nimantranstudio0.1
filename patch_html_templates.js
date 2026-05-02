const fs = require('fs');
const path = require('path');
const dir = 'public/Image/bundle';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const replaceMap = [
    { regex: /(<div[^>]*?>)\s*(We are pleased to invite you[\s\S]*?to the wedding of|Join at the mehend[h]?i event[\s\S]*?|Bless the couple with showers[\s\S]*?|Join us to turn up the volume[\s\S]*?|Request the honor of your presence[\s\S]*?)\s*(<\/div>)/i, id: 'welcome-message' },
    { regex: /(<div[^>]*?>)\s*(Anjali ke haldi|Anjali ke mehendhi|Anjali's Sangeet|to celebrate the wedding of)\s*(<\/div>)/i, id: 'event-name' },
    { regex: /(<div[^>]*?>)\s*(Anjali)\s*(<\/div>)/i, id: 'bride-name' },
    { regex: /(<div[^>]*?>)\s*(Rahul)\s*(<\/div>)/i, id: 'groom-name' },
    { regex: /(<div[^>]*?>)\s*(Son of Mr and Mrs Bajaj)\s*(<\/div>)/i, id: 'groom-parents' },
    { regex: /(<div[^>]*?>)\s*(Daughter of Mr and Mrs Patel)\s*(<\/div>)/i, id: 'bride-parents' },
    { regex: /(<div[^>]*?>)\s*(14th February 2026|16th February 2026|16th February)\s*(<\/div>)/i, id: 'event-date' },
    { regex: /(<div[^>]*?>)\s*(6:30 pm)\s*(<\/div>)/i, id: 'event-time' },
    { regex: /(<div[^>]*?>)\s*(The Rajputana palace,?\s*(?:<br\/>|\n)*\s*Adarsh Nagar, Rajasthan|The Rajputana palace,)\s*(<\/div>)/i, id: 'event-venue' },
    { regex: /(<div[^>]*?>)\s*(Adarsh Nagar, Rajasthan)\s*(<\/div>)/i, id: 'event-venue-2' }
  ];

  replaceMap.forEach(rm => {
    if (rm.regex.test(content) && !content.includes('id="' + rm.id + '"')) {
      content = content.replace(rm.regex, (match, p1, p2, p3) => {
        if (p1.includes('id=')) return match;
        const newP1 = p1.replace('<div', '<div id="' + rm.id + '"');
        return newP1 + p2 + p3;
      });
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched ' + f);
  }
});
