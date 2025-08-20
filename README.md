# Jismya Admin Dashboard

A professional, production-ready admin dashboard built with Next.js 15, featuring modern UI components, dark/light theming, and a scalable architecture.

## ✨ Features

- **Modern Admin Dashboard** - Clean, professional interface with sidebar navigation
- **Dark/Light Theme** - Built-in theme switching with system preference detection
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Component Library** - Comprehensive shadcn/ui components
- **Form Management** - React Hook Form with Zod validation
- **State Management** - React Query for server state management
- **Type Safety** - Full TypeScript support (can be converted from JS)
- **Performance** - Optimized with Next.js 15 features

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod
- **State Management**: React Query (TanStack Query)
- **Theming**: next-themes
- **Icons**: Lucide React
- **Animations**: Framer Motion (ready to integrate)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard overview
│   ├── banners/          # Banner management
│   ├── products/         # Product management
│   ├── orders/           # Order management
│   ├── users/            # User management
│   └── settings/         # Settings & profile
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── services/             # API services
└── types/                # TypeScript types
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jismya-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   DATABASE_URL=your_database_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Pages

- **Dashboard** (`/dashboard`) - Overview with statistics and quick actions
- **Banners** (`/banners`) - Manage website banners for different devices
- **Products** (`/products`) - Product catalog management
- **Orders** (`/orders`) - Order tracking and management
- **Users** (`/users`) - User management and profiles
- **Analytics** (`/analytics`) - Business insights and reports
- **Settings** (`/settings`) - Application configuration

## 🎨 Customization

### Theme Configuration

The dashboard uses CSS custom properties for theming. Customize colors in `src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* Add more custom colors */
}
```

### Component Styling

All components use Tailwind CSS classes and can be customized through the `className` prop or by modifying the component source.

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.jsx` file
3. Use the `DashboardLayout` component
4. Add navigation item to `src/components/layout/sidebar.jsx`

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 📦 Component Usage

### Basic Button
```jsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">
  Click me
</Button>
```

### Card Component
```jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Form with Validation
```jsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

const form = useForm({
  resolver: zodResolver(formSchema),
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Other Platforms

The dashboard is built with standard Next.js and can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Advanced user permissions
- [ ] API documentation
- [ ] Unit and integration tests
- [ ] Performance monitoring
- [ ] Mobile app companion

---

Built with ❤️ using Next.js and shadcn/ui
