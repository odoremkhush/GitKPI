import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GITLAB_URL, BASE_HEADERS } from '@/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/loginComponents/Loader';



import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Projects() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const [projects, setProjects] = useState<any[]>([]);

    const colors: string[] = [
        'bg-red-900',
        'bg-blue-900',
        'bg-green-900',
        'bg-yellow-900',
        'bg-pink-900',
        'bg-purple-900',
        'bg-indigo-900',
        'bg-gray-900',
    ]

    useEffect(() => {
        axios.get(`${GITLAB_URL}/projects`, BASE_HEADERS(null))
            .then((response) => {
                setProjects(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);



    return (
        <div className="w-full p-9">
            <div className="w-full flex justify-start p-3">
                <h1 className='text-4xl font-bold'>
                    {'Projects'}
                </h1>

            </div>

            <hr style={{ border: "1px solid #cccccc", width: "100%" }} />


            {isLoading ? (
                <div className="w-full h-[600px] flex  justify-center items-center">
                    <LoadingSpinner size={60} className="m-auto" />
                </div>
            ) :
                <div className="w-full flex flex-col pt-3">

                    {
                        projects.map((project, index) => {
                            return (
                                <Card className="w-full hover:shadow-lg pl-3 pr-3 transition-shadow duration-300 hover:pl-0 hover:pr-0">
                                    <CardHeader >

                                        <div className="flex flex-row justify-between w-full">
                                            <div className="flex flex-row justify-start">
                                                <Avatar className="w-14 h-14">
                                                    <div className={`w-full h-full  text-2xl flex font-bold text-gray-50 justify-center items-center ${colors[index % colors.length]}`}>
                                                        {project.name[0]}
                                                    </div>
                                                </Avatar>
                                                <div className="flex flex-col  justify-between pl-4 ">
                                                    <CardTitle className="text-xl flex  justify-start font-extralight   hover:font-light" onClick={() => {
                                                        navigate('/merge-requests', { state: { selectedProject: project } });
                                                    }}  >
                                                        {project.name}
                                                    </CardTitle>
                                                    <CardDescription className="flex text-lg justify-start">
                                                        Project Id: {project.id}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-center">
                                                <Button onClick={() => {
                                                    window.open(project.web_url, '_blank');
                                                }}>
                                                    View on Gitlab
                                                </Button>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            )
                        })
                    }

                </div>
            }

        </div>
    )
}
