
import { LinkRouteType } from "./Sidebar.types";
import { ParkingMeter, Cable, AlarmSmoke, Droplets, FireExtinguisher ,Vault,Waves,AudioLines} from "lucide-react"
// Menu items.
export const linkRoutes: LinkRouteType[] = [

  {
    title: "Aire Acondicionado",
    url: "#",
    icon: AlarmSmoke,
    pages: [
      {
        title: 'Controlador 1',
        url: '/aire-acondicionado/1'
      },
      {
        title: 'Controlador 2',
        url: '/aire-acondicionado/2'
      },
    ]
  },
  {
    title: "Sistema contra Incendio",
    url: "/sistema-contra-incendios",
    icon: FireExtinguisher,
  },
  {
    title: "Tableros de Energia",
    url: "/tableros",
    icon: Cable,
  },
  {
    title: "Bombas",
    url: "#",
    icon: Droplets,
    pages: [
      {
        title: 'Agua Potable',
        url: '/bombas/agua-potable'
      },
      {
        title: 'Aguas Grises',
        url: '/bombas/aguas-grises'
      },
      {
        title: 'Aguas Tratadas',
        url: '/bombas/aguas-tratadas'
      },
    ]

  },
  {
    title: "Variadores",
    url: "#",
    icon: Vault,
    pages: [
      {
        title: 'Agua Potable',
        url: '/variadores/agua-potable'
      },
      {
        title: 'Aguas Grises',
        url: '/variadores/aguas-grises'
      },
      {
        title: 'Aguas Tratadas',
        url: '/variadores/aguas-tratadas'
      },
    ]

  },
  {
    title: "Estacionamiento",
    url: "#",
    icon: ParkingMeter,
    pages: [
      {
        title: 'Sotano 1',
        url: '/estacionamientos/sotanos/1'
      },
      {
        title: 'Sotano 2',
        url: '/estacionamientos/sotanos/2'
      },
      {
        title: 'Sotano 3',
        url: '/estacionamientos/sotanos/3'
      },
      {
        title: 'Sotano 4',
        url: '/estacionamientos/sotanos/4'
      }
    ]
  },
  {
    title: "Piscinas",
    url: "/piscinas",
    icon: Waves,
  },
  {
    title: "Concentracion de CO2",
    url: "/co2",
    icon: AudioLines,
  }
]