import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import TableRowContent from "../utils/TableRowContent";

export default function UserApps({}){
    /* The test status can have three modes:pending, failed, passed */
    const arr_obj = [
        { keys:[0, 1, 2, 3, 4], user: "Alice", item2: 'She never sent my item', item3: '$30' },
        { keys:[5, 6, 7, 8, 9], user: "Bob", item2: 'Started hitting on me and begging for my number', item3: '$400' },
        { keys:[10, 11, 12, 13], user: "Charlie", item2: 'Sent the wrong item', item3: '$30000' }
    ]

    return(
        <Table>
            <TableCaption>A list of potential users wanting to do bidness</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">User</TableHead>
                    <TableHead>Test status</TableHead>
                    <TableHead>Acct. Balance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRowContent
                    ArrOfObj={arr_obj}
                    addActions={true}
                />
            </TableBody>
        </Table>
    );
}