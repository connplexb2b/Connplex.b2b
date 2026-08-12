const path = require('path');
const fs = require('fs').promises;

const DATA_PATH = path.join(__dirname, '..', 'data', 'admin-investors.json');

async function readInvestors() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('read error:', e);
    return [];
  }
}

async function writeInvestors(investors) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(investors, null, 2), 'utf-8');
}

async function updateInvestor(id, data) {
  const investors = await readInvestors();
  const index = investors.findIndex((e) => e.id === id);
  if (index === -1) {
    console.log('investor not found');
    return null;
  }

  const investor = investors[index];
  if (data.title !== undefined) investor.title = data.title.trim();
  if (data.type !== undefined) investor.type = data.type;
  if (data.parent !== undefined) investor.parent = data.parent.trim();
  investor.updatedAt = new Date().toISOString();

  investors[index] = investor;
  await writeInvestors(investors);
  return investor;
}

async function run() {
  try {
    console.log('Testing updateInvestor...');
    const result = await updateInvestor('4887120f-272d-4780-852b-9620e1f4e1ef', {
      title: 'other Annoucment',
      type: 'pdf',
      parent: 'Announcements'
    });
    console.log('Result:', result);
  } catch (err) {
    console.error('Error during test:', err);
  }
}

run();
