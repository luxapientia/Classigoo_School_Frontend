const menuItems = [
  {
    name: "Home",
    icon: "solar:home-smile-angle-bold-duotone",
    href: "/",
    isMain: true,
    dropdown: [],
  },
  {
    name: "Classrooms",
    icon: "solar:book-2-bold-duotone",
    href: "/classrooms",
    isMain: true,
    dropdown: [],
  },
  {
    name: "Notes",
    icon: "solar:notebook-minimalistic-bold-duotone",
    href: "/notes",
    // isMain: true,
    dropdown: [],
  },
  // {
  //   name: "Parential Control",
  //   icon: "raphael:parent",
  //   href: "#",
  //   dropdown: [
  //     {
  //       name: "Parents",
  //       icon: "solar:user-hands-bold-duotone",
  //       href: "/parential-control/parents",
  //     },
  //     {
  //       name: "Children",
  //       icon: "solar:people-nearby-bold-duotone",
  //       href: "/parential-control/children",
  //     },
  //   ],
  // },
  {
    name: "Learning",
    icon: "solar:lightbulb-bold-duotone",
    href: "/learning",
    dropdown: [],
  },
  {
    name: "Study Helper",
    icon: "solar:chat-round-like-bold-duotone",
    href: "#",
    dropdown: [
      {
        name: "Physics Buddy",
        icon: "solar:ruler-pen-bold-duotone",
        href: "/buddy/physics",
      },
      {
        name: "Chemistry Buddy",
        icon: "solar:test-tube-bold-duotone",
        href: "/buddy/chemistry",
      },
      {
        name: "Math Buddy",
        icon: "solar:calculator-minimalistic-bold-duotone",
        href: "/buddy/math",
      },
    ],
  },
  {
    name: "Labs & Tools",
    icon: "tabler:tools",
    href: "#",
    dropdown: [
      {
        name: "Circuit Simulator",
        icon: "solar:cpu-bolt-bold-duotone",
        href: "/tools/circuit-simulator",
      },
    ],
  },
  {
    name: "Games",
    icon: "solar:gameboy-bold-duotone",
    href: "/games",
    dropdown: [],
  },
  {
    name: "Settings",
    icon: "solar:settings-bold-duotone",
    href: "/settings",
    isMain: true,
    dropdown: [],
  },
];

export default menuItems;
