
import { LinkRouteType } from "./Sidebar.types";
import {ParkingMeter,Cable,LayoutDashboard ,Droplets} from "lucide-react"
// Menu items.
export const linkRoutes:LinkRouteType[] = [
    {
      title: "DashBoard",
      url: "#",
      icon: LayoutDashboard,
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
      pages:[
        {
          title:'Agua Potable',
          url:'/bombas/agua-potable'
        },
        {
          title:'Aguas Grises',
          url:'/bombas/aguas-grises'
        },
        {
          title:'Aguas Tratadas',
          url:'/bombas/aguas-tratadas'
        },
      ]

    },
    {
      title: "Estacionamiento",
      url: "/estacionamientos",
      icon: ParkingMeter,
      pages:[
        {
          title:'Sotano 1',
          url:'/estacionamientos/sotanos/1'
        },
        {
          title:'Sotano 2',
          url:'/estacionamientos/sotanos/2'
        },
        {
          title:'Sotano 3',
          url:'/estacionamientos/sotanos/3'
        },
        {
          title:'Sotano 4',
          url:'/estacionamientos/sotanos/4'
        }
      ]
    },
  
  ]