"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardTemplate from './card-template';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ErrorAlert } from "./error";

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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [mathQuestion, setMathQuestion] = useState("");

    // Create a form object
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            mathAnswer: "",
        },
    });

    // Generate a math question
    useEffect(() => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        setMathQuestion(`${num1} + ${num2} = ?`);
    }, []);

    // Define the form submission handler
    const onSubmit = (data) => {
        const question = mathQuestion;
        const formDataWithQuestion = { ...data, question };
        console.log(formDataWithQuestion);
        fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataWithQuestion),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setError(null);
                    setSuccess("Account created successfully. Please check your email to verify your account.");
                }
            })
            .catch(() => setError("An unexpected error occurred. Please try again."));
    };

    return (
        <>
            <div className="w-full flex justify-center z-50">
                {error && (
                    <div className="shadow max-w-md w-full text-center">
                        <ErrorAlert errorMessage={error} />
                    </div>
                )}
                {success && (
                    <div className="shadow max-w-md w-full text-center">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">{success}</strong>
                        </div>
                    </div>
                )}
            </div>
            <section className="h-screen flex items-center justify-center">
                <CardTemplate
                    title="Register an Account"
                    label="Please fill out the form below to register an account."
                    backButtonHref="/auth/login"
                    backButtonText1="Already have an account?"
                    backButtonText2="Sign in here"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="userName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mathAnswer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{mathQuestion}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </form>
                    </Form>
                </CardTemplate>
            </section>
        </>
    );
};

export default RegisterForm;