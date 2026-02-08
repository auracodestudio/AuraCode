import { db } from './database';
import type { Product, User, SiteSettings } from '@/types';

// Default admin account
export const defaultAdmin: User = {
  id: 'admin-001',
  email: 'admin@auracode.studio',
  password: 'admin123', // In production, this should be hashed
  name: 'System Administrator',
  role: 'admin',
  createdAt: new Date().toISOString(),
  avatar: null,
};

// Secondary admin account (from readme)
export const secondaryAdmin: User = {
  id: 'admin-002',
  email: 'manager@auracode.studio',
  password: 'manager2024', // In production, this should be hashed
  name: 'Store Manager',
  role: 'admin',
  createdAt: new Date().toISOString(),
  avatar: null,
};

// Demo customer account
export const demoCustomer: User = {
  id: 'customer-001',
  email: 'customer@example.com',
  password: 'customer123',
  name: 'John Doe',
  role: 'customer',
  createdAt: new Date().toISOString(),
  avatar: null,
};

// Initial products
export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'VS Code Pro Extension Pack',
    description: 'A comprehensive collection of 50+ premium VS Code extensions for professional developers. Includes advanced IntelliSense, debugging tools, code formatting, and productivity boosters.',
    price: 49.99,
    originalPrice: 99.99,
    image: '/product_vscode.jpg',
    category: 'tools',
    tags: ['IDE', 'Productivity', 'Extensions'],
    stock: 1000,
    rating: 4.8,
    reviewCount: 234,
    features: ['50+ premium extensions', 'Lifetime updates', 'Priority support', 'Team licensing available'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Git Mastery Course',
    description: 'Master Git and GitHub with this comprehensive course. From basics to advanced workflows, learn branching strategies, rebasing, and collaborative development.',
    price: 79.99,
    originalPrice: 149.99,
    image: '/product_git.jpg',
    category: 'courses',
    tags: ['Git', 'Version Control', 'Course'],
    stock: 500,
    rating: 4.9,
    reviewCount: 567,
    features: ['40+ hours of content', 'Hands-on exercises', 'Certificate of completion', 'Lifetime access'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'React Dashboard Pro Template',
    description: 'A premium React dashboard template with 100+ components, dark/light modes, and full TypeScript support. Built with Tailwind CSS and shadcn/ui.',
    price: 129.99,
    originalPrice: 199.99,
    image: '/product_react_dashboard.jpg',
    category: 'templates',
    tags: ['React', 'Template', 'Dashboard'],
    stock: 200,
    rating: 4.7,
    reviewCount: 189,
    features: ['100+ components', 'TypeScript support', 'Dark/Light modes', 'Responsive design'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Cloud VPS Starter',
    description: 'High-performance virtual private server with SSD storage, 99.9% uptime guarantee, and 24/7 support. Perfect for small to medium applications.',
    price: 19.99,
    image: '/product_vps.jpg',
    category: 'hosting',
    tags: ['VPS', 'Cloud', 'Hosting'],
    stock: 100,
    rating: 4.6,
    reviewCount: 423,
    features: ['2 vCPU cores', '4GB RAM', '80GB SSD storage', '2TB bandwidth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Cloud VPS Professional',
    description: 'Powerful VPS for demanding applications. Includes dedicated resources, DDoS protection, and automated backups.',
    price: 49.99,
    image: '/product_vps_pro.jpg',
    category: 'hosting',
    tags: ['VPS', 'Cloud', 'Enterprise'],
    stock: 50,
    rating: 4.8,
    reviewCount: 312,
    features: ['4 vCPU cores', '16GB RAM', '200GB SSD storage', '5TB bandwidth', 'DDoS protection'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Dedicated Server Enterprise',
    description: 'Bare-metal dedicated server with full hardware control. Ideal for high-traffic applications and resource-intensive workloads.',
    price: 199.99,
    image: '/product_dedicated.jpg',
    category: 'hosting',
    tags: ['Dedicated', 'Enterprise', 'Server'],
    stock: 20,
    rating: 4.9,
    reviewCount: 156,
    features: ['8 CPU cores', '64GB RAM', '1TB NVMe SSD', '10TB bandwidth', 'IPMI access'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Full Stack Web Development Bootcamp',
    description: 'Comprehensive 12-week bootcamp covering frontend, backend, and DevOps. Learn React, Node.js, databases, and deployment strategies.',
    price: 299.99,
    originalPrice: 599.99,
    image: '/product_bootcamp.jpg',
    category: 'courses',
    tags: ['Bootcamp', 'Full Stack', 'Course'],
    stock: 100,
    rating: 4.9,
    reviewCount: 892,
    features: ['12 weeks intensive', 'Live mentoring', 'Real projects', 'Job placement support'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Python for Data Science',
    description: 'Master Python for data analysis, visualization, and machine learning. Includes pandas, NumPy, Matplotlib, and scikit-learn.',
    price: 89.99,
    originalPrice: 179.99,
    image: '/product_python.jpg',
    category: 'courses',
    tags: ['Python', 'Data Science', 'ML'],
    stock: 300,
    rating: 4.7,
    reviewCount: 445,
    features: ['30+ hours content', 'Jupyter notebooks', 'Real datasets', 'Certificate included'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'API Testing Suite Pro',
    description: 'Professional API testing and documentation tool. Supports REST, GraphQL, and WebSocket testing with automated test generation.',
    price: 59.99,
    originalPrice: 119.99,
    image: '/product_api.jpg',
    category: 'tools',
    tags: ['API', 'Testing', 'Development'],
    stock: 400,
    rating: 4.5,
    reviewCount: 278,
    features: ['REST & GraphQL support', 'Automated testing', 'Team collaboration', 'CI/CD integration'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'Docker & Kubernetes Mastery',
    description: 'Learn containerization and orchestration from scratch. Build, deploy, and scale applications with Docker and Kubernetes.',
    price: 99.99,
    originalPrice: 199.99,
    image: '/product_docker.jpg',
    category: 'courses',
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    stock: 250,
    rating: 4.8,
    reviewCount: 334,
    features: ['25+ hours content', 'Hands-on labs', 'Production scenarios', 'Certification prep'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    name: 'E-commerce Starter Kit',
    description: 'Complete e-commerce template with cart, checkout, and payment integration. Built with Next.js, Stripe, and Tailwind CSS.',
    price: 149.99,
    originalPrice: 249.99,
    image: '/product_ecommerce.jpg',
    category: 'templates',
    tags: ['E-commerce', 'Next.js', 'Template'],
    stock: 150,
    rating: 4.6,
    reviewCount: 198,
    features: ['Full e-commerce flow', 'Stripe integration', 'Admin dashboard', 'SEO optimized'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    name: 'Portfolio Website Template',
    description: 'Stunning portfolio template for developers and designers. Includes project showcase, blog, and contact form.',
    price: 39.99,
    originalPrice: 79.99,
    image: '/product_portfolio.jpg',
    category: 'templates',
    tags: ['Portfolio', 'Website', 'Template'],
    stock: 500,
    rating: 4.7,
    reviewCount: 567,
    features: ['Multiple layouts', 'Dark/Light mode', 'CMS integration', 'Fast loading'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-13',
    name: 'SEO Optimizer Plugin',
    description: 'Automated SEO optimization plugin for any website. Analyzes content, suggests improvements, and tracks rankings.',
    price: 29.99,
    originalPrice: 59.99,
    image: '/product_seo.jpg',
    category: 'plugins',
    tags: ['SEO', 'Plugin', 'Marketing'],
    stock: 800,
    rating: 4.4,
    reviewCount: 223,
    features: ['Content analysis', 'Keyword suggestions', 'Rank tracking', 'Competitor analysis'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-14',
    name: 'Security Scanner Pro',
    description: 'Automated security vulnerability scanner for web applications. Detects XSS, SQL injection, and other common threats.',
    price: 79.99,
    originalPrice: 149.99,
    image: '/product_security.jpg',
    category: 'plugins',
    tags: ['Security', 'Scanner', 'Protection'],
    stock: 300,
    rating: 4.8,
    reviewCount: 178,
    features: ['Vulnerability detection', 'Automated scans', 'Detailed reports', 'Remediation guides'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Default site settings
export const defaultSiteSettings: SiteSettings = {
  id: 'settings-001',
  siteName: 'AuraCode Studio',
  siteDescription: 'Premium programming tools, courses, and hosting services for developers',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primaryColor: '#9BFF1E',
  darkMode: true,
  enableRegistration: true,
  enableCart: true,
  enableReviews: true,
  currency: 'USD',
  currencySymbol: '$',
  taxRate: 0,
  shippingFee: 0,
  freeShippingThreshold: 100,
  contactEmail: 'hello@auracode.studio',
  contactPhone: '+1 (555) 123-4567',
  socialLinks: {
    twitter: 'https://twitter.com/auracode',
    github: 'https://github.com/auracode',
    linkedin: 'https://linkedin.com/company/auracode',
    discord: 'https://discord.gg/auracode',
  },
  seo: {
    title: 'AuraCode Studio - Programming Tools & Hosting',
    description: 'Your one-stop shop for programming tools, courses, templates, and cloud hosting services.',
    keywords: ['programming', 'coding', 'web development', 'hosting', 'courses', 'templates'],
  },
  heroSection: {
    title: 'We build brands and products that feel alive.',
    subtitle: 'Strategy, design, and engineering—crafted as one system.',
    ctaText: 'Start a project',
    ctaLink: '#contact',
    secondaryCtaText: 'View selected work',
    secondaryCtaLink: '#work',
    backgroundImage: null,
  },
  footer: {
    copyright: '© 2024 AuraCode Studio. All rights reserved.',
    links: [
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Terms of Service', url: '/terms' },
      { label: 'Refund Policy', url: '/refund' },
    ],
  },
  updatedAt: new Date().toISOString(),
};

// Initialize database with seed data
export async function seedDatabase(): Promise<void> {
  await db.init();

  // Seed users if empty
  const usersEmpty = await db.isEmpty('users');
  if (usersEmpty) {
    console.log('Seeding users...');
    await db.add('users', defaultAdmin);
    await db.add('users', secondaryAdmin);
    await db.add('users', demoCustomer);
  }

  // Seed products if empty
  const productsEmpty = await db.isEmpty('products');
  if (productsEmpty) {
    console.log('Seeding products...');
    for (const product of initialProducts) {
      await db.add('products', product);
    }
  }

  // Seed site settings if empty
  const settingsEmpty = await db.isEmpty('siteSettings');
  if (settingsEmpty) {
    console.log('Seeding site settings...');
    await db.add('siteSettings', defaultSiteSettings);
  }

  console.log('Database seeding complete!');
}

// Reset database (for testing)
export async function resetDatabase(): Promise<void> {
  await db.clear('users');
  await db.clear('products');
  await db.clear('orders');
  await db.clear('cart');
  await db.clear('siteSettings');
  await seedDatabase();
}
