"use client"
import OrgSwitcher from '@/components/orgswitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from '@/lib/validators';
import createProject from '@/actions/projects';
import useFetch from "@/hooks/use-fetch";


const CreateProjectPage = () => {
    const router = useRouter();
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectSchema),
    });

    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            setIsAdmin(membership.role === "org:admin");
        }
    }, [isOrgLoaded, isUserLoaded, membership]);

    const {
        loading,
        error,
        data: project,
        fn: createProjectFn,
    } = useFetch(createProject);

    const onSubmit = async (data:any) => {
        if (!isAdmin) {
            alert("Only organization admins can create projects");
            return;
        }

        createProjectFn(data);
    };

    useEffect(() => {
        if (project) router.push(`/project/${project.id}`);
    }, [loading]);

    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col gap-2 items-center">
                <span className="text-2xl gradient-title">
                    Oops! Only Admins can create projects.
                </span>
                <OrgSwitcher />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
                Create New Project
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
            >
                <div>
                    <Input
                        id="name"
                        {...register("name")}
                        className="bg-slate-950"
                        placeholder="Project Name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                    )}
                </div>


                <div>
                    <Input
                        id="key"
                        {...register("key")}
                        className="bg-slate-950"
                        placeholder="Project Key (Ex: RCYT)"
                    />
                    {errors.key && (
                        <p className="text-red-500 text-sm mt-1">{errors.key.message as string}</p>
                    )}
                </div>


                <div>
                    <Textarea
                        id="description"
                        {...register("description")}
                        className="bg-slate-950 h-28"
                        placeholder="Project Description"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description.message as string}
                        </p>
                    )}
                </div>


                {loading && (
                    <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                )}
                <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="bg-blue-500 text-white"
                >
                    {loading ? "Creating..." : "Create Project"}
                </Button>
                {error && <p className="text-red-500 mt-2">{error.message}</p>}
            </form>
        </div>
    );
}

export default CreateProjectPage