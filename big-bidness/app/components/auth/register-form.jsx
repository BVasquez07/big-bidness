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
const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    userName: z.string().min(1, { message: "User name is required" }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    mathAnswer: z.string().min(1, { message: "Math answer is required" }),
});

// Define the form component
const RegisterForm = () => {

    // Create a form state object with default values
   const [FormData, useFormData] = useState({
        // default values
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            mathAnswer: "",
        },
    });


    // Create a form object
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: FormData.defaultValues,
    });

    // Define the form submission handler (this is where you would send the form data to the server)
    const onSubmit = (data) => {
        console.log("Submitted data", data);
    };

    // Math question generator (this is just a placeholder for now)
    const [mathQuestion, setMathQuestion] = useState("");
    useEffect(() => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        setMathQuestion(`${num1} + ${num2} = ?`);
    }, []);

    // Render the form
    return (
        <section className="h-screen flex items-center justify-center">
        <CardTemplate
            title = "Register an Account"
            label = "Please fill out the form below to register an account."
            backButtonHref = "/auth/login"
            backButtonText1 = "Already have an account?"
            backButtonText2 = "Sign in here"
        >

            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control = {form.control}
                            name = "firstName"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control = {form.control}
                            name = "lastName"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control = {form.control}
                            name = "userName"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor="userName">Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.userName?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control = {form.control}
                            name = "mathAnswer"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor="mathAnswer">{mathQuestion}</FormLabel>
                                    <FormDescription>Answer the math question above to prove you're human</FormDescription>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.mathAnswer?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                </form>
            </Form>
        </CardTemplate>
        </section>
    );
    }

export default RegisterForm;