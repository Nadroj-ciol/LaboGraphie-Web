import Logo from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  Briefcase,
  DollarSign,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  User,
  Users,
  Settings2
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const adminItems = [
  { title: "Vue d'ensemble", url: "/dashboard", icon: LayoutDashboard },
  { title: "Messages", url: "/dashboard/contacts", icon: Mail },
  { title: "Devis", url: "/dashboard/quotes", icon: DollarSign },
  { title: "Demandes de service", url: "/dashboard/service-inquiries", icon: MessageSquare },
  { title: "Articles", url: "/dashboard/blogs", icon: FileText },
  { title: "Offres d'emploi", url: "/dashboard/careers", icon: Briefcase },
  { title: "Candidatures", url: "/dashboard/applications", icon: Users },
  { title: "Tarifs & Devises", url: "/dashboard/pricing", icon: Settings2 },
  { title: "Profil", url: "/dashboard/profile", icon: User },
];

const userItems = [
  { title: "Vue d'ensemble", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mes devis", url: "/dashboard/my-quotes", icon: DollarSign },
  { title: "Mes demandes", url: "/dashboard/my-inquiries", icon: MessageSquare },
  { title: "Profil", url: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin, loading, signOut } = useAuth();

  const items = isAdmin ? adminItems : userItems;

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} border-r-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 z-30`}
      collapsible="icon"
    >
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md">
        {!collapsed && (
          <Link to="/">
            <Logo />
          </Link>
        )}
        <SidebarTrigger className={collapsed ? "mx-auto" : ""} />
      </div>

      <SidebarContent className="pt-4 bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? "sr-only" : ""} text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4`}>
            {loading ? "Chargement..." : isAdmin ? "Menu Administrateur" : "Menu Utilisateur"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive(item.url)
                          ? "bg-primary/10 text-primary font-medium shadow-sm" 
                          : "text-muted-foreground hover:bg-muted/30 hover:text-primary hover:translate-x-1"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto mb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Retour au site">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/30 hover:text-primary hover:translate-x-1"
                  >
                    <Home className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Retour au site</span>}
                  </Link>

                </SidebarMenuButton>
                <SidebarMenuButton asChild tooltip="Déconnexion">
                  <div onClick={handleSignOut} className="text-destructive/80 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:translate-x-1">
                    <LogOut className="size-5 flex-shrink-0" />
                    {!collapsed && <span>Déconnexion</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
