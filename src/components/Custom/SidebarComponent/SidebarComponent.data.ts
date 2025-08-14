
import {  PageType } from "./Sidebar.types";
import { ParkingMeter, Cable, AlarmSmoke, Droplets, FireExtinguisher ,AudioLines,TvMinimalPlay,Dot,Dice6,Activity,Waves, History} from "lucide-react"
// Menu items.
export const linkRoutes:  PageType[] = [
  
  
  {
    title: "Monitoreo",
    url: '#',
    icon: TvMinimalPlay,
    pages:[
      {
    title: "Aire Acondicionado",
    url: "#",
    icon: AlarmSmoke,
    pages: [
      {
        title: 'Controlador 1',
        url: '/dashboard-iot/monitoreo/aire-acondicionado/1',
        icon: Dot, 
      },
      {
        title: 'Controlador 2',
        url: '/dashboard-iot/monitoreo/aire-acondicionado/2',
        icon: Dot,
      },
    ]
  },
  {
    title: "Sistema contra Incendio",
    url: '/dashboard-iot/monitoreo/sistema-contra-incendios',
    icon: FireExtinguisher,
  },
  {
    title: 'Tableros de Energia',
    url: '#',
    icon: Cable,
    pages: [
      {
        title: 'Tabero 1',
        url: '/dashboard-iot/monitoreo/tableros-energia/tableros/1',
        icon: Dot,
      },
    ]
  },
  {
    title: "Bombas de Agua",
    url: "#",
    icon: Droplets,
    pages: [
      {
        title: 'Estado',
        url: '#',
        icon: Activity,
        pages:[
          {
            title: 'Agua Potable',
            url: '/dashboard-iot/monitoreo/bombas-agua/estado/agua-potable',
            icon: Dot,
          },
          {
            title: 'Aguas Tratadas',
            url: '/dashboard-iot/monitoreo/bombas-agua/estado/aguas-tratadas',
            icon: Dot,
          },
          {
            title: 'Aguas Grises',
            url: '/dashboard-iot/monitoreo/bombas-agua/estado/aguas-grises',
            icon: Dot,
          }
        ]
      },
      {
        title: 'Variadores',
        url: '#',
        icon: Dice6,
        pages:[
          {
            title: 'Agua Potable',
            url: '/dashboard-iot/monitoreo/bombas-agua/variadores/agua-potable',
            icon: Dot,
          },
          {
            title: 'Agua Potable 2',
            url: '/dashboard-iot/monitoreo/bombas-agua/variadores/agua-potable-2',
            icon: Dot,
          },
          {
            title: 'Aguas Tratadas',
            url: '/dashboard-iot/monitoreo/bombas-agua/variadores/aguas-tratadas',
            icon: Dot,
          }
        ]
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
        url: '/dashboard-iot/monitoreo/estacionamientos/sotanos/1',
        icon: Dot,
      },
      {
        title: 'Sotano 2',
        url: '/dashboard-iot/monitoreo/estacionamientos/sotanos/2',
        icon: Dot,
      },
      {
        title: 'Sotano 3',
        url: '/dashboard-iot/monitoreo/estacionamientos/sotanos/3',
        icon: Dot,
      },
      {
        title: 'Sotano 4',
        url: '/dashboard-iot/monitoreo/estacionamientos/sotanos/4',
        icon: Dot,
      }
    ]
  },
  {
    title: "Concentracion de CL",
    url: "#",
    pages: [
      {
        title: 'Piscinas',
        url: '/dashboard-iot/monitoreo/concentracion-cloro/piscinas',
        icon: Dot,
      },
    ],
    icon: Droplets,
  },
  {
    title: "Concentracion de Co2",
    url: '/dashboard-iot/monitoreo/concentracion-co2',
    icon: AudioLines,
  },
  {
    title: "Automatizacion Chosica",
    url: '/dashboard-iot/monitoreo/bombas-agua-chosica',
    icon: Waves,
  }
    ]
  },
  {
    title: "Historical",
    url: '/dashboard-iot/historico',
    icon: History,
  }
]