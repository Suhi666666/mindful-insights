import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "懂一点 · 闲时学一个理论" },
      {
        name: "description",
        content:
          "随机弹出一个心理学/经济学/社会学理论，像翻卡片一样从浅入深讲给你听，500+ 理论大全 + 学习进度追踪。",
      },
      { property: "og:title", content: "懂一点 · 闲时学一个理论" },
      {
        property: "og:description",
        content: "500+ 跨学科理论库，奶奶都能听懂的讲解 + 学习进度追踪。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TopNav />
      <Outlet />
    </QueryClientProvider>
  );
}

function TopNav() {
  // theme toggle inline to avoid SSR mismatches
  const toggle = () => {
    if (typeof document === "undefined") return;
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme-pref-v1", isDark ? "dark" : "light");
    } catch {
      /* noop */
    }
  };
  return (
    <>
      {/* hydrate theme as early as possible */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme-pref-v1');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}`,
        }}
      />
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-base text-ink">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
            懂一点
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <NavLink to="/">首页</NavLink>
            <NavLink to="/catalog">理论大全</NavLink>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="ml-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-ink-soft transition hover:text-ink"
            >
              <span className="hidden dark:inline">☀️ 浅色</span>
              <span className="inline dark:hidden">🌙 深色</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="rounded-full px-3 py-1.5 text-ink-soft transition hover:text-ink data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
    >
      {children}
    </Link>
  );
}
