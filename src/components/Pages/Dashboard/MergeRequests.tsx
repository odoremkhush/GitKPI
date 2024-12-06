import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ColTypes, columns, DataTable } from "@/components/mergeComponents/table";
import { format } from "date-fns";

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
import { table } from "console";




export function ComboboxDemo(props: any) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<any>("")
    const { projects, selectedProject, setSelectedProject, placeholder } = props;


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
                    className="w-full justify-between overflow-hidden"
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



export default function MergeRequests() {


    const [projects, setProjects] = useState<any>([]);
    const [selectedProject, setSelectedProject] = useState<any>({});

    const [users, setUsers] = useState<any>([]);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [selectedLabels, setSelectedLabels] = useState<any>([]);
    const labels: any = [
        {
            label: 'all',
            value: 'all'
        },
        {
            label: 'opened',
            value: 'opened'
        },
        {
            label: 'closed',
            value: 'closed'
        },
        {
            label: 'merged',
            value: 'merged'
        },
    ];

    const [fromDateChanged, setFromDateChanged] = useState<boolean>(false);
    const [endDateChanged, setEndDateChanged] = useState<boolean>(false);

    const [tableData, setTableData] = useState<any>([]);

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

        // axios.get(`${GITLAB_URL}/projects/${selectedProject.value}/merge_requests/`, BASE_HEADERS)
        //     .then((response: any) => {
        //         if (response.data) {
        //             setTableData(response.data.map((mr: any) => ({
        //                 id: mr.id,
        //                 iid: mr.iid,
        //                 title: mr.title,
        //                 state: mr.state,
        //                 created_at: mr.created_at,
        //                 updated_at: mr.updated_at,
        //                 labels: mr.labels,
        //                 author: mr.author.name,
        //                 author_id: mr.author.id,
        //             })));
        //         }
        //     }
        //     );

    }, [selectedProject]);

    useEffect(() => {
        let url: string = `${GITLAB_URL}/projects/${selectedProject.value}/merge_requests/`;
        let params: any = {};
        if (selectedLabels.length > 0) {
            params['state'] = selectedLabels.join(',');
        }
        if (selectedUsers.length > 0) {
            params['author_id'] = selectedUsers.join(',');
        }
        if (fromDateChanged) {
            params['created_after'] = fromDate.toISOString();
        }

        if (endDateChanged) {
            params['created_before'] = endDate.toISOString();
        }
        console.log(params);

        axios.get(url, { headers: { ...BASE_HEADERS.headers, params } })
            .then((response: any) => {
                if (response.data) {
                    let tempData = response.data.map((mr: any) => ({
                        id: mr.project_id,
                        iid: mr.iid,
                        title: mr.title,
                        state: mr.state,
                        created_at: format(new Date(mr.created_at), 'dd/MM/yyyy'),
                        updated_at: format(new Date(mr.updated_at), 'dd/MM/yyyy'),
                        labels: mr.labels,
                        author: mr.author.name,
                        author_id: mr.author.id,
                    }));
                    setTableData(tempData);
                }
            })
            .catch((error: any) => {
                console.log(error);
            });

    }, [selectedUsers, selectedProject, fromDate, endDate, selectedLabels]);


    useEffect(() => {
        console.log(tableData);
    }, [tableData]);




    return (
        <div className="w-full p-9">
            <div className="w-full flex justify-between p-3">
                <h1 className='text-4xl font-bold'>
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

                                <Label className="pl-2">Project</Label>
                                <ComboboxDemo projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} placeholder="project" />

                                <Label className="pl-2" >Authors</Label>
                                <MultiSelect options={users} onValueChange={function (value: string[]): void {
                                    setSelectedUsers(value);
                                    console.log(value);
                                }}
                                    variant="inverted"
                                    placeholder="Select Users..."
                                    className="overflow-hidden " />

                                <Label className="pl-2">Labels</Label>
                                <ComboboxDemo projects={labels} selectedProject={selectedLabels} setSelectedProject={setSelectedLabels} placeholder="label" />

                                <Label className="pl-2">Start Date</Label>
                                <DatePickerDemo date={fromDate} setDate={setFromDate} dateChanged={fromDateChanged} setDateChanged={setFromDateChanged} />

                                <Label className="pl-2">End Date</Label>
                                <DatePickerDemo date={endDate} setDate={setEndDate} dateChanged={endDateChanged} setDateChanged={setEndDateChanged} />



                            </div>
                        </form>

                    </CardContent>
                </Card>
                <div className="container flex-grow mx-auto  pr-6">
                    <DataTable columns={columns} data={tableData} />
                </div>
            </div>


        </div>
    )
}