import React, { useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { ColDef } from 'ag-grid-community'; // Column Definition for the Data Grid

import { MultiLineComponent } from "@/components/visualComponents/charts.tsx"

import { Card, CardContent } from "@/components/ui/card"

import { Label } from "@/components/ui/label";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import axios from "axios";

import { DatePickerDemo } from "@/components/ui/datepicker";

import { GITLAB_URL, BASE_HEADERS } from "@/constants.tsx"

import { Button } from "@/components/ui/button";

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
import { set } from "date-fns";
import { table } from "console";

interface tableDataType {
    author: string,
    author_id: Number,
    total_prs: Number,
    merged_prs: Number,
    rejected_prs: Number,
    timeliness_score: Number,
    quality_score: Number,
    total_score: Number,
    normalized_score: Number
}


export function ComboboxDemo(props: any) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<any>("")
    const { projects, selectedProject, setSelectedProject, placeholder, nClass } = props;


    // useEffect(() => {
    //     console.log(value);
    //     console.log(selectedProject);
    // }, [value]);


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between overflow-hidden ${nClass}`}
                >
                    {value
                        ? projects.find((project: any) => project.label === value)?.label
                        : `Select ${placeholder}..`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={`Search ${placeholder}.`} />
                    <CommandList>
                        <CommandEmpty>No {placeholder} Found </CommandEmpty>
                        <CommandGroup>
                            {projects.map((project: any) => (
                                <CommandItem
                                    key={project.value}
                                    value={project.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                        console.log(currentValue, projects);
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




export default function Visualization() {


    const [projects, setProjects] = useState<any>([]);
    const [selectedProject, setSelectedProject] = useState<any>({});


    const [users, setUsers] = useState<any>([]);


    const [tableData, setTableData] = useState<Array<tableDataType>>([]);
    const columns: ColDef<tableDataType>[] = [
        { headerName: 'Author', field: 'author' },
        { headerName: 'Total Pull Requests', field: 'total_prs' },
        { headerName: 'Merged Pull Requests', field: 'merged_prs' },
        { headerName: 'Rejected Pull Requests', field: 'rejected_prs' },
        { headerName: 'Timeliness Score', field: 'timeliness_score' },
        { headerName: 'Quality Score', field: 'quality_score' },
        { headerName: 'Total Score', field: 'total_score' },
        { headerName: 'Normalized Score', field: 'normalized_score' }
    ];

    useEffect(() => {
        console.log(tableData);
    }, [tableData]);

    useEffect(() => {
        if (users.length > 0) {
            console.log('users', users);
            let data: any = users.map((user: any) => {
                axios.get(`${GITLAB_URL}/projects/${selectedProject.value}/merge_requests?author_id=${user?.id}&state=all`, BASE_HEADERS)
                    .then((response: any) => {
                        try {
                            if (response.data) {
                                let total_prs = response.data.length;
                                let merged_prs = response.data.filter((pr: any) => pr.state === 'merged').length;
                                let rejected_prs = response.data.filter((pr: any) => pr.state === 'closed').length;
                                let timeliness_score = 0;
                                let quality_score = 0;
                                let total_score = 0;
                                let normalized_score = 0;

                                let tableRow: tableDataType = {
                                    author: user.name,
                                    author_id: user.id,
                                    total_prs: total_prs,
                                    merged_prs: merged_prs,
                                    rejected_prs: rejected_prs,
                                    timeliness_score: timeliness_score,
                                    quality_score: quality_score,
                                    total_score: total_score,
                                    normalized_score: normalized_score
                                };
                                console.log(1);
                                setTableData((tableData: any) => [...tableData, tableRow]);

                            }


                        }
                        catch (e) {
                            console.log(e);
                            console.log(response);
                        }
                    })
            });
        }
    }, [users]);


    useEffect(() => {

        setTableData((tableData: any) => []);
        if (selectedProject.value) {
            axios.get(`${GITLAB_URL}/projects/${selectedProject.value}/members/all`, BASE_HEADERS)
                .then((response: any) => {
                    try {
                        if (response.data) {
                            setUsers(response.data.map((user: any) => ({
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                state: user.state,
                                avatar_url: user.avatar_url,
                                web_url: user.web_url,
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
        }

    }, [selectedProject]);



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


    return (
        <div className="w-full p-9">
            <div className="w-full flex justify-between p-3">
                <h1 className='text-4xl font-bold'>
                    {'Visualization'}
                </h1>
                <span className='flex items-center'>
                    <Button>{'Download'}</Button>
                </span>
            </div>

            <hr style={{ border: "1px solid #cccccc", width: "100%" }} />

            <div className="w-full flex flex-row-reverse  pt-8">

                <div className="flex flex-row-reverse m-0 ">
                    <Card className="w-72">
                        <CardContent className="p-3">
                            <form>
                                <div className="flex flex-col items-start w-full p-0 pt-6  gap-4">
                                    {/* <div className="flex flex-col items-start space-y-1.5">
                                    
                                    <Input id="name" placeholder="Select Project..." />
                                </div> */}
                                    {/* <Label htmlFor="name">Project</Label> */}

                                    <Label className="pl-2">Project</Label>
                                    <ComboboxDemo projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} placeholder="project" />

                                    <Label className="pl-2" >Authors</Label>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>


                <div className="w-full">
                    <div className="flex w-1/2 pr-6">
                        <MultiLineComponent />
                    </div>
                </div>

            </div>


        </div>
    )
}