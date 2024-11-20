import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
export default function QuitSys({}){
    return(
        <Table>
            <TableCaption>A list of users and the corresponding complaints</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">User</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Acct. Balance</TableHead>
                    <TableHead> Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="flex space-x-2 text-right">
                        <Button className="bg-green-300 flex-1">Accept</Button>
                        <Button className="bg-red-300 flex-1">Deny</Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
