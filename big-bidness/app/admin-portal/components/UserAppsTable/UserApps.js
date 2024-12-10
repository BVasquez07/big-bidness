import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table"
import { Actions, XAction } from "../utils/Actions";
import { useState, useEffect } from "react";
import { set } from "zod";

export default function UserApps({}) {

    // state to hold the array of objects
    const [approvalList, setApprovalList] = useState([]);
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
                const response = await fetch('http://localhost:8080/approval-list', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                const data = await response.json();
                setApprovalList(data[['Approval List']]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);

    // function to approve a user using endpoint
    const handleApprove = async (username) => {
        try {
            const response = await fetch('http://localhost:8080/approve-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({ username })
            });yeah
            if (response.ok) {
                setApprovalList(approvalList.filter(item => item.username !== username));
                console.log("User approved");
            } else {
                console.error("Failed to approve user");
                }
            } catch (error) {  
                console.error("Error approving user", error);
            
            }
    }

    // function to reject user by just hiding the row
    const handleReject = (username) => {
        setApprovalList(approvalList.filter(item => item.username !== username));
    }


    return(
        <Table>
            <TableCaption>A list of potential users wanting to do bidness</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : (
          approvalList.map((item) => (
            <TableRow key={item.approvalid}>
              <TableCell>{item.username}</TableCell>
              <TableCell>{item.applicationdetails}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.question}</TableCell>
              <TableCell>{item.answer}</TableCell>
              <TableCell className="w-[100px]">
                <Actions
                  onApprove={() => handleApprove(item.username)}
                  onReject={() => handleReject(item.username)}
                />               
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
        </Table>
    );
}

