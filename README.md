# AuraCode Studio - E-Commerce Platform

A full-featured e-commerce platform for programming tools, courses, templates, and hosting services.

## Admin Credentials

### Primary Admin Account
- **Email:** `admin@auracode.studio`
- **Password:** `admin123`
- **Role:** System Administrator
- **Permissions:** Full access to all features

### Secondary Admin Account (Manager)
- **Email:** `manager@auracode.studio`
- **Password:** `manager2024`
- **Role:** Store Manager
- **Permissions:** Full admin access, can add other admins

### Demo Customer Account
- **Email:** `customer@example.com`
- **Password:** `customer123`
- **Role:** Customer
- **Permissions:** Browse products, add to cart, checkout, view order history

## Features

### Multi-Language Support
- **English** (Default)
- **العربية** (Arabic) with full RTL (Right-to-Left) support
- Language switcher in the navigation bar
- All content fully translated

### For Customers
- Browse products by category
- Search products
- Add to cart
- Checkout with payment form
- View order history
- Manage profile and addresses
- Switch between English and Arabic

### For Admins
- **Dashboard:** View sales statistics, recent orders, low stock alerts
- **Product Management:** Add, edit, delete products
- **User Management:** Add, edit, delete users (including new admins)
- **Order Management:** View all orders and their status
- **Site Settings:** Edit website configuration without code changes
- **Database Reset:** Reset to default values if needed

## Admin Panel Access

1. Log in with admin credentials
2. Scroll down to the "Admin Panel" section
3. Or navigate directly to `#admin` in the URL

## Site Settings You Can Edit

From the Admin Panel, you can edit:

### General Settings
- Site Name
- Site Description
- Contact Email
- Contact Phone

### Commerce Settings
- Currency (default: USD)
- Currency Symbol (default: $)
- Tax Rate
- Shipping Fee
- Free Shipping Threshold

### Feature Toggles
- Enable/Disable User Registration
- Enable/Disable Shopping Cart
- Enable/Disable Product Reviews

## Database

The application uses IndexedDB for client-side storage:
- **Products:** All product information
- **Users:** User accounts and credentials
- **Orders:** Order history
- **Cart:** Shopping cart items
- **SiteSettings:** Website configuration

### Reset Database

If you need to reset the database to default values:

1. Go to Admin Panel
2. Click "Reset DB" button
3. Confirm the action

**Warning:** This will delete all data and restore default values!

## Adding a New Admin

1. Log in as an existing admin
2. Go to Admin Panel → Users tab
3. Click "Add User"
4. Fill in the details
5. Set Role to "Admin"
6. Save

The new admin can now log in with the provided credentials.

## Technology Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** GSAP + ScrollTrigger
- **Database:** IndexedDB (client-side)
- **State Management:** React Context

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site is built as a static website and can be deployed to any static hosting service.

## Support

For support, contact: hello@auracode.studio
