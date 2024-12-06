import * as React from "react"


import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import logo from "@/../public/logo.png"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import axios from 'axios'

import { cn } from '@/lib/utils'
import { BASE_HEADERS, GITLAB_URL } from "@/constants"
import { useNavigate } from "react-router-dom"

function Login() {

  const navigate = useNavigate();

  const [entered_username, setEnteredUsername] = React.useState<string>('')
  const [entered_password, setEnteredPassword] = React.useState<string>('')

  


  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [wrongPassword, setWrongPassword] = React.useState<boolean>(false)



  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-[350px] rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            <img src={logo} alt="Logo" className="inline-block w-9 h-9 mr-2 mb-2" />
            GitKPI
          </CardTitle>
          {wrongPassword ? (
            <CardDescription className="text-red-500"> Invalid Username or Private Key</CardDescription>
          ) : (<CardDescription  > Login with Your Username and Private Key</CardDescription>)}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="flex justify-start">Username</Label>
                <Input id="name" placeholder="Enter Username..." 
                  onChange={(e) => setEnteredUsername(e.target.value)}
                />
              </div>
              <div className="relative flex flex-col space-y-1.5">
                <Label htmlFor="password" className="flex justify-start">Private Key</Label>

                <Input
                  type={showPassword ? 'text' : 'password'}
                  className={cn('hide-password-toggle pr-10')}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent hover:bg-transparent "
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => {
            axios.get(`${GITLAB_URL}/user`, BASE_HEADERS(entered_password))
              .then(
                (response: any) => {
                  if (response.data) {
                    if(response.data.username === entered_username){
                      setWrongPassword(false)
                      localStorage.setItem('username', entered_username)
                      localStorage.setItem('private_key', entered_password)
                      navigate('/projects')
                    }
                    else {
                      setWrongPassword(true)
                    }
                  }
                  else {
                    setWrongPassword(true)
                  }
                }
              )
              .catch((error: any) => {
                console.log(error)
                setWrongPassword(true)
              })
            

          }}>Login</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login;