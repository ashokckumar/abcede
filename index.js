const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
 
app.get('/', (req, res) => res.send('Hello from Node.js app!'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
 
// Only start server if file is run directly (keeps tests clean)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}
 
module.exports = app;

