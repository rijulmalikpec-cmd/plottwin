import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

5. Click **Commit new file** (green button at bottom)

---

### **STEP 2: VERIFY YOUR FILE STRUCTURE**

After adding `index.js`, your repo should have:
```
plottwin/
├── package.json          ✅
├── public/
│   └── index.html       ✅
└── src/
    ├── index.js         ✅ YOU JUST ADDED THIS
    └── App.jsx          ✅

