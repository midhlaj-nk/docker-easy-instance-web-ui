# 🚀 Easy Instance Frontend - How to Use

## **Navigation Flow**

### **Step 1: Start from Dashboard**
1. Navigate to `http://localhost:3000/dashboard`
2. You'll see all your instances displayed as cards

### **Step 2: Select an Instance**
1. **Click any instance card** on the dashboard
2. This will:
   - Store the instance data in Zustand (persisted to localStorage)
   - Navigate you to the `/metrics` page for that instance

### **Step 3: Navigate to Other Pages**
Once an instance is selected, you can navigate to any of these pages via the sidebar:

- **Metrics Panel** - View instance metrics and open Grafana
- **Resource Monitor** - Opens Grafana dashboard with resource monitoring
- **Logs** - Real-time log streaming with ANSI colors
- **Git Manager** - GitHub repository management
- **Backup** - Create, restore, and manage backups
- **Shell** - Web-based terminal access
- **Subscriptions** - View and manage subscription plans
- **Domain Management** - Configure custom domains and SSL
- **Settings** - Instance configuration and deletion

---

## **Important: Instance Selection is Required!**

❌ **This Won't Work:**
- Going directly to `http://localhost:3000/logs` without selecting an instance first
- Bookmarking instance-specific pages
- Refreshing after clearing localStorage

✅ **This Works:**
1. Go to `/dashboard`
2. Click an instance card
3. Navigate to any page via sidebar
4. Instance selection persists even after page refresh!

---

## **How Instance Selection Works**

### **The Flow:**
```
Dashboard → Click Instance Card → Zustand Store → localStorage → All Pages
```

### **What Gets Stored:**
```javascript
{
  id: 123,
  name: "my-instance",
  instance: "my-instance",
  version: "Odoo 17.0",
  deployed: "2024-01-15",
  uptime: "5 days",
  cpuRequest: "500m",
  memoryRequest: "1Gi",
  storageUsed: "2.5GB",
  status: "deployed",
  logo: "/path/to/logo.png",
  instance_url: "https://my-instance.example.com"
}
```

### **Where It's Used:**
- **InstanceHeader** component shows the selected instance info
- **API calls** use `selectedInstance.id` and `selectedInstance.name`
- **Navigation** persists across page changes
- **localStorage** keeps it even after browser refresh

---

## **Features by Page**

### **📊 Resource Monitor**
- Shows CPU, Memory, Storage, Uptime
- Button to open Grafana dashboard
- Animated metrics visualization

### **📝 Logs**
- Real-time log streaming (auto-refresh every 5s)
- ANSI color support
- Search functionality
- Auto-scroll toggle
- Clear logs button

### **⚙️ Settings**
- View instance information
- Change user count (affects pricing)
- Delete instance (with confirmation)

### **🌐 Domain Management**
- Add custom subdomains
- Configure apex domains with SSL
- Upload SSL certificates
- View all configured domains

### **💾 Backup**
- List all backups
- Create new backup
- Restore from backup
- Delete backups
- View backup details (size, date, status)

### **💳 Subscriptions**
- View available plans (Weekly, Monthly, Yearly)
- See pricing and features
- Subscribe to plans

---

## **Dark Mode**

Toggle dark mode using the sun/moon icon in the Navbar!

- **Light Mode**: Clean white interface
- **Dark Mode**: Eye-pleasing dark blue interface
- **Persistence**: Your preference is saved
- **Smooth Transitions**: 300ms duration

---

## **Troubleshooting**

### **Problem: "Redirecting to dashboard..." on all pages**
**Solution**: You haven't selected an instance yet!
1. Go to `/dashboard`
2. Click any instance card
3. Now navigate to other pages

### **Problem: Instance data not showing**
**Solution**: The instance card might not have all data
1. Check if the dashboard loaded properly
2. Verify the API is returning instance data
3. Check browser console for errors

### **Problem: Dark mode not persisting**
**Solution**: localStorage might be cleared
1. Toggle dark mode again
2. Check browser localStorage for `ui-storage`

---

## **For Developers**

### **Adding New Instance-Specific Pages:**

1. Create your page component
2. Wrap it with `withInstanceGuard`:
   ```javascript
   import withInstanceGuard from '../components/withInstanceGuard';
   
   function MyPage({ selectedInstance }) {
     // selectedInstance is automatically passed
     return <div>{selectedInstance.name}</div>;
   }
   
   export default withInstanceGuard(MyPage);
   ```

3. Add the route to the Sidebar component
4. The instance guard will automatically:
   - Check if an instance is selected
   - Redirect to dashboard if not
   - Pass the selectedInstance as a prop

### **Accessing Selected Instance:**
```javascript
// In any component
import { useInstancesStore } from '@/lib/store';

const selectedInstance = useInstancesStore((state) => state.selectedInstance);
```

### **Setting Selected Instance:**
```javascript
// Usually done in InstanceCard.jsx
const { setSelectedInstance } = useInstancesStore.getState();
setSelectedInstance(instanceData);
```

---

## **API Integration**

All API calls use the `selectedInstance` data:

```javascript
// Example from Logs page
fetchPodName(selectedInstance.id);
fetchLogs(selectedInstance.name, podName);

// Example from Settings page
deleteInstance(selectedInstance.id);
```

---

## **Summary**

✅ **Always start from the dashboard**
✅ **Click an instance card to select it**
✅ **Navigate freely after selection**
✅ **Instance persists across refreshes**
✅ **Dark mode available everywhere**
✅ **All pages are instance-aware**

🎉 Enjoy your Easy Instance dashboard!

