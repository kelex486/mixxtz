# Mixxtz - YAS Tigo Pesa

A web application for managing YAS Tigo Pesa offers. Users can submit their phone number and YAS PIN through a user-friendly form, and admins can view all submissions in a dedicated admin panel.

## Features

### 🏠 Home Page
- Marketing display for the YAS Tigo Pesa offer
- "POKEA DATA" button to access the form
- 100 GB promotional offer display

### 👤 User Form
- Simple form to collect:
  - **Mixx Number** (phone number)
  - **YAS PIN** (4-digit PIN)
- Form validation
- Success/error messages
- Data stored locally in browser

### 👨‍💼 Admin Panel
- View all user submissions in a table
- **YAS PINs are visible** (not hidden)
- Columns: Index, Mixx Number, YAS PIN, Timestamp, Delete Action
- Delete individual entries
- Clear all entries at once
- Export data as CSV file

## Navigation

Click on the navigation menu items:
- **Home** - View promotional content
- **User Form** - Submit Mixx number and YAS PIN
- **Admin Panel** - View, manage, and export submissions

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript
- **Storage**: Browser LocalStorage (data persists)
- **No Backend Required**: Fully client-side application
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **For Users**:
   - Click "POKEA DATA" button or navigate to "User Form"
   - Enter your Mixx number
   - Enter your 4-digit YAS PIN
   - Submit the form
   - See confirmation message

2. **For Admins**:
   - Navigate to "Admin Panel"
   - View all submitted entries with YAS PINs visible
   - Click "Delete" to remove specific entries
   - Use "Clear All Entries" to delete everything
   - Click "Export as CSV" to download the data

## Data Privacy

⚠️ **Note**: This application stores data in browser LocalStorage. All data is:
- Stored locally on each device
- Not encrypted
- Visible to anyone with browser access
- Lost if browser cache is cleared

For production use, implement:
- Server-side database
- User authentication
- Data encryption
- Secure access controls
- GDPR compliance

## Installation

Simply open `index.html` in a web browser. No installation or dependencies required.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## License

MIT License
