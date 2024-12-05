import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import axios from "axios";
import { MultiSelect } from "@/components/ui/multiselect";

import { GITLAB_URL, BASE_HEADERS } from "@/constants.tsx"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { DatePickerDemo } from "@/components/ui/datepicker";

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"




export function ComboboxDemo(props: any) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<any>("")

    const { projects, selectedProject, setSelectedProject } = props;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between overflow-hidden"
                >
                    {value
                        ? projects.find((project: any) => project.label === value)?.label
                        : "Select project.."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search Project." />
                    <CommandList>
                        <CommandEmpty>No Project Found </CommandEmpty>
                        <CommandGroup>
                            {projects.map((project: any) => (
                                <CommandItem
                                    key={project.value}
                                    value={project.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                        setSelectedProject(projects.find((project: any) => project.label === currentValue));
                                    }}
                                >
                                    {project.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === project.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}



export default function MergeRequests() {

    const [projects, setProjects] = useState<any>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const [users, setUsers] = useState<any>([]);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    useEffect(() => {
        axios.get(`${GITLAB_URL}/projects/`, BASE_HEADERS)
            .then((response: any) => {
                try {
                    if (response.data) {
                        setProjects(response.data.map((project: any) => ({
                            label: project.name,
                            value: project.id,
                        })));
                    }
                }
                catch (e) {
                    console.log(e);
                    console.log(response);
                }
            })
            .catch((error: any) => {
                console.log(error);
            });


    }, []);

    useEffect(() => {

        if (!selectedProject) {
            return;
        }
        axios.get(`${GITLAB_URL}/projects/${selectedProject.value}/members/all`, BASE_HEADERS)
            .then((response: any) => {
                if (response.data) {
                    setUsers(response.data.map((user: any) => ({
                        label: user.name,
                        value: user.id,
                    })));

                    console.log(response);
                }
            })
            .catch((error: any) => {
                console.log(error);
            });

    }, [selectedProject]);

    useEffect(() => {
        console.log(fromDate);
    }, [fromDate]);



    return (
        <div className="w-full p-9">
            <div className="w-full flex justify-between p-3">
                <h1 className='text-3xl font-bold'>
                    {'Merge Requests'}
                </h1>
                <span className='flex items-center'>
                    <Button>{'Download'}</Button>
                </span>

            </div>

            <hr style={{ border: "1px solid #cccccc", width: "100%" }} />

            <div className="w-full flex flex-row-reverse pt-8 m-0">
                <Card className="w-72">
                    <CardContent className="p-3">
                        <form>
                            <div className="flex flex-col items-start w-full p-0 pt-6  gap-4">
                                {/* <div className="flex flex-col items-start space-y-1.5">
                                    
                                    <Input id="name" placeholder="Select Project..." />
                                </div> */}
                                {/* <Label htmlFor="name">Project</Label> */}

                                <Label className = "pl-2">Project</Label>
                                <ComboboxDemo projects={projects} selectedProject = {selectedProject} setSelectedProject = {setSelectedProject} />
                                
                                <Label className = "pl-2" >Authors</Label>
                                <MultiSelect options={users} onValueChange={function (value: string[]): void {
                                    setSelectedUsers(value);
                                    console.log(value);
                                }}
                                variant = "inverted"
                                placeholder = "Select Users..."
                                className = "overflow-hidden " />
                                
                                <Label className = "pl-2">Start Date</Label>
                                <DatePickerDemo date = {fromDate} setDate = {setFromDate} />
                                
                                <Label className = "pl-2">End Date</Label>
                                <DatePickerDemo date = {endDate} setDate = {setEndDate}/>



                            </div>
                        </form>

                    </CardContent>
                </Card>
            </div>


        </div>
    )
}