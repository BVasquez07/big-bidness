'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserApps from "./components/UserAppsTable/UserApps";
import Complaints from "./components/ComplaintsTable/Complaints";
import QuitSys from "./components/QuitSysTable/QuitSys";
import SusUsers from "./components/SusUsersTable/SusUsers";

export default function Listing() {
    return (
        <div className="mt-5 flex justify-center">
            <div className="border-2 rounded-lg p-6 w-[95%] max-w-5xl">
                <Tabs defaultValue="complaints" className="w-full">
                    <TabsList className="flex flex-wrap h-auto justify-center gap-4 text-center py-2">
                        <TabsTrigger value="complaints" className="text-md">Complaints</TabsTrigger>
                        <TabsTrigger value="userApps" className="text-md">User Applications</TabsTrigger>
                        <TabsTrigger value="susUsers" className="text-md">Suspended Users</TabsTrigger>
                        <TabsTrigger value="quitSys" className="text-md">Quitting System</TabsTrigger>
                    </TabsList>
                    <div className="mt-4 overflow-auto max-h-[600px]">
                        <TabsContent value="complaints">
                            <div className="overflow-x-auto">
                                <Complaints />
                            </div>
                        </TabsContent>
                        <TabsContent value="userApps">
                            <div className="overflow-x-auto">
                                <UserApps />
                            </div>
                        </TabsContent>
                        <TabsContent value="susUsers">
                            <div className="overflow-x-auto">
                                <SusUsers />
                            </div>
                        </TabsContent>
                        <TabsContent value="quitSys">
                            <div className="overflow-x-auto">
                                <QuitSys />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
