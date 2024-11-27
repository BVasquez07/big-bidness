"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardTemplate from './card-template';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FormInput } from "lucide-react";
  

// Define the schema for the form
const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// Define the form component
const LoginForm = () => {

    // Create a form state object with default values
   const [FormData, useFormData] = useState({
        // default values
        defaultValues: {
            email: "",
            password: "",
        },
    });


    // Create a form object
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: FormData.defaultValues,
    });

    // Define the form submission handler (this is where you would send the form data to the server)
    const onSubmit = (data) => {
        console.log("Submitted data", data);
    };


    // Render the form
    return (
        <section className="h-screen flex items-center justify-center">
        <CardTemplate
            title = "Login to your account"
            label = "Please enter your email and password to login"
            backButtonHref = "/auth/register"
            backButtonText1 = "Don't have an account?"
            backButtonText2 = "Sign up here"
        >

            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">

                        <FormField
                            control = {form.control}
                            name = "email"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control = {form.control}
                            name = "password"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full">Login</Button>
                </form>

            </Form>
        </CardTemplate>
        </section>
    );
    }

export default LoginForm;