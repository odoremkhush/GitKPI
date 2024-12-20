
import { Button } from "@/components/ui/button"
import { SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { useLocation } from "react-router"
import { useNavigate } from "react-router-dom"

import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect } from "react"

import axios from "axios"

import { BASE_HEADERS, GITLAB_URL } from "@/constants"


export function AppSidebar() {

  const [username, setUsername] = useState<string|null>(localStorage.getItem('username'))
  

  const location = useLocation()

  const { state } = useSidebar();
  const navigate = useNavigate();


  // Menu items.
  const items = [
    {
      title: "Project",
      key: "/project",
      click: () => { navigate("/projects") },
      icon: Home,
    },
    {
      title: "Merge Requests",
      key: "/merge-requests",
      click: () => { navigate("/merge-requests") },
      icon: Inbox,
    },
    {
      title: "Summary",
      key: "/summary",
      click: () => { navigate("/summary") },
      icon: Calendar,
    },
    {
      title: "Visualization",
      key: "/visualization",
      click: () => { navigate("/visualization") },
      icon: Search,
    },
    {
      title: "Users",
      key: "/users",
      click: () => { navigate("/users") },
      icon: Settings,
    },
  ]

  useEffect(() => {
    if (location.pathname === "/") {
      location.pathname = "/projects"

    }
    console.log(location);
  }, [])

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <div className="w-full flex justify-end items-center pt-3 pr-2">
          <SidebarTrigger variant="default" />
        </div>


        <SidebarHeader>
          <div className={`flex items-center space-x-4 p-4 ${state === 'collapsed' ? 'hidden' : ''}`}>

            <div className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold transition-all duration-300 ${state === 'collapsed' ? 'w-6 h-6 rounded-full text-sm bg-inherit' : ''}`}>
              {(username ?? '').split('.')[0].charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{(username ?? '').split('.').map((word:any) => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ')}</h2>
              <p className="text-sm text-gray-500">Software Engineer</p>
            </div>
          </div>

        </SidebarHeader>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button variant={item.key === location.pathname ? "default" : "outline"} onClick={item.click}>
                      <item.icon />
                      <span >{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant = "destructive" onClick = {
          () => {
            localStorage.removeItem('username')
            localStorage.removeItem('private_key')
            navigate('/login')
          } 
        }>
          <Settings className="" />
          <span className={state === "collapsed" ? "hidden" : ""}>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}


export default function Layout({ children }: { children: React.ReactNode }) {

  

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username')
    const private_key = localStorage.getItem('private_key')
    axios.get(`${GITLAB_URL}/user`, BASE_HEADERS(private_key))
      .then(
        (response: any) => {
          if (response.data) {
            if (response.data.username !== username) {
              navigate('/login')
            }
          }
          else {
            navigate('/login')
          }
        }
      )
      .catch((error: any) => {
        console.log(error)
        navigate('/login')
      })
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      
      {children}
    </SidebarProvider>
  )
}
