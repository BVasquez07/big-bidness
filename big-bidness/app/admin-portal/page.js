'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserApps from "./components/UserAppsTable/UserApps";
import Complaints from "./components/ComplaintsTable/Complaints";
import QuitSys from "./components/QuitSysTable/QuitSys";
import SusUsers from "./components/SusUsersTable/SusUsers";

export default function Listing() {
    return(
        <div className="mt-5 flex justify-center">
            <div className="border-2 rounded-lg p-4">
                <Tabs defaultValue="complaints" className="w-fit h-[500px]">
                    <TabsList className="space-x-3">
                        <TabsTrigger value="complaints" className="text-xl">Complaints</TabsTrigger>
                        <TabsTrigger value="userApps" className="text-xl">User apps</TabsTrigger>
                        <TabsTrigger value="susUsers" className="text-xl">Suspended Users</TabsTrigger>
                        <TabsTrigger value="quitSys" className="text-xl">Quitting System</TabsTrigger>
                    </TabsList>
                    <TabsContent value="complaints">
                        <Complaints />
                    </TabsContent>
                    <TabsContent value="userApps">
                        <UserApps />
                    </TabsContent>
                    <TabsContent value="susUsers">
                        <SusUsers />
                    </TabsContent>
                    <TabsContent value="quitSys">
                        <QuitSys />
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    );
}
