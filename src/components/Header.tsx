import Logo from "@/components/Logo";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Phone, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const FlipLink = ({
  children,
  hasDropdown,
  href,
  isRoute,
  onClick,
  isActive,
  isDark = false
}: {
  children: string;
  hasDropdown?: boolean;
  href: string;
  isRoute?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  isDark?: boolean;
}) => {
  const content = <>
    <span className={`block transition-transform duration-300 group-hover:-translate-y-full ${isDark ? 'text-white' : 'text-muted-foreground'}`}>
      {children}
    </span>
    <span className={`absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 ${isDark ? 'text-white' : 'text-muted-foreground'}`}>
      {children}
    </span>
    {hasDropdown && <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 ${isActive ? 'rotate-180' : ''} ${isDark ? 'text-white' : 'text-muted-foreground'} `} />}
  </>;
  if (hasDropdown) {
    return <button onClick={onClick} className={`group relative overflow-hidden flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors duration-300 font-bold h-6`}>
      {content}
    </button>;
  }
  if (isRoute) {
    return <Link to={href} className={`group relative overflow-hidden flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors duration-300 font-bold h-6`}>
      {content}
    </Link>;
  }
  return <a href={href} className={`group relative overflow-hidden flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors duration-300 font-bold h-6`}>
    {content}
  </a>;
};
const DropdownFlipLink = ({
  children,
  href,
  onClick,
  isDark = false
}: {
  children: string;
  href: string;
  onClick?: () => void;
  isDark?: boolean;
}) => {
  return <Link to={href} onClick={onClick} className="group relative overflow-hidden flex items-center text-primary hover:text-primary transition-colors duration-300 font-medium h-6">
    <span className={`block transition-transform duration-300 group-hover:-translate-y-full ${isDark ? 'text-muted-foreground' : 'text-white'}`}>
      {children}
    </span>
    <span className={`absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 ${isDark ? 'text-muted-foreground' : 'text-white'}`}>
      {children}
    </span>
  </Link>;
};
const FlipButton = ({
  children,
  isDark = false,
  props
}: {
  children: React.ReactNode;
  isDark?: boolean;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) => {
  return <Button variant="nav-cta" size="default" className={`group relative overflow-hidden ${isDark ? '' : 'bg-background border-secondary text-foreground'}`} {...props}>
    <span className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
      {children}
    </span>
    <span className="absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
      {children}
    </span>
  </Button>;
};
const Header = ({
  isDark = false
}: {
  isDark?: boolean;
}) => {
  const { t } = useTranslation();

  const navLinks = [{
    name: t("common.nav.home"),
    href: "/",
    isRoute: true
  }, {
    name: t("common.nav.about"),
    href: "/about",
    isRoute: true
  }, {
    name: t("common.nav.services"),
    href: "/services",
    isRoute: true
  }, {
    name: t("common.nav.work"),
    href: "/work",
    isRoute: true
  }, {
    name: t("common.nav.blog"),
    href: "/blog",
    isRoute: true
  }, {
    name: t("common.nav.pages"),
    href: "#",
    hasDropdown: true
  }];
  const pagesDropdownLinks = [{
    column: 1,
    links: [{
      name: t("common.nav.home"),
      href: "/"
    }, {
      name: t("common.nav.services"),
      href: "/services"
    }, {
      name: t("common.nav.serviceDetail"),
      href: "/services"
    }, {
      name: t("common.nav.work"),
      href: "/work"
    }, {
      name: t("common.nav.workDetail"),
      href: "/work"
    }]
  }, {
    column: 2,
    links: [{
      name: t("common.nav.about"),
      href: "/about"
    }, {
      name: t("common.nav.careers"),
      href: "/career"
    }, {
      name: t("common.nav.blog"),
      href: "/blog"
    }, {
      name: t("common.nav.blogArticle"),
      href: "/blog"
    }, {
      name: t("common.nav.contact"),
      href: "/contact"
    }]
  }, {
    column: 3,
    links: [{
      name: t("common.nav.pricing"),
      href: "/pricing"
    }, {
      name: t("common.nav.privacy"),
      href: "/privacy-policy"
    }, {
      name: t("common.nav.quote"),
      href: "/quote"
    }]
  }];

  const [isOpen, setIsOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isMobilePagesOpen, setIsMobilePagesOpen] = useState(false);

  // Smart header state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add shadow/background if scrolled past top
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine scroll direction (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
        // Also close dropdowns when hiding header
        setIsPagesDropdownOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navigate = useLocalizedNavigate();
  const handlePagesClick = () => {
    setIsPagesDropdownOpen(!isPagesDropdownOpen);
  };
  const closeDropdown = () => {
    setIsPagesDropdownOpen(false);
  };

  const { user, loading, signOut } = useAuth();
  const { data: profile } = useUserProfile(user?.id);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return (
    <>
      {/* Placeholder to prevent layout shift since header is fixed */}
      <div className="h-20 w-full shrink-0" />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-surface-dark/75 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-0"
            : `py-2 backdrop-blur-sm ${isDark ? 'bg-primary/0' : 'bg-background'}`
        }`}
        style={isScrolled ? { WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)" } : {}}
      >
        <div className="container">
          <div className="flex items-center justify-between gap-4 h-20">
        <Link to="/" className="shrink-0">
          <Logo isDark={isDark} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 shrink-0">
          {navLinks.map(link => <FlipLink key={link.name} hasDropdown={link.hasDropdown} href={link.href} isRoute={link.isRoute} onClick={link.hasDropdown ? handlePagesClick : undefined} isActive={link.hasDropdown && isPagesDropdownOpen} isDark={isDark}>
            {link.name}
          </FlipLink>)}
        </nav>
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <LanguageSwitcher isDark={isDark} />
          <ThemeToggle isDark={isDark} />
          {/* CTA Button & Cart */}
          <a href={site.phoneHref} className="hidden xl:flex">
            <FlipButton isDark={isDark}>
              <Phone className="h-4 w-4" />
              {site.phone}</FlipButton>
          </a>
          <div className="hidden grow items-center justify-end gap-6 lg:flex">
            {!user ? (
              <FlipButton
                isDark={isDark}
                props={{
                  onClick: () => navigate("/auth"),

                }}
              >
                {t("common.header.login")}
              </FlipButton>
            ) : (
              <HoverCard
                openDelay={0}
              >
                <HoverCardTrigger asChild>
                  <div
                    className="group relative flex items-center gap-0.5 rounded-xl"
                  >
                    <Avatar className="size-9 cursor-pointer shadow-sm">
                      <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} className="object-cover" />
                      <AvatarFallback className={`${isDark ? "bg-accent" : "bg-primary text-primary-foreground"}`}>
                        {user.email?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex h-full min-h-9 cursor-pointer items-center rounded-sm ${isDark ? "group-hover:bg-primary/80" : "group-hover:bg-muted"}`}
                    >
                      <ChevronDown className={`${isDark ? "text-white" : "text-foreground"} size-4`} />
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  align="end"
                  className={`box-shadow bg-surface-dark min-w-65 rounded-lg border p-2 ${isDark
                    ? "border-gray/20 "
                    : "border-gray"
                    }`}
                >
                  <div className="flex flex-col gap-1">
                    <div
                      className="flex items-center gap-3 rounded-[10px] p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Avatar className="size-10 min-h-10 min-w-10 shadow-sm border border-white/20">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email?.slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <div className="flex flex-col gap-1">
                          <span
                            className="max-w-45 truncate leading-6.5 font-medium text-white"
                          >
                            {profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0]}
                          </span>
                          <span
                            className="max-w-45 truncate text-sm leading-6 text-white/70"
                          >
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`m-[1.5px] h-px w-full bg-white/20`}
                    />
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 rounded-[10px] p-2 hover:bg-white/10`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <LayoutDashboard className={`mr-2 h-4 w-4 text-white`} />
                      <span
                        className="cursor-pointer text-sm leading-5 tracking-[-0.084px] text-white"
                      >
                        {t("common.header.dashboard")}
                      </span>
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className={`flex items-center gap-2 rounded-[10px] p-2 hover:bg-white/10`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <User className={`mr-2 h-4 w-4 text-white`} />
                      <span
                        className="cursor-pointer text-sm leading-5 tracking-[-0.084px] text-white"
                      >
                        {t("common.header.profile")}
                      </span>
                    </Link>
                    <div
                      className={`m-[1.5px] h-px w-full bg-white/20`}
                    />
                    <button
                      className="flex items-center gap-2 rounded-[10px] p-2 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2 size-4 text-white" />
                      <span
                        className="text-sm leading-5 tracking-tight text-white"
                      >
                        {t("common.header.logout")}
                      </span>
                    </button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>


        {/* Mobile Menu Button */}
        <button className={`lg:hidden ${isDark ? 'text-white' : 'text-muted-foreground'}`} onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>

    {/* Pages Dropdown - Desktop only */}
    <div className={`hidden lg:block absolute left-1/2 -translate-x-1/2 top-[80px] rounded-b-xl shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isPagesDropdownOpen ? 'opacity-100 pointer-events-auto max-h-[500px]' : 'opacity-0 pointer-events-none max-h-0'} ${isDark ? "bg-white" : "bg-surface-dark"}`} style={{
      width: '600px'
    }}>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-x-12 gap-y-4">
          {pagesDropdownLinks.map(column => <div key={column.column} className="flex flex-col gap-4">
            {column.links.map(link => <DropdownFlipLink key={link.name} href={link.href} onClick={closeDropdown} isDark={isDark}>
              {link.name}
            </DropdownFlipLink>)}
          </div>)}
        </div>
      </div>
    </div>

    {/* Mobile Navigation Drawer */}
    {/* Backdrop */}
    <div
      className={`lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-md transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsOpen(false)}
      style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
    />

    <div
      className={`lg:hidden fixed top-0 right-0 h-[100dvh] w-[85vw] sm:w-[350px] bg-surface-dark shadow-2xl z-[70] transform transition-transform duration-500 ease-out flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
        <Logo isDark={true} />
        <button
          className="text-white hover:text-accent transition-colors p-2 -mr-2"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        <nav className="flex flex-col gap-4">
          {navLinks.map((link, index) => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.name}
                  className={`transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: `${100 + index * 50}ms` }}
                >
                  <button
                    onClick={() => setIsMobilePagesOpen(!isMobilePagesOpen)}
                    className="w-full flex items-center justify-between text-white hover:text-accent transition-colors duration-300 text-xl font-medium"
                  >
                    {link.name}
                    <ChevronDown className={`h-5 w-5 opacity-50 transition-transform duration-300 ${isMobilePagesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mobile Submenu Accordion */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobilePagesOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 border-l border-white/20 flex flex-col gap-4 py-2">
                      {pagesDropdownLinks.map((col) =>
                        col.links.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.href}
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-accent transition-colors duration-300 text-lg font-medium"
                          >
                            {subLink.name}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={link.name}
                className={`transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                style={{ transitionDelay: `${100 + index * 50}ms` }}
              >
                {link.isRoute ? (
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-white hover:text-accent transition-colors duration-300 text-xl font-medium"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-white hover:text-accent transition-colors duration-300 text-xl font-medium"
                  >
                    {link.name}
                  </a>
                )}
              </div>
            );
          })}
        </nav>

        {/* Language & Theme */}
        <div className="mt-6 pt-6 flex items-center justify-between border-t border-white/10 shrink-0">
          <LanguageSwitcher isDark className="scale-110" />
          <ThemeToggle isDark />
        </div>

        {/* Drawer Footer Actions */}
        <div className="mt-6 pt-6 flex flex-col gap-3 border-t border-white/10 shrink-0 pb-4">
          <div className={`transform transition-all duration-500 ease-out delay-500 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <a href={site.phoneHref} className="w-full block" onClick={() => setIsOpen(false)}>
              <Button variant="accent" size="lg" className="w-full text-base h-12 rounded-full">
                <Phone className="h-4 w-4 mr-2" />
                {site.phone}
              </Button>
            </a>
          </div>

          <div
            className={`transform transition-all duration-500 ease-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            style={{ transitionDelay: '550ms' }}
          >
            {!user ? (
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base h-12 rounded-full text-white border-white/30 hover:bg-white/10 hover:border-white"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/auth");
                }}
              >
                {t("common.header.login")}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base h-12 rounded-full text-white border-white/30 hover:bg-white/10 hover:border-white"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                {t("common.header.mySpace")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Backdrop to close dropdown */}
    {isPagesDropdownOpen && <div className="fixed inset-0 z-[-1]" onClick={closeDropdown} />}
  </header>
  </>
  );
};
export default Header;
