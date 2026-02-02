import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Sun, Moon, Monitor, ChevronDown, Globe, Check, Wallet, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isArbitrator } from "@/data/mock-data";
import { useTheme } from "@/components/theme-provider";
import { useWallet } from "@/lib/use-wallet";
import { useWeb3ModalTheme } from "@/lib/web3-modal";
import { useOOA } from "@/lib/use-ooa";

const languages = [
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文" },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const {
    address,
    displayAddress,
    isConnected,
    isConnecting,
    isDisconnecting,
    disconnect,
    openModal
  } = useWallet();
  const { isArbitrator: isArbitratorFromContract } = useOOA();

  // 同步 Web3Modal 主题
  useWeb3ModalTheme();

  // 使用合约调用判断是否为仲裁委员，如果合约地址未配置则回退到 mock 数据
  const userIsArbitrator = address
    ? (isArbitratorFromContract || isArbitrator(address))
    : false;

  // 搜索功能
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;

    if (searchQuery.trim()) {
      navigate(`/resolutions?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/resolutions');
    }
  };

  const navItems = [
    { label: t("nav.resolutions"), href: "/resolutions" },
    { label: t("nav.arbitration"), href: "/arbitration", requireArbitrator: true },
  ];

  // 过滤导航项（仲裁管理仅委员可见）
  const filteredNavItems = navItems.filter(
    (item) => !item.requireArbitrator || userIsArbitrator
  );

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <header className="w-full pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-[45px] px-3 border border-border">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo - 根据主题切换 */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Orbit"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/logo-dark.png"
                alt="Orbit"
                className="h-8 w-auto hidden dark:block"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Search + Theme + User + Login */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                type="text"
                placeholder={t("header.search")}
                className="w-32 lg:w-40 pl-9 h-9 bg-secondary border-transparent text-foreground placeholder:text-muted-foreground rounded-full focus-visible:ring-0 focus-visible:border-transparent"
              />
            </form>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-secondary rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  {theme === "light" && <Sun className="h-4 w-4" />}
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                  {theme === "system" && <Monitor className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    {t("theme.light")}
                  </span>
                  {theme === "light" && <Check className="h-4 w-4 text-emerald-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    {t("theme.dark")}
                  </span>
                  {theme === "dark" && <Check className="h-4 w-4 text-emerald-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    {t("theme.system")}
                  </span>
                  {theme === "system" && <Check className="h-4 w-4 text-emerald-500" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 h-9 bg-secondary rounded-full text-foreground hover:bg-accent"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{currentLanguage.label}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="flex items-center justify-between"
                  >
                    {lang.label}
                    {i18n.language === lang.code && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Login / User Menu */}
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={isDisconnecting}
                    className="flex items-center gap-2 px-3 h-9 bg-secondary rounded-full text-foreground hover:bg-accent"
                  >
                    <Wallet className="h-4 w-4 text-emerald-500" />
                    {isDisconnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-sm font-medium">{displayAddress}</span>
                    )}
                    {!isDisconnecting && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => disconnect()}
                    disabled={isDisconnecting}
                    className="flex items-center gap-2 text-red-500 focus:text-red-500"
                  >
                    {isDisconnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {t("header.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={openModal}
                disabled={isConnecting}
                className="h-9 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium flex items-center gap-2"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                {t("header.walletLogin")}
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
