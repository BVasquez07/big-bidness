import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { useState, useEffect } from "react";

export default function Complaints({}){

    // state to hold array of objects
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    // tokens are not needed for this component

    // fetch the data from the server
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/get-all-complaint');
                const data = await response.json();
                setComplaints(data[['complaints']]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);



    return(
        <Table>
            <TableCaption>A list of users and the corresponding complaints</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Complaint Details</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Seller Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                ) : (
                    complaints.map((complaint) => (
                        <TableRow key={complaint.complaintid}>
                            <TableCell>{complaint.buyername}</TableCell>
                            <TableCell>{complaint.complaintdetails}</TableCell>
                            <TableCell>{complaint.productname}</TableCell>
                            <TableCell>{complaint.sellername}</TableCell>
                        </TableRow>
                ))
                )}
            </TableBody>
        </Table>
    );
}
