import { TableCell, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react";
import {Actions, XAction} from "./Actions";



export default function TableRowContent ({ArrOfObj, addActions=false, xOnly=false}){
    const [allTableItems, setAllTableItems] = useState(ArrOfObj);

    return(
        allTableItems.map(
            ({keys, user, item2, item3}) => {
                return(
                    <TableRow key={keys[0]}>
                        <TableCell key={keys[1]} className="font-medium">{user}</TableCell>
                        <TableCell key={keys[2]}>{item2}</TableCell>
                        <TableCell key={keys[3]}>{item3}</TableCell>
                        {addActions ? <TableCell key={keys[4]}><Actions/></TableCell> : null}
                        {xOnly ? <TableCell key={keys[4]}><XAction/></TableCell> : null}
                    </TableRow>
                )})
    );
};