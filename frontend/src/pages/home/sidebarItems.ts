import { Files, UsersRound } from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

export type SidebarItemProps = {
  label: string;
  to: string;
  icon: any;
  isActive: boolean;
};

export type SidebarSectionProps = {
  label?: string;
  items: SidebarItemProps[];
};

export function useSidebarItems() {
  const route = useRoute();
  const isActive = (path: string) => route.path === path;

  return computed((): SidebarSectionProps[] => [
    {
      items: [
        {
          label: "All Forms",
          to: "/",
          icon: Files,
          isActive: isActive("/"),
        },
      ],
    },
    {
      items: [
        {
          label: "Team",
          to: "/team",
          icon: UsersRound,
          isActive: isActive("/team"),
        },
      ],
    },
  ]);
}

