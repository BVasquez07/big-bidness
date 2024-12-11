import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { QuitAction } from '../utils/Actions';

export default function QuitSys() {
    const [quitSysList, setQuitSysList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);


    // fetch the data from the server
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/getquittingsys', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                const data = await response.json();
                setQuitSysList(data['Quitting'] || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);


    // function to delete a user using endpoint
const handleQuit = async (userid, application) => {
    try {
        // Send the quit request to the backend
        const response = await fetch('http://localhost:8080/deletefromsys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ userid, application })
        });

        const responseData = await response.json();

        // Check for success
        if (response.ok) {
            if (application) {
                // If application is true, remove the user from the system
                setQuitSysList((prevList) => prevList.filter((quitSys) => quitSys.users.userid !== userid));
            } else {
                // If application is false, remove the user from the quitSys table
                setQuitSysList((prevList) => prevList.filter((quitSys) => quitSys.users.userid !== userid));
            }
        } else {
            console.error("Failed to process quit request", responseData);
        }
    } catch (error) {
        console.error("Error processing quit request:", error);
    } finally {
        console.log("Quit request processing complete.");
    }
};


    return (
        <Table>
            <TableCaption>A list of all users who requested to quit</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Suspension Count</TableHead>
                    <TableHead>Account Bal</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center">
                            <div className="animate-pulse">Loading...</div>
                        </TableCell>
                    </TableRow>
                ) : (
                    quitSysList && quitSysList.length > 0 ? (
                        quitSysList.map((quitSys) => (
                            <TableRow key={quitSys.removal_id}>
                                <TableCell>{quitSys.users.username}</TableCell>
                                <TableCell>{quitSys.removed_at}</TableCell>
                                <TableCell>{quitSys.users.email}</TableCell>
                                <TableCell>{quitSys.users.firstname}</TableCell>
                                <TableCell>{quitSys.users.lastname}</TableCell>
                                <TableCell>{quitSys.users.suspension_count}</TableCell>
                                <TableCell>{quitSys.users.accountbalance}</TableCell>
                                <TableCell className="w-[100px]">
                                    <QuitAction
                                        onQuit={() => handleQuit(quitSys.users.userid, quitSys.application)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </Table>
    );
}

