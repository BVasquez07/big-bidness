import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table"
import { SuspendAction } from "../utils/Actions";
import { useState, useEffect } from "react";
import { BadgeAlert } from 'lucide-react';

export default function UserApps({}) {

    // state to hold the array of objects
    const [suspendedUsersList, setSuspendedUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);


    // fetch token
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    // fetch the data from the server
    useEffect(() => {
        async function fetchData() {
            if (!token) return;
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/get-suspended', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    }
                });
                const data = await response.json();
                setSuspendedUsersList(data[['suspended']]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);


    // function to unsuspend a user using endpoint
    const handleSuspension = async (userid) => {

        try {
            const response = await fetch('http://localhost:8080/update-suspended', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({ userid })
            });
            if (response.ok) {
                setSuspendedUsersList(newSuspendedUsers => 
                    newSuspendedUsers.filter(suspended => suspended.userid !== userid));
            }
        } catch (error) {
            console.error("Error unsuspending user", error);
        }
    }

    return(
        <Table>
            <TableCaption>A list of all suspended users</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Status?</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>Time Suspended</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
                <div className="animate-pulse">Loading...</div>
            </TableCell>
          </TableRow>
        ) : (
            suspendedUsersList.map((suspended) => (
            <TableRow key={suspended.suspensionid}>
              <TableCell>{suspended.username}</TableCell>
              <TableCell>
              {suspended.is_suspended && (<BadgeAlert color="red" size="24" className="mr-2"/> )}
              </TableCell>
                <TableCell>{suspended.userid}</TableCell>
              <TableCell>{suspended.suspended_at}</TableCell>
              <TableCell className="w-[100px]">
                <SuspendAction
                  onSuspend={() => handleSuspension(suspended.userid)}
                />               
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
        </Table>
    );
}

