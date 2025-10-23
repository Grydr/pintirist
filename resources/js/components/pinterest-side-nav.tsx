import { dashboard } from "@/routes";
import { Link } from "@inertiajs/react";
import { Home, Compass, LayoutGrid, Plus, Bell, MessageCircleMore, Settings, User } from "lucide-react";
import { usePage } from "@inertiajs/react";
import type { SharedData } from "@/types";

interface PinterestSideNavProps {
  active?: string;
  onSelect?: (key: string) => void;
}

interface NavItem {
  key: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}

export default function PinterestSideNav({ active = "home", onSelect = () => {} }: PinterestSideNavProps) {
  const { auth } = usePage<SharedData>().props;
  
  const topItems: NavItem[] = [
    { key: "home", label: "Home", Icon: Home },
    { key: "explore", label: "Explore", Icon: Compass },
    { key: "boards", label: "Your boards", Icon: LayoutGrid },
    { key: "create", label: "Create", Icon: Plus },
    { key: "updates", label: "Updates", Icon: Bell },
    { key: "messages", label: "Messages", Icon: MessageCircleMore },
  ];

  const bottomItem: NavItem = { key: "settings", label: "Settings & Support", Icon: Settings };

  return (
    <aside
      className="fixed top-0 left-0 w-[72px] h-screen overflow-y-auto bg-white flex flex-col items-center [padding:0px_0.8px_0px_0px] z-40"
      aria-label="Pinterest side navigation"
    >
      {/* Inner column (48px) with vertical layout like your Figma */}
      <div className="w-[48px] h-full flex flex-col items-start justify-center py-4">
        {/* Two main vertical groups with a large gap (163.2px) */}
        <div className="w-[48px] h-full flex flex-col items-center gap-[163.2px]">
          {/* Top cluster (logo + 6 items) */}
          <div className="w-[48px] h-[408px] flex flex-col items-center gap-6 grow">
            {/* Pinterest Logo */}
            <div className="w-[48px] h-[48px] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#E60023] flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {topItems.map(({ key, label, Icon }) => {
              if (key === 'home') {
                return (
                <Link key={key} href={dashboard()} prefetch>
                <NavIconButton
                  label={label}
                  active={active === key}
                  onClick={() => onSelect(key)}
                >
                  <Icon size={24} />
                </NavIconButton>
                </Link>
                )
              }

              return (
              <NavIconButton
                key={key}
                label={label}
                active={active === key}
                onClick={() => onSelect(key)}
              >
                <Icon size={24} />
              </NavIconButton>
              )
            })}
          </div>

          {/* Bottom settings */}
          <div className="flex flex-col items-center gap-2">
            <NavIconButton
              label={bottomItem.label}
              active={active === bottomItem.key}
              onClick={() => onSelect(bottomItem.key)}
            >
              <bottomItem.Icon size={24} />
            </NavIconButton>
            
            {/* User Profile Button */}
            {auth?.user && (
              <button
                type="button"
                aria-label="User Profile"
                title={auth.user.name}
                className="w-[48px] h-[48px] flex items-center justify-center rounded-full overflow-hidden hover:ring-2 hover:ring-gray-300 transition-all"
              >
                {auth.user.profile_image_url ? (
                  <img 
                    src={auth.user.profile_image_url as string} 
                    alt={auth.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-600" />
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

interface NavIconButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavIconButton({ label, active, onClick, children }: NavIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={[
        "w-[48px] h-[48px]",
        "flex flex-row items-center justify-center",
        "rounded-[16px]",
        active
          ? "bg-black text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
          : "text-black hover:bg-neutral-100 active:bg-neutral-200",
        "transition-colors",
      ].join(" ")}
    >
      {/* icon (24x24) */}
      <div className="w-6 h-6 flex items-center justify-center">{children}</div>
    </button>
  );
}

